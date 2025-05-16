import { Routes } from '@angular/router';
import { SupportComponent } from './Employees/pages/Support/components/support.component';
import { ReportsComponent } from './Employees/pages/Reports/components/reports.component';
import { HomeComponent } from './Employees/pages/Home/components/home.component';
import { LoginPage } from './Employees/pages/Login/components/login-page.component/login-page.component';
import { DashboardMain } from './Employees/pages/Dashboard/components/dashboard-main.component/dashboard-main.component';
import { StatisticsComponent } from './Employees/pages/Register/statistics/statistics.component';
import { RegisterPage } from './Employees/pages/Register/register-page/register-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'dashboards', component: DashboardMain },
  { path: 'dashboards/details', component: StatisticsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage }
];
