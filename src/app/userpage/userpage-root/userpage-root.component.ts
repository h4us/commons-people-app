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

import { SystemTrayService } from '../../system-tray.service';

@Component({
  selector: 'app-userpage-root',
  templateUrl: './userpage-root.component.html',
  styleUrls: ['./userpage-root.component.scss'],
})
export class UserpageRootComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('userpageRoot') uRoot: ElementRef;

  mSubscription: Subscription;
  lSubscription: Subscription;

  //
  canAction: boolean = true;
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
    private trayService: SystemTrayService,
  ) {
    page.actionBarHidden = true;

    this.mSubscription = mProxy.requestModal$.subscribe((data: any) => {
      // TODO:
      const options: ModalDialogOptions = {
        fullscreen: true,
        viewContainerRef: this.vcRef
      };

      if (data === 'topic' || (data instanceof Array && data.length > 0 && data[0] === 'topic' )) {
        // TODO:
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(TopicEditorComponent, options).then(() => {
          setTimeout(() => {
            mProxy.switchBack('topic');
          }, 200);
        });
      } else if (data === 'topic-owner' || (data instanceof Array && data.length > 0 && data[0] === 'topic-owner' )) {
        // TODO:
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(TopicOwnerComponent, options).then((data: any) => {
          if (data && data.snackbarRedirect) {
            this.trayService.request('snackbar/', 'open', {
              step: 1, isApproved: true,
              doneMessage: data.snackbarRedirect.doneMessage
            });
          }
        });
      } else if (data === 'thread-edit'){
        this.modalService.showModal(ThreadEditorComponent, options);
      }  else if (data === 'thread-new'){
        this.modalService.showModal(MessageEditorComponent, options).then((data: any) => {
          // TODO:
          if (data && data.willCreate) {
            setTimeout(() => {
              mProxy.switchBack('thread-new', data.willCreate);
            }, 200);
          }
          // --
        });
      } else if (data === 'thread-add-member' || (data instanceof Array && data.length > 0 && data[0] === 'thread-add-member' )) {
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(MessageEditorComponent, options).then((data: any) => {
          // TODO:
          if (data && data.willAdd) {
            setTimeout(() => {
              mProxy.switchBack('thread-add-member', data.willAdd);
            }, 200);
          }
          // --
        });
      } else if (data === 'switch-community') {
        this.modalService.showModal(CommunityListComponent, options);
      } else if (data === 'send-point' || (data instanceof Array && data.length > 0 && data[0] === 'send-point' )) {
        // TODO:
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(PointSenderComponent, options).then((data: any) => {
          if (data && data.snackbarRedirect) {
            this.trayService.request('snackbar/', 'open', {
              step: 1, isApproved: true,
              doneMessage: data.snackbarRedirect.doneMessage
            });
          }
        });
      } else if (data === 'search' || (data instanceof Array && data.length > 0 && data[0] === 'search' )) {
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(PointSenderComponent, options);
      }

    });

    //
    this.lSubscription = trayService.userpageLock$.subscribe((state: boolean) => {
      this.locked = state;
    });
  }

  ngOnInit() {
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
    this.pTasksService.stop();
  }

  onOuterTouch(): boolean {
    return false;
  }
}
