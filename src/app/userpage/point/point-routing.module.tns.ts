import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// import { PointRootComponent } from './point-root/point-root.component';

const routes: Routes = [
  // {
  //   path: 'point',
  //   component: PointRootComponent
  // },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class PointRoutingModule { }
