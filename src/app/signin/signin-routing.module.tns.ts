import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { EntryformComponent } from './entryform/entryform.component';
import { VelificationformComponent } from './velificationform/velificationform.component';
import { ResetformComponent } from './resetform/resetform.component';

import { NoAuthGuard } from '../no-auth.guard';

const routes: Routes = [
  {
    path: 'signin',
    component: EntryformComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'signin/velification',
    component: VelificationformComponent,
    canActivate: [NoAuthGuard]
  },

  {
    path: 'signin/reset',
    component: ResetformComponent,
    canActivate: [NoAuthGuard]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SigninRoutingModule { }
