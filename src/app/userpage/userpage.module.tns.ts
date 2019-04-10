import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserpageRoutingModule } from './userpage-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { SharedModule } from '../shared/shared.module';
import { SharedModule as UserpageSharedModule } from './shared/shared.module';

import { CommunityModule } from './community/community.module';
import { PointModule } from './point/point.module';
import { ProfileModule } from './profile/profile.module';
import { MessageModule } from './message/message.module';

import { ModalProxyService } from './modal-proxy.service';
import { MessageProxyService } from './message-proxy.service';
import { NewsService } from './news.service';
import { PeriodicTasksService } from './periodic-tasks.service';

import { TopicValidatorService } from './topic-validator.service';
import { ProfileValidatorService } from './profile-validator.service';
import { PointValidatorService } from './point-validator.service';
import { MessageThreadValidatorService } from './message-thread-validator.service';

import { UserpageRootComponent } from './userpage-root/userpage-root.component';
import { NewbieComponent } from './newbie/newbie.component';

@NgModule({
  declarations: [UserpageRootComponent, NewbieComponent],
  imports: [
    UserpageRoutingModule,
    NativeScriptCommonModule,
    //
    CommunityModule,
    PointModule,
    ProfileModule,
    MessageModule,
    //
    UserpageSharedModule,
    SharedModule,
  ],
  exports:[
  ],
  entryComponents: [
  ],
  providers: [
    ModalProxyService,
    MessageProxyService,
    NewsService,
    PeriodicTasksService,
    TopicValidatorService,
    ProfileValidatorService,
    PointValidatorService,
    MessageThreadValidatorService,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserpageModule { }
