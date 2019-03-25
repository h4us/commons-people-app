import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// import { MessageRootComponent } from './message-root/message-root.component';

const routes: Routes = [
  // {
  //   path: 'message',
  //   component: MessageRootComponent
  // },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class MessageRoutingModule { }
