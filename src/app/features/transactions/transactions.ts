import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransactionService } from '../../core/services/transaction.service';
import { RoleService } from '../../core/services/role.service';
import { Transaction, TransactionCategory, TransactionType } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions implements OnInit {
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  currentRole = 'viewer';

  searchQuery = '';
  filterType = '';
  filterCategory = '';
  sortField = 'date';
  sortDirection = 'desc';

  categories: TransactionCategory[] = [
    'Salary', 'Freelance', 'Food', 'Rent', 'Transport',
    'Entertainment', 'Shopping', 'Health', 'Utilities', 'Other'
  ];

  displayedColumns = ['date', 'description', 'category', 'type', 'amount'];

  // Add transaction form
  showAddForm = false;
  newTransaction: Partial<Transaction> = {};

  constructor(
    private transactionService: TransactionService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.allTransactions = transactions;
      this.applyFilters();
    });

    this.roleService.role$.subscribe(role => {
      this.currentRole = role;
    });
  }

  applyFilters() {
    let result = [...this.allTransactions];

    if (this.searchQuery) {
      result = result.filter(t =>
        t.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterType) {
      result = result.filter(t => t.type === this.filterType);
    }

    if (this.filterCategory) {
      result = result.filter(t => t.category === this.filterCategory);
    }

    result.sort((a, b) => {
      let valA: any = a[this.sortField as keyof Transaction];
      let valB: any = b[this.sortField as keyof Transaction];
      if (this.sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    this.filteredTransactions = result;
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterType = '';
    this.filterCategory = '';
    this.applyFilters();
  }

  addTransaction() {
    const t: Transaction = {
      id: Date.now(),
      date: this.newTransaction.date || new Date().toISOString().split('T')[0],
      description: this.newTransaction.description || '',
      category: this.newTransaction.category as TransactionCategory,
      type: this.newTransaction.type as TransactionType,
      amount: Number(this.newTransaction.amount)
    };
    this.transactionService.addTransaction(t);
    this.showAddForm = false;
    this.newTransaction = {};
  }
}