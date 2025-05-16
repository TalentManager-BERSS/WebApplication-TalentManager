import { Routes } from '@angular/router';
import {SupportComponent} from './Employees/pages/Support/components/support.component'
import {ReportsComponent} from './Employees/pages/Reports/components/reports.component';
import {HomeComponent} from './Employees/pages/Home/components/home.component';

//Agregar aqui los componentes
export const routes: Routes = [
  { path: 'home',             component: HomeComponent },
  { path: 'reports',             component: ReportsComponent },
  //{ path: 'dashboards',             component: '' },
  { path: 'support',             component: SupportComponent },



];

