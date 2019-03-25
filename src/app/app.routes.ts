import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { NoAuthGuard } from './no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [NoAuthGuard]
  },
];
