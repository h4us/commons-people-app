import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SigninRoutingModule } from './signin-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { SharedModule } from '../shared/shared.module';

import { EntryformComponent } from './entryform/entryform.component';
import { ResetformComponent } from './resetform/resetform.component';
import { VelificationformComponent } from './velificationform/velificationform.component';
import { SigninRootComponent } from './signin-root/signin-root.component';

@NgModule({
  declarations: [
    EntryformComponent,
    ResetformComponent,
    VelificationformComponent,
    SigninRootComponent
  ],
  imports: [
    SigninRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SigninModule { }
