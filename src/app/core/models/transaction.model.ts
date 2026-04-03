export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Salary'
  | 'Freelance'
  | 'Food'
  | 'Rent'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Utilities'
  | 'Other';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
}