
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategorizedTransaction } from '../types';
import { Category } from '../types';

interface ExpenseChartProps {
    data: CategorizedTransaction[];
    onSliceClick: (category: Category) => void;
}

const COLORS = [
    '#4f46e5', '#db2777', '#f97316', '#22c55e', 
    '#0ea5e9', '#d946ef', '#f59e0b', '#14b8a6', '#8b5cf6'
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="text-white font-semibold">{`${payload[0].name}`}</p>
                <p className="text-indigo-300">{`Suma: ${payload[0].value.toFixed(2)} PLN`}</p>
            </div>
        );
    }
    return null;
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, onSliceClick }) => {
    const chartData = useMemo(() => {
        const categoryTotals: { [key in Category]?: number } = {};

        data.forEach(transaction => {
            if (transaction.amount < 0) { // Only sum expenses
                const category = transaction.category;
                if (!categoryTotals[category]) {
                    categoryTotals[category] = 0;
                }
                categoryTotals[category]! += Math.abs(transaction.amount);
            }
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name: name as Category, value }))
            .sort((a, b) => b.value - a.value);
    }, [data]);

    if (chartData.length === 0) {
        return <div className="text-center py-10 text-gray-500">Brak danych o wydatkach do wyświetlenia.</div>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(data) => onSliceClick(data.name)}
                        className="cursor-pointer"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;
