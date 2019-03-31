import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileRootComponent } from './profile-root/profile-root.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ProfileEtcComponent } from './profile-etc/profile-etc.component';

@NgModule({
  declarations: [ProfileRootComponent, ProfileEditorComponent, ProfileEtcComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
