import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'

import { Subscription, Observable } from 'rxjs';
// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/platform';

import { UserService } from '../../../user.service';
import { SystemTrayService } from '../../../system-tray.service';

import { ModalProxyService } from '../../modal-proxy.service';
import { MessageProxyService } from '../../message-proxy.service';
import { MessageThreadValidatorService }  from '../../message-thread-validator.service';

@Component({
  selector: 'app-message-detail-settings-field',
  templateUrl: './message-detail-settings-field.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailSettingsFieldComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = '';
  field: string = '';
  threadObj: any;
  gForm: FormGroup;

  fieldIsValid: boolean = false;
  confirmIsValid: boolean = true;
  firstError: any;

  private touched: boolean = false;
  private edited: boolean = false;
  private lastCommit: any;

  private gfSub: Subscription;
  private mSub: Subscription;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private trayService: SystemTrayService,
    private messageService: MessageProxyService,
    private mvService: MessageThreadValidatorService,
    private mProxy: ModalProxyService,
  ){
    page.actionBarHidden = true;

    this.gForm = mvService.sendForm;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const fld: string = <string>params.field;
        const desireId: number = <number>params.id;

        this.title = this.mvService.labelsForInput[fld].title;
        this.field = fld;
        if (this.messageService.activeThreads) {
          this.threadObj = this.messageService.activeThreads.find((el) => el.id == desireId);
        }
      });

    this.gfSub = this.mvService.sendForm.valueChanges.subscribe((changes: any) => {
      if (!this.touched) {
        this.touched = true;
      }

      this.firstError = this.gForm.get(this.field).errors ?
        {
          [Object.keys(this.gForm.get(this.field).errors)[0]] : this.gForm.get(this.field).errors[Object.keys(this.gForm.get(this.field).errors)[0]]
        } : null;

      this.fieldIsValid = this.gForm.get(this.field).valid
        && this.lastCommit[`${this.field}`] != this.gForm.get(`${this.field}`).value;
    });

    this.mSub = this.mProxy.switchBack$.subscribe((data: any) => {
      let target: string;
      let options: any;
      if (data instanceof Array && data.length > 0) {
        target = data[0];
        if (data.length > 1) {
          options = data[1];
        }
      } else {
        target = data;
      }

      if (target == 'thread-add-member') {
        (this.gForm.get('memberIds')).setValue(
          this.threadObj.parties.map((el: any) => el.id).concat(options)
        );

        this.userService.updateGroupMessageThread(
          this.threadObj.id, {
            title: this.gForm.get('title').value,
            memberIds: this.threadObj.parties.map((el: any) => el.id).concat(options)
          }
        ).subscribe(_ => {
          this.edited = true;
          this.routerExt.backToPreviousPage();
        });
      }
    });

    this.lastCommit = this.gForm.value;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.gfSub.unsubscribe();
    this.mSub.unsubscribe();

    if (!this.edited) {
      this.gForm.patchValue(this.lastCommit);
    } else {
      this.messageService.fetchThreads(this.threadObj.communityId);
      this.trayService.request('snackbar/', 'open', {
        step: 1,
        isApproved: true,
        doneMessage: `${this.title}を編集しました.`
      });
    }
  }

  onValidate() {
  }

  get isIOS(): boolean {
    return isIOS;
  }

  get party(): any[] {
    return this.threadObj.parties instanceof Array ? this.threadObj.parties : [this.threadObj.parties];
  }

  addMember() {
    this.mProxy.request('thread-add-member', {
      ignore: this.threadObj.parties,
      inCommunity: this.threadObj.communityId,
      editorContext: 'edit'
    });
  }

  submit() {
    this.userService.updateGroupMessageThread(
      this.threadObj.id, {
        title: this.gForm.get('title').value,
        memberIds: this.threadObj.parties.map((el: any) => el.id)
      }
    ).subscribe(_ => {
      this.edited = true;
      this.routerExt.backToPreviousPage();
    });
  }
}
