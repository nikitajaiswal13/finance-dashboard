import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2024-01-01', description: 'January Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 2, date: '2024-01-05', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 3, date: '2024-01-08', description: 'Swiggy Order', category: 'Food', type: 'expense', amount: 450 },
  { id: 4, date: '2024-01-10', description: 'Uber Ride', category: 'Transport', type: 'expense', amount: 220 },
  { id: 5, date: '2024-01-15', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 15000 },
  { id: 6, date: '2024-01-18', description: 'Netflix', category: 'Entertainment', type: 'expense', amount: 649 },
  { id: 7, date: '2024-01-20', description: 'Zepto Groceries', category: 'Food', type: 'expense', amount: 1200 },
  { id: 8, date: '2024-01-25', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 1800 },
  { id: 9, date: '2024-02-01', description: 'February Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 10, date: '2024-02-03', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 11, date: '2024-02-07', description: 'Zomato Order', category: 'Food', type: 'expense', amount: 380 },
  { id: 12, date: '2024-02-10', description: 'Metro Card Recharge', category: 'Transport', type: 'expense', amount: 500 },
  { id: 13, date: '2024-02-14', description: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 2300 },
  { id: 14, date: '2024-02-18', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 20000 },
  { id: 15, date: '2024-02-22', description: 'Apollo Pharmacy', category: 'Health', type: 'expense', amount: 890 },
  { id: 16, date: '2024-03-01', description: 'March Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 17, date: '2024-03-05', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 18, date: '2024-03-09', description: 'Blinkit Order', category: 'Food', type: 'expense', amount: 650 },
  { id: 19, date: '2024-03-12', description: 'Ola Ride', category: 'Transport', type: 'expense', amount: 180 },
  { id: 20, date: '2024-03-15', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 2000 },
  { id: 21, date: '2024-03-20', description: 'Myntra Shopping', category: 'Shopping', type: 'expense', amount: 3200 },
  { id: 22, date: '2024-03-25', description: 'Water Bill', category: 'Utilities', type: 'expense', amount: 400 },
  { id: 23, date: '2024-04-01', description: 'April Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 24, date: '2024-04-04', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 25, date: '2024-04-08', description: 'Swiggy Order', category: 'Food', type: 'expense', amount: 520 },
  { id: 26, date: '2024-04-12', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 18000 },
  { id: 27, date: '2024-04-18', description: 'BookMyShow', category: 'Entertainment', type: 'expense', amount: 800 },
  { id: 28, date: '2024-05-01', description: 'May Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 29, date: '2024-05-05', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 30, date: '2024-05-10', description: 'Zepto Groceries', category: 'Food', type: 'expense', amount: 980 },
  { id: 31, date: '2024-05-15', description: 'Rapido Ride', category: 'Transport', type: 'expense', amount: 120 },
  { id: 32, date: '2024-05-20', description: 'Flipkart Shopping', category: 'Shopping', type: 'expense', amount: 1800 },
  { id: 33, date: '2024-06-01', description: 'June Salary', category: 'Salary', type: 'income', amount: 45000 },
  { id: 34, date: '2024-06-04', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 12000 },
  { id: 35, date: '2024-06-08', description: 'Freelance Project', category: 'Freelance', type: 'income', amount: 25000 },
  { id: 36, date: '2024-06-12', description: 'Swiggy Order', category: 'Food', type: 'expense', amount: 600 },
  { id: 37, date: '2024-06-18', description: 'Spotify', category: 'Entertainment', type: 'expense', amount: 119 },
  { id: 38, date: '2024-06-22', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 999 },
];

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private _transactions = new BehaviorSubject<Transaction[]>(MOCK_TRANSACTIONS);
  transactions$ = this._transactions.asObservable();

  getTransactions(): Transaction[] {
    return this._transactions.getValue();
  }

  addTransaction(transaction: Transaction): void {
    const current = this._transactions.getValue();
    this._transactions.next([...current, transaction]);
  }

  updateTransaction(updated: Transaction): void {
    const current = this._transactions.getValue();
    const updatedList = current.map(t => t.id === updated.id ? updated : t);
    this._transactions.next(updatedList);
  }

  deleteTransaction(id: number): void {
    const current = this._transactions.getValue();
    this._transactions.next(current.filter(t => t.id !== id));
  }

  getTotalIncome(): number {
    return this.getTransactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.getTransactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }
}