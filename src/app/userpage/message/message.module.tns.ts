import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MessageRoutingModule } from './message-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';


import { MessageRootComponent } from './message-root/message-root.component';

import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../../shared/shared.module';
import { SharedModule as UserpageSharedModule } from '../shared/shared.module';

import { ThreadEditorComponent } from './thread-editor/thread-editor.component';
import { MessageEditorComponent } from './message-editor/message-editor.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageSearchComponent } from './message-search/message-search.component';

@NgModule({
  declarations: [MessageRootComponent, ThreadEditorComponent, MessageEditorComponent, MessageDetailComponent, MessageSearchComponent],
  imports: [
    MessageRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    SharedModule,
    UserpageSharedModule,
    ReactiveFormsModule,
    MomentModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    ThreadEditorComponent,
    MessageEditorComponent,
  ],
})
export class MessageModule { }
