import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileRootComponent } from './profile-root/profile-root.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ProfileEtcComponent } from './profile-etc/profile-etc.component';
import { SentComponent } from './sent/sent.component';

@NgModule({
  declarations: [ProfileRootComponent, ProfileEditorComponent, ProfileEtcComponent, SentComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
