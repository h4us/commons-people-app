import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserpageRoutingModule } from './userpage-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { SharedModule } from '../shared/shared.module';

import { CommunityModule } from './community/community.module';
import { PointModule } from './point/point.module';
import { ProfileModule } from './profile/profile.module';
import { MessageModule } from './message/message.module';

import { ModalProxyService } from './modal-proxy.service';
import { MessageProxyService } from './message-proxy.service';
import { NewsService } from './news.service';
import { TopicValidatorService } from './topic-validator.service';
import { ProfileValidatorService } from './profile-validator.service';

import { UserpageRootComponent } from './userpage-root/userpage-root.component';

@NgModule({
  declarations: [UserpageRootComponent],
  imports: [
    UserpageRoutingModule,
    NativeScriptCommonModule,
    //
    CommunityModule,
    PointModule,
    ProfileModule,
    MessageModule,
    //
    SharedModule,
  ],
  entryComponents: [
  ],
  providers: [
    ModalProxyService,
    MessageProxyService,
    NewsService,
    TopicValidatorService,
    ProfileValidatorService,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserpageModule { }
