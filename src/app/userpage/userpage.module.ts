import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpageRoutingModule } from './userpage-routing.module';
import { UserpageRootComponent } from './userpage-root/userpage-root.component';

import { ModalProxyService } from './modal-proxy.service';

@NgModule({
  declarations: [UserpageRootComponent],
  imports: [
    CommonModule,
    UserpageRoutingModule
  ],
})
export class UserpageModule { }
