import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import { EntryformComponent } from './entryform/entryform.component';
import { ResetformComponent } from './resetform/resetform.component';
import { VelificationformComponent } from './velificationform/velificationform.component';
import { SigninRootComponent } from './signin-root/signin-root.component';

@NgModule({
  declarations: [EntryformComponent, ResetformComponent, VelificationformComponent, SigninRootComponent],
  imports: [
    CommonModule,
    SigninRoutingModule
  ],
  entryComponents: [
    EntryformComponent
  ],
})
export class SigninModule { }
