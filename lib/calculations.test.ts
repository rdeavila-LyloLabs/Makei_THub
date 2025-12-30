import { calculateTotalBudget, formatCurrency } from './calculations'

describe('Budget Calculations', () => {
    test('calculates total budget correctly', () => {
        const trainings = [
            { cost: 100 },
            { cost: '200' },
            { cost: 50.50 },
            { cost: null },
        ];

        // 100 + 200 + 50.50 + 0 = 350.50
        expect(calculateTotalBudget(trainings)).toBe(350.50);
    });

    test('handles empty array', () => {
        expect(calculateTotalBudget([])).toBe(0);
    });
});

describe('Currency Formatting', () => {
    test('formats number to USD', () => {
        expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    test('formats zero correctly', () => {
        expect(formatCurrency(0)).toBe('$0.00');
    });
});
