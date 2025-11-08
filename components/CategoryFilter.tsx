
import React, { useMemo } from 'react';
import type { CategorizedTransaction } from '../types';
import { Category } from '../types';

interface CategoryFilterProps {
    allTransactions: CategorizedTransaction[];
    selectedCategory: Category | 'all';
    onSelectCategory: (category: Category | 'all') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ allTransactions, selectedCategory, onSelectCategory }) => {
    const categories = useMemo(() => {
        const uniqueCategories = new Set(allTransactions.map(t => t.category));
        return Array.from(uniqueCategories).sort();
    }, [allTransactions]);

    const getButtonClass = (category: Category | 'all') => {
        return selectedCategory === category
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600';
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => onSelectCategory('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${getButtonClass('all')}`}
            >
                Wszystkie
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${getButtonClass(category)}`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
