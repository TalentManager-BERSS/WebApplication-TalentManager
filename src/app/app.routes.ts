import { Routes } from '@angular/router';
import {HomeComponent} from './Employees/pages/Home/components/home.component';
import {SupportComponent} from './Employees/pages/Support/components/support.component'

//Agregar aqui los componentes
export const routes: Routes = [
  { path: 'home',             component: HomeComponent },
  //{ path: 'reports',             component: '' },
  //{ path: 'dashboards',             component: '' },
  { path: 'support',             component: SupportComponent },
  //{ path: 'logout',             component: '' },

];

