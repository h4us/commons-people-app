import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { AltDemoPageComponent } from './alt-demo-page/alt-demo-page.component';
import { MoreDemoPageComponent } from './more-demo-page/more-demo-page.component';

@NgModule({
  declarations: [AltDemoPageComponent, MoreDemoPageComponent],
  imports: [
    CommonModule,
    DemoRoutingModule
  ]
})
export class DemoModule { }
