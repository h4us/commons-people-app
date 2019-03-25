import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';

import { CommunityRootComponent } from './community-root/community-root.component';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { TopicEditorComponent } from './topic-editor/topic-editor.component';
import { CommunityListComponent } from './community-list/community-list.component';
import { TopicOwnerComponent } from './topic-owner/topic-owner.component';

@NgModule({
  declarations: [CommunityRootComponent, TopicDetailComponent, NewsDetailComponent, TopicEditorComponent, CommunityListComponent, TopicOwnerComponent],
  imports: [
    CommonModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
