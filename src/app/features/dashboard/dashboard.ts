import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, BaseChartDirective, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } }
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'right' } }
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalBalance = this.totalIncome - this.totalExpenses;

      this.buildLineChart(transactions);
      this.buildDoughnutChart(transactions);
    });
  }

  buildLineChart(transactions: Transaction[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const balanceByMonth: number[] = [];

    let runningBalance = 0;
    months.forEach((_, index) => {
      const monthTxns = transactions.filter(t => {
        const month = new Date(t.date).getMonth();
        return month === index;
      });
      monthTxns.forEach(t => {
        runningBalance += t.type === 'income' ? t.amount : -t.amount;
      });
      balanceByMonth.push(runningBalance);
    });

    this.lineChartData = {
      labels: months,
      datasets: [{
        data: balanceByMonth,
        label: 'Balance',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  buildDoughnutChart(transactions: Transaction[]) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryMap: Record<string, number> = {};

    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    this.doughnutChartData = {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#E7E9ED'
        ]
      }]
    };
  }
}