
import React from 'react';
import type { CategorizedTransaction } from '../types';
import { Category } from '../types';
import ExpenseChart from './ExpenseChart';
import CategoryFilter from './CategoryFilter';
import ExpenseTable from './ExpenseTable';

interface ExpenseDashboardProps {
    transactions: CategorizedTransaction[];
    allTransactions: CategorizedTransaction[];
    selectedCategory: Category | 'all';
    onSelectCategory: (category: Category | 'all') => void;
    onNewFile: () => void;
}

const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({ transactions, allTransactions, selectedCategory, onSelectCategory, onNewFile }) => {
    return (
        <div>
            <div className="flex justify-end mb-4">
                 <button 
                    onClick={onNewFile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-300">
                    Analizuj nowy plik
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Podsumowanie wydatków</h2>
                    <ExpenseChart data={allTransactions} onSliceClick={onSelectCategory} />
                </div>
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Lista transakcji</h2>
                    <CategoryFilter 
                        allTransactions={allTransactions} 
                        selectedCategory={selectedCategory} 
                        onSelectCategory={onSelectCategory} 
                    />
                    <ExpenseTable transactions={transactions} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseDashboard;
