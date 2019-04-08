import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { RegisterRootComponent } from './register-root/register-root.component';
import { FieldComponent } from './field/field.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterRootComponent,
    children: [
      {
        path: 'entry',
        component: FieldComponent,
        outlet: 'registerpage',
        data: {
          field: 'username',
          needConfirmInput: false
        }
      },

      {
        path: 'email',
        component: FieldComponent,
        outlet: 'registerpage',
        data: {
          field: 'email',
          needConfirmInput: true
        }
      },

      {
        path: 'password',
        component: FieldComponent,
        outlet: 'registerpage',
        data: {
          field: 'password',
          needConfirmInput: true
        }
      },

      {
        path: 'confirm',
        component: ConfirmComponent,
        outlet: 'registerpage',
      },
      {
        path: 'sent',
        component: SentComponent,
        outlet: 'registerpage',
      }

    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class RegisterRoutingModule { }
