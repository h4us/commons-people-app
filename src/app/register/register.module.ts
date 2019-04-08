import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { SentComponent } from './sent/sent.component';
import { FieldComponent } from './field/field.component';
import { RegisterRootComponent } from './register-root/register-root.component';

@NgModule({
  declarations: [ConfirmComponent, SentComponent, FieldComponent, RegisterRootComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
