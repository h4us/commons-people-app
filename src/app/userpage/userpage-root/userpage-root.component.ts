import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ComponentRef, ViewContainerRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, fromEvent } from 'rxjs';
import { take, delay } from 'rxjs/operators'

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';
import { screen, isIOS } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';

import { TopicEditorComponent } from '../community/topic-editor/topic-editor.component';
import { TopicOwnerComponent } from '../community/topic-owner/topic-owner.component';
import { CommunityListComponent } from '../community/community-list/community-list.component';
import { ThreadEditorComponent } from '../message/thread-editor/thread-editor.component';
import { MessageEditorComponent } from '../message/message-editor/message-editor.component';
import { PointSenderComponent } from '../point/point-sender/point-sender.component';

import { ModalProxyService } from '../modal-proxy.service';
import { MessageProxyService } from '../message-proxy.service';
import { PeriodicTasksService } from '../periodic-tasks.service';

import { UserService } from '../../user.service';
import { SystemTrayService } from '../../system-tray.service';

const firebase = require('nativescript-plugin-firebase');

@Component({
  selector: 'app-userpage-root',
  templateUrl: './userpage-root.component.html',
  styleUrls: ['./userpage-root.component.scss'],
})
export class UserpageRootComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('userpageRoot') uRoot: ElementRef;

  mSubscription: Subscription;
  lSubscription: Subscription;
  sSubscription: Subscription;

  locked: boolean = false;

  constructor(
    private routerExt: RouterExtensions,
    private modalService: ModalDialogService,
    private messageService: MessageProxyService,
    private pTasksService: PeriodicTasksService,
    private page: Page,
    private vcRef: ViewContainerRef,
    private aRoute: ActivatedRoute,
    private mProxy: ModalProxyService,
    private userService: UserService,
    private trayService: SystemTrayService,
  ) {
    page.actionBarHidden = true;

    this.mSubscription = mProxy.requestModal$.subscribe((data: any) => {
      const options: ModalDialogOptions = {
        fullscreen: true,
        viewContainerRef: this.vcRef
      };

      let target: string;

      if (data instanceof Array && data.length > 0) {
        target = data[0];
        if (data.length > 1) {
          options.context = data[1];
        }
      } else {
        target = data;
      }

      if (target == 'topic') {
        this.modalService.showModal(TopicEditorComponent, options).then((data: any) => {
          setTimeout(() => {
            mProxy.switchBack('topic', data);
          }, 200);
        });
      } else if (target == 'topic-owner') {
        this.modalService.showModal(TopicOwnerComponent, options).then((data: any) => {
          if (data && data.snackbarRedirect) {
            this.trayService.request('snackbar/', 'open', {
              step: 1, isApproved: true,
              doneMessage: data.snackbarRedirect.doneMessage
            });
          }
        });
      } else if (target == 'thread-edit') {
        this.modalService.showModal(ThreadEditorComponent, options);
      } else if (target  == 'thread-new') {
        this.modalService.showModal(MessageEditorComponent, options).then((data: any) => {
          // TODO:
          if (data && data.willCreate) {
            setTimeout(() => {
              mProxy.switchBack('thread-new', data.willCreate);
            }, 200);
          }
          // --
        });
      } else if (target == 'thread-add-member') {
        this.modalService.showModal(MessageEditorComponent, options).then((data: any) => {
          // TODO:
          if (data && data.willAdd) {
            setTimeout(() => {
              mProxy.switchBack('thread-add-member', data.willAdd);
            }, 200);
          }
          // --
        });
      } else if (target == 'switch-community') {
        this.modalService.showModal(CommunityListComponent, options).then(() => {
          mProxy.switchBack('switch-community');
        });
      } else if (target == 'send-point') {
        this.modalService.showModal(PointSenderComponent, options).then((data: any) => {
          if (data && data.snackbarRedirect) {
            this.trayService.request('snackbar/', 'open', {
              step: 1, isApproved: true,
              doneMessage: data.snackbarRedirect.doneMessage
            });
          }
        });
      } else if (target == 'search') {
        this.modalService.showModal(PointSenderComponent, options);
      }
    });

    //
    this.lSubscription = trayService.userpageLock$.subscribe((state: boolean) => {
      this.locked = state;
    });

    //
    this.sSubscription = trayService.appState$.subscribe((state: any) => {
      if (state.eventName && (state.eventName == 'resume' || state.eventName == 'online')) {
        this.pTasksService.start();
      }
      if (state.eventName && (state.eventName == 'suspend' || state.eventName == 'offline')) {
        this.pTasksService.stop();
      }
    });
  }

  ngOnInit() {
    this.pTasksService.start();

    firebase.getCurrentPushToken().then((token: string) => {
      console.log(`Current push token: ${token}`);
      this.userService.setNotificationToken(token);
      this.userService.sendNotifictationToken().subscribe();
    });

    this.routerExt.navigate([{
      outlets: {
        userpage: ['community']
      }
    }], { relativeTo: this.aRoute });
  }

  ngAfterViewInit() {
    fromEvent(this.uRoot.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      if (isIOS) {
        let safeAreaSpan: number = 0;
        if (application.ios.window.safeAreaInsets) {
          safeAreaSpan = <number>application.ios.window.safeAreaInsets.top + <number>application.ios.window.safeAreaInsets.bottom;
        }
        this.trayService.trayPosition = screen.mainScreen.heightDIPs - (safeAreaSpan);
      } else {
        const aH = this.uRoot.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;
        this.trayService.trayPosition = aH;
      }
    });
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
    this.lSubscription.unsubscribe();
    this.sSubscription.unsubscribe();

    this.pTasksService.stop();
  }

  onOuterTouch(): boolean {
    return false;
  }
}
