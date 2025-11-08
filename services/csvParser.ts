
import type { Transaction } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const parseBank1 = (lines: string[]): Transaction[] => {
    const transactions: Transaction[] = [];
    const headerIndex = lines.findIndex(line => line.startsWith('Type,Product,Started Date'));
    if (headerIndex === -1) return [];

    const dataLines = lines.slice(headerIndex + 1);

    for (const line of dataLines) {
        const columns = line.split(',');
        if (columns.length < 7) continue;

        const date = columns[3].split(' ')[0]; // Completed Date
        const description = columns[4];
        const amount = parseFloat(columns[5]);
        const currency = columns[7];

        if (!isNaN(amount) && description) {
            transactions.push({
                id: generateId(),
                date,
                description,
                amount,
                currency,
            });
        }
    }
    return transactions;
};

const parseBank2 = (lines: string[]): Transaction[] => {
    const transactions: Transaction[] = [];
    const headerIndex = lines.findIndex(line => line.startsWith('Data transakcji;Data księgowania;'));
    if (headerIndex === -1) return [];

    const dataLines = lines.slice(headerIndex + 1);

    for (const line of dataLines) {
        const columns = line.split(';');
        if (columns.length < 7) continue;

        const dateParts = columns[0].split('-'); // Data transakcji
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const description = columns[4];
        const amount = parseFloat(columns[5].replace(',', '.'));
        const currency = columns[6];

        if (!isNaN(amount) && description) {
            transactions.push({
                id: generateId(),
                date,
                description,
                amount,
                currency,
            });
        }
    }
    return transactions;
};

export const parseCsv = (csvText: string): Transaction[] => {
    const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) return [];

    // Detect format
    if (lines.some(line => line.includes('Type,Product,Started Date'))) {
        return parseBank1(lines);
    } else if (lines.some(line => line.includes('Data transakcji;Data księgowania;'))) {
        return parseBank2(lines);
    } else {
        throw new Error('Nieznany format pliku CSV.');
    }
};
