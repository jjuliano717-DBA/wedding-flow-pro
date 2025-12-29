import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../_lib/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user_id, asset_id, swipe_direction, project_id } = req.body;

    if (!user_id || !asset_id || !swipe_direction || !project_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Record the swipe in user_swipes
        const { error: swipeError } = await supabaseAdmin
            .from('user_swipes')
            .upsert({
                user_id,
                asset_id,
                swipe_direction,
                project_id
            }, { onConflict: 'user_id,asset_id,project_id' });

        if (swipeError) throw swipeError;

        // Only proceed with budget candidate logic if it's a positive swipe
        if (swipe_direction === 'LEFT') {
            return res.status(200).json({ status: 'success', message: 'Swipe recorded' });
        }

        // 2. Fetch Context: Project guest_count and tax_rate
        const { data: project, error: projectError } = await supabaseAdmin
            .from('projects')
            .select('guest_count, tax_rate')
            .eq('id', project_id)
            .single();

        if (projectError) throw projectError;

        // 3. Fetch Asset: cost details
        const { data: asset, error: assetError } = await supabaseAdmin
            .from('inspiration_assets')
            .select('*')
            .eq('id', asset_id)
            .single();

        if (assetError) throw assetError;

        // 4. Calculate "Real Cost"
        const guest_count = project.guest_count || 100;
        const tax_rate = project.tax_rate !== null ? Number(project.tax_rate) : 0.08;
        const service_fee_pct = asset.min_service_fee_pct !== null ? Number(asset.min_service_fee_pct) : 0.20;

        let base_cost = 0;
        // Requirement: use average of low and high for estimation
        const avg_base = Math.round((asset.base_cost_low + asset.base_cost_high) / 2);

        if (asset.cost_model === 'per_guest') {
            base_cost = avg_base * guest_count;
        } else if (asset.cost_model === 'per_hour') {
            // Default to 4 hours for calculation if per_hour
            base_cost = avg_base * 4;
        } else {
            // flat_fee
            base_cost = avg_base;
        }

        const service_fee = Math.round(base_cost * service_fee_pct);
        const tax = Math.round((base_cost + service_fee) * tax_rate);
        const total_real = base_cost + service_fee + tax;

        // 5. Slot Check: Find or create a matching budget slot for the category
        let { data: slot, error: slotError } = await supabaseAdmin
            .from('budget_slots')
            .select('id')
            .eq('project_id', project_id)
            .eq('category', asset.category_tag)
            .single();

        if (slotError && slotError.code !== 'PGRST116') throw slotError;

        if (!slot) {
            // Create a default slot if none exists
            const { data: newSlot, error: createSlotError } = await supabaseAdmin
                .from('budget_slots')
                .insert({
                    project_id,
                    category: asset.category_tag,
                    target_budget: base_cost, // Use base cost as initial target
                    status: 'OPEN'
                })
                .select('id')
                .single();

            if (createSlotError) throw createSlotError;
            slot = newSlot;
        }

        // 6. Add Candidate to Slot
        const { error: candidateError } = await supabaseAdmin
            .from('budget_candidates')
            .insert({
                slot_id: slot.id,
                source_asset_id: asset_id,
                calculated_cost_pretax: base_cost,
                calculated_total_real: total_real,
                is_selected: false,
                notes: `Automatically added from swipe. Base: $${(base_cost / 100).toLocaleString()}, Service Fee: ${(service_fee_pct * 100).toFixed(0)}%, Tax: ${(tax_rate * 100).toFixed(1)}%`
            });

        if (candidateError) throw candidateError;

        // FORMAT RETURN VALUES
        const formatCurrency = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        return res.status(200).json({
            status: 'success',
            budget_impact: {
                base: formatCurrency(base_cost),
                service_fee: formatCurrency(service_fee),
                tax: formatCurrency(tax),
                total: formatCurrency(total_real),
                breakdown: `${formatCurrency(base_cost)} + ${formatCurrency(service_fee + tax)} Tax/Tip`
            }
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
