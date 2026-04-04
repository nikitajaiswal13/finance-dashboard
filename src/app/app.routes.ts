import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Transactions } from './features/transactions/transactions';
import { Insights } from './features/insights/insights';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'transactions', component: Transactions },
  { path: 'insights', component: Insights },
];