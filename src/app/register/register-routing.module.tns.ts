import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { UsernameComponent } from './username/username.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  {
    path: 'register',
    component: UsernameComponent
  },
  {
    path: 'register/email',
    component: EmailComponent
  },
  {
    path: 'register/password',
    component: PasswordComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class RegisterRoutingModule { }
