import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { FieldComponent } from './field/field.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';

const routes: Routes = [
  {
    path: 'register',
    component: FieldComponent,
    data: {
      field: 'username',
      needConfirmInput: false
    }
  },

  {
    path: 'register/email',
    component: FieldComponent,
    data: {
      field: 'email',
      needConfirmInput: true
    }
  },

  {
    path: 'register/password',
    component: FieldComponent,
    data: {
      field: 'password',
      needConfirmInput: true
    }
  },

  {
    path: 'register/confirm',
    component: ConfirmComponent
  },
  {
    path: 'register/sent',
    component: SentComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class RegisterRoutingModule { }
