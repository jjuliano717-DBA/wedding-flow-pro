import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook to subscribe to real-time changes on the vendors table
 * Triggers callback when any vendor record is updated
 * 
 * @param onUpdate - Callback function to execute when vendors table is updated
 */
export function useVenueSync(onUpdate: () => void) {
    useEffect(() => {
        const channel = supabase
            .channel('vendors_changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'vendors',
            }, () => {
                console.log('Vendor data updated - triggering refresh');
                onUpdate();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [onUpdate]);
}
