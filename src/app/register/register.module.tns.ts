import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { UsernameComponent } from './username/username.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';

import { RegisterValidatorService } from './register-validator.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UsernameComponent, EmailComponent, PasswordComponent],
  imports: [
    RegisterRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    RegisterValidatorService,
  ]
})
export class RegisterModule { }
