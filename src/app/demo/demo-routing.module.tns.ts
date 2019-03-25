import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { DemoRootComponent } from './demo-root/demo-root.component';
import { AltDemoPageComponent } from './alt-demo-page/alt-demo-page.component';
import { MoreDemoPageComponent } from './more-demo-page/more-demo-page.component';

const routes: Routes = [
  {
    path: 'demo',
    component: DemoRootComponent,
    children: [
      {
        path:'altdemo',
        component: AltDemoPageComponent,
        outlet: 'extOutlet'
      },

      {
        path:'moredemo',
        component: MoreDemoPageComponent,
        outlet: 'extOutlet'
      }
    ]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class DemoRoutingModule { }
