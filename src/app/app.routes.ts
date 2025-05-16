import { Routes } from '@angular/router';
import {CourseManagementComponent} from './Employees/pages/Home/components/home.component';
import {SupportComponent} from './Employees/pages/Support/components/support.component'

//Agregar aqui los componentes
export const routes: Routes = [
  { path: 'home',             component: CourseManagementComponent },
  //{ path: 'reports',             component: '' },
  //{ path: 'dashboards',             component: '' },
  { path: 'support',             component: SupportComponent },
  //{ path: 'logout',             component: '' },

];

