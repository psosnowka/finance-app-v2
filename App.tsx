
import React, { useState, useMemo, useCallback } from 'react';
import type { Transaction, CategorizedTransaction } from './types';
import { Category } from './types';
import { parseCsv } from './services/csvParser';
import { categorizeTransactions as categorizeWithAI } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ExpenseDashboard from './components/ExpenseDashboard';
import OllamaInfo from './components/OllamaInfo';

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<CategorizedTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [showOllamaInfo, setShowOllamaInfo] = useState(false);

    const handleFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setTransactions([]);
        setSelectedCategory('all');

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target?.result as string;
                if (!text) {
                    setError('Plik jest pusty.');
                    setIsLoading(false);
                    return;
                }
                try {
                    const parsedTransactions = parseCsv(text);
                    if (parsedTransactions.length === 0) {
                        setError('Nie znaleziono transakcji w pliku. Sprawdź format.');
                        setIsLoading(false);
                        return;
                    }
                    
                    const expensesToCategorize = parsedTransactions.filter(t => t.amount < 0);
                    const categorizedExpenses = await categorizeWithAI(expensesToCategorize);

                    const incomeTransactions = parsedTransactions
                        .filter(t => t.amount >= 0)
                        .map(t => ({ ...t, category: Category.Income }));

                    const finalTransactions = [...categorizedExpenses, ...incomeTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    setTransactions(finalTransactions);
                } catch (e: any) {
                    setError(`Błąd przetwarzania: ${e.message}`);
                } finally {
                    setIsLoading(false);
                }
            };
            reader.onerror = () => {
                setError('Nie udało się odczytać pliku.');
                setIsLoading(false);
            };
            reader.readAsText(file, 'UTF-8');
        } catch (e: any) {
            setError(`Wystąpił błąd: ${e.message}`);
            setIsLoading(false);
        }
    }, []);

    const filteredTransactions = useMemo(() => {
        if (selectedCategory === 'all') {
            return transactions;
        }
        return transactions.filter(t => t.category === selectedCategory);
    }, [transactions, selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Analizator Wydatków AI</h1>
                        <p className="text-gray-400 mt-1">Prześlij plik CSV, aby automatycznie skategoryzować i zwizualizować swoje wydatki.</p>
                    </div>
                    <button 
                        onClick={() => setShowOllamaInfo(true)}
                        className="mt-4 sm:mt-0 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 text-sm">
                        Informacje o lokalnym AI (Ollama)
                    </button>
                </header>

                <main>
                    {!transactions.length && !isLoading && (
                        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                            <FileUpload onFileSelect={handleFile} disabled={isLoading} />
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg text-gray-300">Analizuję transakcje przy użyciu AI...</p>
                            <p className="text-sm text-gray-500">Może to potrwać chwilę.</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative max-w-2xl mx-auto text-center" role="alert">
                            <strong className="font-bold">Wystąpił błąd! </strong>
                            <span className="block sm:inline">{error}</span>
                            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-200">&times;</button>
                        </div>
                    )}

                    {transactions.length > 0 && !isLoading && (
                        <ExpenseDashboard 
                            transactions={filteredTransactions}
                            allTransactions={transactions}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            onNewFile={() => setTransactions([])}
                        />
                    )}
                </main>
                <OllamaInfo show={showOllamaInfo} onClose={() => setShowOllamaInfo(false)} />
            </div>
        </div>
    );
};

export default App;
