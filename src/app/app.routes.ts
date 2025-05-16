import { Routes } from '@angular/router';
import {SupportComponent} from './Employees/pages/Support/components/support.component'
import {ReportsComponent} from './Employees/pages/Reports/components/reports.component';
import {HomeComponent} from './Employees/pages/Home/components/home.component';
import {ListEmployeeComponent} from './Employees/pages/Employees/components/List-employee/list-employee.component';
import {EmployeeAddComponent} from './Employees/pages/Employees/components/Add-Employee/add-employee.component';

//Agregar aqui los componentes
export const routes: Routes = [
  { path: 'home',             component: HomeComponent },
  { path: 'reports',             component: ReportsComponent },
  //{ path: 'dashboards',             component: '' },
  { path: 'support',             component: SupportComponent },
  //{ path: 'logout',             component: '' },
  { path: 'add',             component:  EmployeeAddComponent},
  { path: 'manage',             component:  ListEmployeeComponent},


];

