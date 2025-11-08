
export enum Category {
    Groceries = "Zakupy spożywcze",
    Transport = "Transport",
    Health = "Zdrowie i uroda",
    Bills = "Rachunki i opłaty",
    Entertainment = "Rozrywka i hobby",
    Shopping = "Ubrania i akcesoria",
    FoodAndDining = "Jedzenie na mieście",
    Income = "Przychody",
    Other = "Inne",
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency: string;
}

export interface CategorizedTransaction extends Transaction {
    category: Category;
}
