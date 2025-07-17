export const formatKES = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return 'KES 0.00';
    }

    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numAmount);
};

export const formatKESCompact = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return 'KES 0';
    }

    if (numAmount >= 1000000) {
        return `KES ${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
        return `KES ${(numAmount / 1000).toFixed(1)}K`;
    }

    return formatKES(numAmount);
};

export const parseKES = (kesString: string): number => {
    // Remove KES, commas, and spaces, then parse
    const cleanString = kesString.replace(/KES|,|\s/g, '');
    const parsed = parseFloat(cleanString);
    return isNaN(parsed) ? 0 : parsed;
};

// Validation for KES amounts
export const isValidKESAmount = (amount: number): boolean => {
    return !isNaN(amount) && amount >= 0 && amount <= 999999999; // Max ~1 billion KES
};

// Convert USD to KES (approximate rate - you might want to use a real API)
export const usdToKES = (usdAmount: number, exchangeRate: number = 150): number => {
    return usdAmount * exchangeRate;
};

// Common KES amounts for quick selection
export const commonKESAmounts = [
    100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000
];

export default {
    format: formatKES,
    formatCompact: formatKESCompact,
    parse: parseKES,
    isValid: isValidKESAmount,
    usdToKES,
    commonAmounts: commonKESAmounts
};