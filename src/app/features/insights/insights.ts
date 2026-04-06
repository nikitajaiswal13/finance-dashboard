import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-insights',
  imports: [CommonModule, MatCardModule, MatIconModule, CurrencyPipe],
  templateUrl: './insights.html',
  styleUrl: './insights.scss',
})
export class Insights implements OnInit {
  highestSpendingCategory = '';
  highestSpendingAmount = 0;

  mostExpensiveMonth = '';
  mostExpensiveMonthAmount = 0;

  savingsRate = 0;
  avgMonthlyExpense = 0;
  avgMonthlyIncome = 0;

  topTransactions: Transaction[] = [];

  monthOverMonthChange = 0;
  monthOverMonthLabel = '';
  lastMonthName = '';
  secondLastMonthName = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.calculateInsights(transactions);
    });
  }

  calculateInsights(transactions: Transaction[]) {
    const expenses = transactions.filter(t => t.type === 'expense');

    // Highest spending category
    const categoryMap: Record<string, number> = {};
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
    this.highestSpendingCategory = topCategory[0];
    this.highestSpendingAmount = topCategory[1];

    // Most expensive month
    const monthMap: Record<string, number> = {};
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June'];
    expenses.forEach(t => {
      const month = monthNames[new Date(t.date).getMonth()];
      if (month) monthMap[month] = (monthMap[month] || 0) + t.amount;
    });
    const topMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];
    this.mostExpensiveMonth = topMonth[0];
    this.mostExpensiveMonthAmount = topMonth[1];

    // Month over month comparison (last 2 months with data)
    const monthsWithData = Object.entries(monthMap)
      .sort((a, b) => monthNames.indexOf(a[0]) - monthNames.indexOf(b[0]));

    if (monthsWithData.length >= 2) {
      const last = monthsWithData[monthsWithData.length - 1];
      const secondLast = monthsWithData[monthsWithData.length - 2];
      this.lastMonthName = last[0];
      this.secondLastMonthName = secondLast[0];
      const diff = last[1] - secondLast[1];
      this.monthOverMonthChange = Math.round(Math.abs(diff / secondLast[1]) * 100);
      this.monthOverMonthLabel = diff > 0 ? 'increased' : 'decreased';
    }

    // Savings rate
    const totalIncome = this.transactionService.getTotalIncome();
    const totalExpenses = this.transactionService.getTotalExpenses();
    this.savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);

    // Averages
    this.avgMonthlyExpense = Math.round(totalExpenses / 6);
    this.avgMonthlyIncome = Math.round(totalIncome / 6);

    // Top 5 largest expenses
    this.topTransactions = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }
}