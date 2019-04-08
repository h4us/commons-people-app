import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { SigninRootComponent } from './signin-root/signin-root.component';
import { EntryformComponent } from './entryform/entryform.component';
import { VelificationformComponent } from './velificationform/velificationform.component';
import { ResetformComponent } from './resetform/resetform.component';
import { SentComponent } from './sent/sent.component';

import { NoAuthGuard } from '../no-auth.guard';

const routes: Routes = [
  {
    path: 'signin',
    component: SigninRootComponent,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'entry',
        component: EntryformComponent,
        outlet: 'signinpage',
      },
      {
        path: 'velification',
        component: VelificationformComponent,
        outlet: 'signinpage',
      },

      {
        path: 'reset',
        component: ResetformComponent,
        outlet: 'signinpage',
      },

      {
        path: 'sent',
        component: SentComponent,
        outlet: 'signinpage',
      },

    ]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SigninRoutingModule { }
