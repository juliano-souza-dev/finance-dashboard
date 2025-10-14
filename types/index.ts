export type CategoryType = "income" | "expense";
export type EntryStatus = "paid" | "pending";

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category_id: string;
  value: number;
  type: CategoryType;
  status: EntryStatus;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}