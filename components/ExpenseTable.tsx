
import React from 'react';
import type { CategorizedTransaction } from '../types';

interface ExpenseTableProps {
    transactions: CategorizedTransaction[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return <div className="text-center py-10 text-gray-500">Brak transakcji do wyświetlenia dla wybranego filtra.</div>;
    }
    
    return (
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Data</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Opis</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Kategoria</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-white">Kwota</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                    {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-700/30">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-6">{transaction.date}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{transaction.description}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{transaction.category}</td>
                            <td className={`whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6 ${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {transaction.amount.toFixed(2)} {transaction.currency}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
