export function calculateTotalBudget(trainings: { cost: number | string | null }[]) {
    return trainings.reduce((acc, curr) => {
        const cost = Number(curr.cost) || 0;
        return acc + cost;
    }, 0);
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
