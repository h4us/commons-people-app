import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { UsernameComponent } from './username/username.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';

import { SharedModule } from '../shared/shared.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';
import { FieldComponent } from './field/field.component';

@NgModule({
  declarations: [UsernameComponent, EmailComponent, PasswordComponent, ConfirmComponent, SentComponent, FieldComponent],
  imports: [
    RegisterRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
  ]
})
export class RegisterModule { }
