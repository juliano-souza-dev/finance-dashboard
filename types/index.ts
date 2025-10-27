

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  type: String;
  status: String;
}


export interface FinancialSummary {
    incomes: number; 
    expenses: number;  
    balance: number;  
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export type ExpenseStatus = 'pending' | 'paid';

export interface TransactionFilters {
    month?: string; 
    year?: string;  
    type?: 'income' | 'expense';
    category?: string;
    status?: ExpenseStatus; // <-- NOVO FILTRO: Status de pagamento
}

