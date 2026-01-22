import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedGoldenPath() {
    console.log('🌟 Starting Golden Path Seed Script...\n');

    try {
        // ------------------------------------------------------------
        // 1. Check for existing vendors or create new ones
        // ------------------------------------------------------------
        console.log('📋 Checking for existing vendors...');

        let eliteVendor, luxeVendor, floralsVendor;

        // Check if vendors already exist
        const { data: existingElite } = await supabase
            .from('vendors')
            .select('id, owner_id')
            .eq('name', 'Elite Photography')
            .maybeSingle();

        const { data: existingLuxe } = await supabase
            .from('vendors')
            .select('id, owner_id')
            .eq('name', 'Luxe Events')
            .maybeSingle();

        const { data: existingFlorals } = await supabase
            .from('vendors')
            .select('id, owner_id')
            .eq('name', 'Dream Florals')
            .maybeSingle();

        if (existingElite && existingLuxe && existingFlorals) {
            console.log('✅ Using existing vendors:');
            console.log(`   - Elite Photography (${existingElite.id})`);
            console.log(`   - Luxe Events (${existingLuxe.id})`);
            console.log(`   - Dream Florals (${existingFlorals.id})\n`);

            eliteVendor = existingElite;
            luxeVendor = existingLuxe;
            floralsVendor = existingFlorals;
        } else {
            console.log('Creating new vendors using existing owner...');

            // Get an existing vendor's owner_id to use (from info@mosquitofl.com)
            const { data: existingVendor } = await supabase
                .from('vendors')
                .select('owner_id')
                .limit(1)
                .single();

            if (!existingVendor) {
                console.error('No existing vendors found. Please create at least one vendor first.');
                return;
            }

            const sharedOwnerId = existingVendor.owner_id;
            console.log(`Using owner_id: ${sharedOwnerId}`);

            // Create vendors directly
            const { data: newElite, error: eliteError } = await supabase
                .from('vendors')
                .insert({
                    owner_id: sharedOwnerId,
                    name: 'Elite Photography',
                    category: 'vendor',
                    type: 'Photography',
                    description: 'Award-winning wedding photography'
                })
                .select('id, owner_id')
                .single();

            const { data: newLuxe, error: luxeError } = await supabase
                .from('vendors')
                .insert({
                    owner_id: sharedOwnerId,
                    name: 'Luxe Events',
                    category: 'planner',
                    type: 'Planning',
                    description: 'Full-service wedding planning'
                })
                .select('id, owner_id')
                .single();

            const { data: newFlorals, error: floralsError } = await supabase
                .from('vendors')
                .insert({
                    owner_id: sharedOwnerId,
                    name: 'Dream Florals',
                    category: 'vendor',
                    type: 'Floral',
                    description: 'Beautiful wedding florals'
                })
                .select('id, owner_id')
                .single();

            if (eliteError || luxeError || floralsError) {
                console.error('Error creating vendors:', { eliteError, luxeError, floralsError });
                return;
            }

            console.log('✅ Created vendors:');
            console.log(`   - Elite Photography (${newElite!.id})`);
            console.log(`   - Luxe Events (${newLuxe!.id})`);
            console.log(`   - Dream Florals (${newFlorals!.id})\n`);

            eliteVendor = newElite!;
            luxeVendor = newLuxe!;
            floralsVendor = newFlorals!;
        }

        // ------------------------------------------------------------
        // 2. Scenario A – Calendar Test (Elite Photography)
        // ------------------------------------------------------------
        console.log('📅 Scenario A: Creating calendar block for Elite Photography...');

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(15);
        const blockedDate = nextMonth.toISOString().split('T')[0];

        // Check if already exists
        const { data: existingBlock } = await supabase
            .from('vendor_availability')
            .select('id')
            .eq('vendor_id', eliteVendor.id)
            .eq('blocked_date', blockedDate)
            .maybeSingle();

        if (!existingBlock) {
            const { error: calendarError } = await supabase
                .from('vendor_availability')
                .insert({
                    vendor_id: eliteVendor.id,
                    blocked_date: blockedDate,
                    reason: 'BOOKED',
                    notes: 'Smith Wedding'
                });

            if (calendarError) {
                console.error('Calendar error:', calendarError);
            } else {
                console.log(`✅ Blocked ${blockedDate} for Smith Wedding\n`);
            }
        } else {
            console.log(`✅ Calendar block already exists for ${blockedDate}\n`);
        }

        // ------------------------------------------------------------
        // 3. Scenario B – Referral Test (Luxe Events)
        // ------------------------------------------------------------
        console.log('🤝 Scenario B: Creating partnerships and referrals for Luxe Events...');

        // Create 3 partner vendors for partnerships (use same owner for simplicity)
        const partnerVendors = [];
        for (let i = 0; i < 3; i++) {
            const { data: partner } = await supabase.from('vendors')
                .upsert({
                    owner_id: luxeVendor.owner_id,
                    name: `Partner Vendor ${i + 1}`,
                    category: 'vendor',
                    type: 'Decor'
                }, { onConflict: 'name' })
                .select('id')
                .single();

            if (partner) {
                partnerVendors.push(partner.id);
            }
        }

        // Create partnerships with different commission rates
        const commissionRates = [10, 15, 20];
        for (let i = 0; i < 3; i++) {
            const { data: existing } = await supabase
                .from('vendor_partnerships')
                .select('id')
                .eq('vendor_id', luxeVendor.id)
                .eq('partner_vendor_id', partnerVendors[i])
                .maybeSingle();

            if (!existing) {
                await supabase.from('vendor_partnerships').insert({
                    vendor_id: luxeVendor.id,
                    partner_vendor_id: partnerVendors[i],
                    default_commission_rate: commissionRates[i],
                    status: 'accepted'
                });
            }
        }
        console.log('✅ Created 3 active partnerships (10%, 15%, 20%)');

        // Create referrals
        const { data: existingPending } = await supabase
            .from('referrals')
            .select('id')
            .eq('from_vendor_id', luxeVendor.id)
            .eq('client_name', 'Pending Client')
            .maybeSingle();

        if (!existingPending) {
            await supabase.from('referrals').insert({
                from_vendor_id: luxeVendor.id,
                to_vendor_id: partnerVendors[0],
                client_name: 'Pending Client',
                client_email: 'pending@example.com',
                event_date: '2026-08-15',
                estimated_value_cents: 500000,
                status: 'sent',
                commission_rate: 10
            });
        }

        const { data: existingPaid } = await supabase
            .from('referrals')
            .select('id')
            .eq('from_vendor_id', luxeVendor.id)
            .eq('client_name', 'Completed Client')
            .maybeSingle();

        if (!existingPaid) {
            await supabase.from('referrals').insert({
                from_vendor_id: luxeVendor.id,
                to_vendor_id: partnerVendors[1],
                client_name: 'Completed Client',
                client_email: 'completed@example.com',
                event_date: '2026-07-01',
                estimated_value_cents: 300000,
                status: 'completed',
                commission_rate: 10,
                actual_value_cents: 300000,
                commission_paid_cents: 30000
            });
        }

        console.log('✅ Created referrals: 1 Pending ($5k), 1 Paid ($3k, $300 commission)\n');

        // Create corresponding payments
        const { data: existingPaidPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('vendor_id', luxeVendor.id)
            .eq('amount_cents', 300000)
            .eq('status', 'PAID')
            .maybeSingle();

        if (!existingPaidPayment) {
            await supabase.from('payments').insert({
                vendor_id: luxeVendor.id,
                user_id: luxeVendor.owner_id,
                amount_cents: 300000,
                status: 'PAID',
                payment_type: 'referral_commission'
            });
        }

        const { data: existingPendingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('vendor_id', luxeVendor.id)
            .eq('amount_cents', 500000)
            .eq('status', 'PENDING')
            .maybeSingle();

        if (!existingPendingPayment) {
            await supabase.from('payments').insert({
                vendor_id: luxeVendor.id,
                user_id: luxeVendor.owner_id,
                amount_cents: 500000,
                status: 'PENDING',
                payment_type: 'referral_commission'
            });
        }

        console.log('✅ Created payment records for finance tracking\n');

        // ------------------------------------------------------------
        // 4. Scenario C – Inquiry Test (Dream Florals)
        // ------------------------------------------------------------
        console.log('💌 Scenario C: Creating lead for Dream Florals...');

        // Use shared owner for couple (for simplicity)
        const coupleUserId = floralsVendor.owner_id;

        // Create their project
        const { data: project } = await supabase.from('projects')
            .upsert({
                user_id: coupleUserId,
                title: 'Sarah & Mike Wedding',
                event_date: '2026-09-20',
                budget: 25000,
                guest_count: 150
            }, { onConflict: 'user_id,title' })
            .select('id')
            .single();

        // Create an asset
        const { data: asset } = await supabase.from('inspiration_assets')
            .upsert({
                vendor_id: floralsVendor.id,
                category_tag: 'Floral',
                cost_model: 'per_guest',
                base_cost_low: 1000,
                base_cost_high: 2000,
                image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552'
            }, { onConflict: 'vendor_id,image_url' })
            .select('id')
            .single();

        if (project && asset) {
            // Check if swipe exists
            const { data: existingSwipe } = await supabase
                .from('user_swipes')
                .select('id')
                .eq('user_id', coupleUserId)
                .eq('asset_id', asset.id)
                .maybeSingle();

            if (!existingSwipe) {
                await supabase.from('user_swipes').insert({
                    user_id: coupleUserId,
                    asset_id: asset.id,
                    project_id: project.id,
                    swipe_direction: 'SUPER_LIKE'
                });
                console.log('✅ Created lead "Sarah & Mike" with status NEW\n');
            } else {
                console.log('✅ Lead "Sarah & Mike" already exists\n');
            }
        }

        console.log('🎉 Golden Path Seed Complete!\n');
        console.log('Test the following:');
        console.log(`1. Elite Photography (${eliteVendor.id}) → Check Calendar for Smith Wedding`);
        console.log(`2. Luxe Events (${luxeVendor.id}) → Check Referrals & Finance`);
        console.log(`3. Dream Florals (${floralsVendor.id}) → Check Leads for Sarah & Mike`);

    } catch (error) {
        console.error('❌ Seed script failed:', error);
    }
}

seedGoldenPath();
