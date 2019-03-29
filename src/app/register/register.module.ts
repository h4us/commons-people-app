import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { UsernameComponent } from './username/username.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';

@NgModule({
  declarations: [UsernameComponent, EmailComponent, PasswordComponent, ConfirmComponent, SentComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
