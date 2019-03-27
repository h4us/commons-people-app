import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { DemoRoutingModule } from './demo-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { SharedModule } from '../shared/shared.module';

import { DemoRootComponent } from './demo-root/demo-root.component';
import { AltDemoPageComponent } from './alt-demo-page/alt-demo-page.component';
import { MoreDemoPageComponent } from './more-demo-page/more-demo-page.component';

@NgModule({
  declarations: [DemoRootComponent, AltDemoPageComponent, MoreDemoPageComponent],
  imports: [
    DemoRoutingModule,
    NativeScriptCommonModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    //
  ]
})
export class DemoModule { }
