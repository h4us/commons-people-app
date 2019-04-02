import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';
import { FieldComponent } from './field/field.component';

@NgModule({
  declarations: [ConfirmComponent, SentComponent, FieldComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
