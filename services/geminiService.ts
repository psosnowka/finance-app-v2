import type { Transaction, CategorizedTransaction } from '../types';
import { Category } from '../types';

const categoryValues = Object.values(Category).filter(c => c !== Category.Income);

const jsonSchemaDescription = `{
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "description": { "type": "string" },
        "category": { "type": "string", "enum": [${categoryValues.map(c => `"${c}"`).join(', ')}] }
      },
      "required": ["description", "category"]
    }
}`;

export const categorizeTransactions = async (transactions: Transaction[]): Promise<CategorizedTransaction[]> => {
    if (transactions.length === 0) {
        return [];
    }

    // Create a map to avoid processing duplicate descriptions
    const uniqueDescriptionsMap = new Map<string, Transaction[]>();
    transactions.forEach(t => {
        if (!uniqueDescriptionsMap.has(t.description)) {
            uniqueDescriptionsMap.set(t.description, []);
        }
        uniqueDescriptionsMap.get(t.description)?.push(t);
    });

    const uniqueDescriptions = Array.from(uniqueDescriptionsMap.keys());

    const prompt = `
        Jesteś ekspertem w kategoryzacji transakcji bankowych. Twoim zadaniem jest przypisanie odpowiedniej kategorii do każdego opisu transakcji z poniższej listy.
        Zawsze odpowiadaj w formacie JSON, który jest zgodny z podanym schematem.
        Używaj tylko i wyłącznie następujących kategorii: ${categoryValues.join(', ')}.
        Nie dodawaj żadnych wyjaśnień ani dodatkowego tekstu poza obiektem JSON.

        Schemat JSON:
        ${jsonSchemaDescription}

        Oto lista opisów transakcji do skategoryzowania jako tablica JSON:
        ${JSON.stringify(uniqueDescriptions)}

        Zwróć tylko i wyłącznie kompletną tablicę JSON z wynikami.
    `;

    try {
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3:8b', // Używany model lokalny
                prompt: prompt,
                format: 'json',
                stream: false,
            }),
        });

        if (!ollamaResponse.ok) {
            const errorBody = await ollamaResponse.text();
            throw new Error(`Błąd serwera Ollama (${ollamaResponse.status}): ${errorBody}`);
        }

        const data = await ollamaResponse.json();
        const categorizedItems = JSON.parse(data.response) as { description: string; category: string }[];

        const categoryMap = new Map<string, Category>();
        categorizedItems.forEach(item => {
            const validCategory = Object.values(Category).find(c => c === item.category) || Category.Other;
            categoryMap.set(item.description, validCategory);
        });

        const result: CategorizedTransaction[] = [];
        uniqueDescriptionsMap.forEach((trans, desc) => {
            const category = categoryMap.get(desc) || Category.Other;
            trans.forEach(t => {
                result.push({ ...t, category });
            });
        });

        return result;

    } catch (error) {
        console.error("Błąd podczas kategoryzacji z Ollama:", error);
        if (error instanceof TypeError) {
            // This often indicates a network error (CORS, server down)
            throw new Error("Nie można połączyć się z lokalnym serwerem AI. Upewnij się, że aplikacja Ollama jest uruchomiona i spróbuj ponownie załadować plik.");
        }
        // Re-throw other errors to be caught and displayed by App.tsx
        throw error;
    }
};
