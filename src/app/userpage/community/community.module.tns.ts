import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CommunityRoutingModule } from './community-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';

// TODO:
import { WebViewExtModule } from '@nota/nativescript-webview-ext/angular';
// --

import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../../shared/shared.module';

import { CommunityRootComponent } from './community-root/community-root.component';
import { CommunityListComponent } from './community-list/community-list.component';
import { CommunityListEditComponent } from './community-list/community-list-edit.component';

import { TopicDetailComponent } from './topic-detail/topic-detail.component';
import { TopicEditorComponent } from './topic-editor/topic-editor.component';
import { TopicEditorEntryComponent } from './topic-editor/topic-editor-entry.component';
import { TopicEditorEditComponent } from './topic-editor/topic-editor-edit.component';
import { TopicEditorFieldComponent } from './topic-editor/topic-editor-field.component';
import { TopicOwnerComponent } from './topic-owner/topic-owner.component';
import { TopicOwnerEntryComponent } from './topic-owner/topic-owner-entry.component';

import { NewsDetailComponent } from './news-detail/news-detail.component';

@NgModule({
  declarations: [
    CommunityRootComponent, CommunityListComponent, CommunityListEditComponent,
    TopicDetailComponent,
    TopicEditorComponent, TopicEditorEntryComponent, TopicEditorEditComponent, TopicEditorFieldComponent,
    TopicOwnerComponent, TopicOwnerEntryComponent,
    NewsDetailComponent,
  ],
  imports: [
    CommunityRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule,
    ReactiveFormsModule,
    WebViewExtModule,
    SharedModule,
    MomentModule,
  ],
  entryComponents: [
    TopicEditorComponent,
    TopicOwnerComponent,
    CommunityListComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CommunityModule { }
