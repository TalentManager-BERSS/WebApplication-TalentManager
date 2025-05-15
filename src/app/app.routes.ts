import { Routes } from '@angular/router';
import {Toolbar} from '../shared/components/toolbar/toolbar.component';

export const routes: Routes = [
  { path: 'home',             component: Toolbar },
  { path: 'reports',             component: Toolbar },
  { path: 'dashboards',             component: Toolbar },
  { path: 'support',             component: Toolbar },
  { path: 'logout',             component: Toolbar },

];
