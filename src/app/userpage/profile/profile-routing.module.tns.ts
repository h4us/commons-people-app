import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// import { ProfileRootComponent } from './profile-root/profile-root.component';
// import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  // {
  //   path: 'profile',
  //   canActivate: [AuthGuard],
  //   component: ProfileRootComponent
  // }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ProfileRoutingModule { }
