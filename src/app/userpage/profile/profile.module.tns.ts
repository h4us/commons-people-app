import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import { SharedModule } from '../../shared/shared.module';

import { ProfileRootComponent } from './profile-root/profile-root.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ProfileEtcComponent } from './profile-etc/profile-etc.component';
import { SentComponent } from './sent/sent.component';

@NgModule({
  declarations: [ProfileRootComponent, ProfileEditorComponent, ProfileEtcComponent, SentComponent],
  imports: [
    ProfileRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileModule { }
