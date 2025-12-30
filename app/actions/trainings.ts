'use server'

import { revalidatePath } from 'next/cache';
import { getUserOrgId } from './utils';
import { TrainingSchema } from '@/types/schema';

export async function getTrainings() {
    const { supabase, organizationId } = await getUserOrgId();

    const { data, error } = await supabase
        .from('trainings')
        .select('*, employees(first_name, last_name)')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function assignTraining(formData: FormData) {
    const { supabase, organizationId } = await getUserOrgId();

    const rawData = {
        employee_id: formData.get('employee_id'),
        title: formData.get('title'),
        training_type: formData.get('training_type'),
        provider: formData.get('provider'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        cost: Number(formData.get('cost')), // Convert to number
        status: 'Planned',
    };

    const validatedResult = TrainingSchema.safeParse(rawData);

    if (!validatedResult.success) {
        return { error: 'Invalid data', details: validatedResult.error.flatten() };
    }

    const { error } = await supabase.from('trainings').insert({
        ...validatedResult.data,
        organization_id: organizationId,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/trainings');
    return { success: true };
}

export async function updateTrainingStatus(id: string, status: string) {
    const { supabase, organizationId } = await getUserOrgId();

    // Simple validation
    if (!['Planned', 'In Progress', 'Completed'].includes(status)) {
        return { error: 'Invalid status' };
    }

    const { error } = await supabase
        .from('trainings')
        .update({ status })
        .eq('id', id)
        .eq('organization_id', organizationId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard/trainings');
    return { success: true };
}
