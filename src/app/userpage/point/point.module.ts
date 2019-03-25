import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointRoutingModule } from './point-routing.module';
import { PointRootComponent } from './point-root/point-root.component';
import { PointLogComponent } from './point-log/point-log.component';
import { PointSenderComponent } from './point-sender/point-sender.component';

@NgModule({
  declarations: [PointRootComponent, PointLogComponent, PointSenderComponent],
  imports: [
    CommonModule,
    PointRoutingModule
  ]
})
export class PointModule { }
