
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, CategorizedTransaction } from '../types';
import { Category } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you would want to handle this more gracefully.
  // For this context, we assume the key is provided in the environment.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const categoryValues = Object.values(Category).filter(c => c !== Category.Income);

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        description: {
          type: Type.STRING,
          description: "Oryginalny opis transakcji.",
        },
        category: {
          type: Type.STRING,
          description: `Kategoria wydatku. Musi być jedną z: ${categoryValues.join(', ')}.`,
          enum: categoryValues,
        },
      },
      required: ['description', 'category'],
    },
};

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
        Przeanalizuj poniższą listę opisów transakcji bankowych i przypisz każdemu z nich odpowiednią kategorię.
        Używaj tylko i wyłącznie następujących kategorii: ${categoryValues.join(', ')}.
        Opisy transakcji do skategoryzowania:
        ${uniqueDescriptions.map(d => `- "${d}"`).join('\n')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const categorizedItems = JSON.parse(jsonText) as { description: string; category: string }[];
        
        const categoryMap = new Map<string, Category>();
        categorizedItems.forEach(item => {
            // Ensure the category returned by the AI is a valid enum member
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
        console.error("Błąd podczas kategoryzacji AI:", error);
        // Fallback: categorize all as 'Other' if AI fails
        return transactions.map(t => ({ ...t, category: Category.Other }));
    }
};
