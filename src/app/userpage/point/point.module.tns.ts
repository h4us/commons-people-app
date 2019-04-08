import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PointRoutingModule } from './point-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';

import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../../shared/shared.module';
import { SharedModule as UserpageSharedModule } from '../shared/shared.module';

import { PointRootComponent } from './point-root/point-root.component';
import { PointLogComponent } from './point-log/point-log.component';
import { PointSenderComponent } from './point-sender/point-sender.component';
import { PointSenderSelectComponent } from './point-sender/point-sender-select.component';
import { PointSenderCommitComponent } from './point-sender/point-sender-commit.component';
import { PointSenderConfirmComponent } from './point-sender/point-sender-confirm.component';
import { PointRequestComponent } from './point-request/point-request.component';

@NgModule({
  declarations: [
    PointRootComponent,
    PointLogComponent,
    PointSenderComponent, PointSenderSelectComponent, PointSenderCommitComponent, PointSenderConfirmComponent, PointRequestComponent,
  ],
  imports: [
    PointRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule,
    ReactiveFormsModule,
    MomentModule,
    UserpageSharedModule,
    SharedModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [PointSenderComponent],
})
export class PointModule { }
