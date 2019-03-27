import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { EntryformComponent } from './entryform/entryform.component';
import { ResetformComponent } from './resetform/resetform.component';
import { VelificationformComponent } from './velificationform/velificationform.component';

@NgModule({
  declarations: [EntryformComponent, ResetformComponent, VelificationformComponent],
  imports: [
    CommonModule,
    SigninRoutingModule
  ],
  entryComponents: [
    EntryformComponent
  ],
})
export class SigninModule { }
