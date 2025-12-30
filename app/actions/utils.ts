'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return { user, supabase };
}

export async function getUserOrgId() {
    const { user, supabase } = await getAuthenticatedUser();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

    if (error || !profile?.organization_id) {
        // Fallback: Create Organization and Profile if they don't exist (Lazy Provisioning)
        // This handles cases where DB triggers didn't run or existing users login.
        console.log("Profile not found, creating default organization...");

        const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({ name: 'My Organization' })
            .select('id')
            .single();

        if (orgError || !newOrg) {
            console.error("Failed to create org:", orgError);
            throw new Error('Failed to create default organization');
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                organization_id: newOrg.id,
                role: 'admin',
                first_name: 'Admin',
                last_name: 'User'
            });

        if (profileError) {
            console.error("Failed to create profile:", profileError);
            throw new Error('Failed to create user profile');
        }

        return { organizationId: newOrg.id, user, supabase };
    }

    return { organizationId: profile.organization_id, user, supabase };
}
