import { Component, OnInit, OnDestroy, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';

import { TopicEditorComponent } from '../community/topic-editor/topic-editor.component';
import { TopicOwnerComponent } from '../community/topic-owner/topic-owner.component';
import { CommunityListComponent } from '../community/community-list/community-list.component';
import { ThreadEditorComponent } from '../message/thread-editor/thread-editor.component';
import { MessageEditorComponent } from '../message/message-editor/message-editor.component';
import { PointSenderComponent } from '../point/point-sender/point-sender.component';

import { ModalProxyService } from '../modal-proxy.service';
import { MessageProxyService } from '../message-proxy.service';

@Component({
  selector: 'app-userpage-root',
  templateUrl: './userpage-root.component.html',
  styleUrls: ['./userpage-root.component.scss'],
})
export class UserpageRootComponent implements OnInit {

  mSubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private modalService: ModalDialogService,
    private messageService: MessageProxyService,
    private page: Page,
    private vcRef: ViewContainerRef,
    private aRoute: ActivatedRoute,
    private mProxy: ModalProxyService,
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
        this.modalService.showModal(TopicEditorComponent, options);
      } else if (data === 'topic-owner' || (data instanceof Array && data.length > 0 && data[0] === 'topic-owner' )) {
        // TODO:
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(TopicOwnerComponent, options);
      } else if (data === 'thread-edit'){
        this.modalService.showModal(ThreadEditorComponent, options);
      } else if (data === 'thread-new'){
        this.modalService.showModal(MessageEditorComponent, options).then((data: any) => {
          // TODO:
          if (data && data.willCreate) {
            setTimeout(() => {
              mProxy.switchBack('thread-new', data.willCreate);
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
        this.modalService.showModal(PointSenderComponent, options);
      } else if (data === 'search' || (data instanceof Array && data.length > 0 && data[0] === 'search' )) {
        if (data instanceof Array && data.length > 1) {
          options.context = data[1];
        }
        this.modalService.showModal(PointSenderComponent, options);
      }

    });
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        userpage: ['community']
      }
    }], { relativeTo: this.aRoute });
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
  }
}
