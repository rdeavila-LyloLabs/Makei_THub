'use server'

import { getUserOrgId } from './utils';

export async function getDashboardStats() {
    const { supabase, organizationId } = await getUserOrgId();

    const { data: trainings, error } = await supabase
        .from('trainings')
        .select('cost, status')
        .eq('organization_id', organizationId);

    if (error) {
        throw new Error(error.message);
    }

    const totalBudget = trainings.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    const activeTrainings = trainings.filter(t => t.status === 'In Progress').length;
    const plannedTrainings = trainings.filter(t => t.status === 'Planned').length;
    const completedTrainings = trainings.filter(t => t.status === 'Completed').length;

    return {
        totalBudget,
        activeTrainings,
        plannedTrainings,
        completedTrainings,
        totalTrainings: trainings.length
    };
}
