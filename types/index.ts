

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
    id?: string;
    month?: string; 
    year?: string;  
    category?: string;
    type?: 'Entrada' | 'Saída' | 'income' | 'expense' | string;
    status?: 'Pago' | 'Pendente' | 'paid' | 'pending' | string;
}

