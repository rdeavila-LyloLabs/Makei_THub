'use server'

import { revalidatePath } from 'next/cache';
import { getUserOrgId } from './utils';
import { EmployeeSchema } from '@/types/schema';

export async function getEmployees() {
    const { supabase, organizationId } = await getUserOrgId();

    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createEmployee(formData: FormData) {
    const { supabase, organizationId } = await getUserOrgId();

    const rawData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        position: formData.get('position'),
        department: formData.get('department'),
    };

    const validatedresult = EmployeeSchema.safeParse(rawData);

    if (!validatedresult.success) {
        return { error: 'Invalid data', details: validatedresult.error.flatten() };
    }

    const { error } = await supabase.from('employees').insert({
        ...validatedresult.data,
        organization_id: organizationId,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/employees');
    return { success: true };
}

export async function deleteEmployee(id: string) {
    const { supabase, organizationId } = await getUserOrgId();

    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId); // Extra safety

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/employees');
    return { success: true };
}
