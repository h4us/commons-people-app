import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { UserpageRootComponent } from './userpage-root/userpage-root.component';

// TODO:
import { PointRootComponent } from './point/point-root/point-root.component';
import { PointLogComponent } from './point/point-log/point-log.component';
import { PointSenderSelectComponent } from './point/point-sender/point-sender-select.component';
import { PointSenderCommitComponent } from './point/point-sender/point-sender-commit.component';
import { PointSenderConfirmComponent } from './point/point-sender/point-sender-confirm.component';

import { CommunityRootComponent } from './community/community-root/community-root.component';
import { CommunityListEditComponent } from './community/community-list/community-list-edit.component';
import { TopicDetailComponent } from './community/topic-detail/topic-detail.component';
import { NewsDetailComponent } from './community/news-detail/news-detail.component';
import { TopicEditorEntryComponent } from './community/topic-editor/topic-editor-entry.component';
import { TopicEditorEditComponent } from './community/topic-editor/topic-editor-edit.component';
import { TopicEditorFieldComponent } from './community/topic-editor/topic-editor-field.component';
import { TopicOwnerEntryComponent } from './community/topic-owner/topic-owner-entry.component';

import { MessageRootComponent } from './message/message-root/message-root.component';
import { MessageDetailComponent } from './message/message-detail/message-detail.component';

import { ProfileRootComponent } from './profile/profile-root/profile-root.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';

//
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'user',
    component: UserpageRootComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'point',
        component: PointRootComponent,
        outlet: 'userpage'
      },

      {
        path:'community',
        component: CommunityRootComponent,
        outlet: 'userpage',
      },

      {
        path:'message',
        component: MessageRootComponent,
        outlet: 'userpage'
      },

      {
        path:'profile',
        component: ProfileRootComponent,
        outlet: 'userpage'
      },

      // --
      // ? TODO: details..
      // --
      {
        path: 'community/topics/:id',
        component: TopicDetailComponent,
        outlet: 'userpage',
      },

      {
        path: 'community/topic/owner/:id',
        component: TopicOwnerEntryComponent,
        outlet: 'topicowner',
      },

      {
        path: 'community/topic/owner/:id/send',
        component: PointSenderCommitComponent,
        outlet: 'topicowner',
      },

      {
        path: 'community/topic/owner/:id/send-confirm',
        component: PointSenderConfirmComponent,
        outlet: 'topicowner',
      },

      {
        path: 'community/news/:id',
        component: NewsDetailComponent,
        outlet: 'userpage',
      },

      {
        path:'message/log/:id',
        component: MessageDetailComponent,
        outlet: 'userpage'
      },

      {
        path: 'point/log/:id',
        component: PointLogComponent,
        outlet: 'userpage',
      },

      // --
      // TODO: new / edit
      // --
      {
        path: 'profile/edit/:field',
        component: ProfileEditorComponent,
        outlet: 'userpage',
      },

      {
        path: 'community/switch',
        component: CommunityListEditComponent,
        outlet: 'communityeditor',
      },

      {
        path: 'community/edit',
        component: CommunityListEditComponent,
        outlet: 'communityeditor',
      },

      /*
       * same url / multi outlet style
       * ... it's ok?
       */
      {
        path: 'point/select/:id',
        component: PointSenderSelectComponent,
        outlet: 'userpage',
      },
      {
        path: 'point/select/:id',
        component: PointSenderSelectComponent,
        outlet: 'pointsender',
      },

      {
        path: 'point/send/:id',
        component: PointSenderCommitComponent,
        outlet: 'userpage',
      },
      {
        path: 'point/send/:id',
        component: PointSenderCommitComponent,
        outlet: 'pointsender',
      },

      {
        path: 'point/confirm/:id',
        component: PointSenderConfirmComponent,
        outlet: 'userpage',
      },
      {
        path: 'point/confirm/:id',
        component: PointSenderConfirmComponent,
        outlet: 'pointsender',
      },
      /*
       * --
       */

      {
        path: 'community/topic/new',
        component: TopicEditorEntryComponent,
        outlet: 'topiceditor',
      },

      {
        path: 'community/topic/edit',
        component: TopicEditorEditComponent,
        outlet: 'topiceditor',
      },

      {
        path: 'community/topic/preview',
        component: TopicDetailComponent,
        outlet: 'topiceditor',
      },

      {
        path: 'community/topic/edit/:field',
        component: TopicEditorFieldComponent,
        outlet: 'topiceditor',
      },
      //
    ]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class UserpageRoutingModule { }
