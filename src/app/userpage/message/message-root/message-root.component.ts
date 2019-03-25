import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';
import { ModalProxyService } from '../../modal-proxy.service';
import { MessageProxyService } from '../../message-proxy.service';

@Component({
  selector: 'app-message-root',
  templateUrl: './message-root.component.html',
  styleUrls: ['./message-root.component.scss']
})
export class MessageRootComponent implements OnInit, OnDestroy, AfterViewInit {
  currentList: any[];
  navList: any[];
  user: User;
  currentCommunityId: number;
  msgSubscription: Subscription;
  mdlSubscription: Subscription

  @ViewChild('floatingButton') fbtn: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  fbtnEl: Button;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private mProxy: ModalProxyService,
    private messageService: MessageProxyService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.currentCommunityId = this.userService.currentCommunityId;

    //
    this.navList = this.userService.getCommnities();

    //
    this.msgSubscription = this.messageService.activeThreads$.subscribe(
      (data) => { this.currentList = data; }
    );
    this.messageService.fetchThreads(this.currentCommunityId);
    // this.messageService.fetchThreads();

    //
    this.mdlSubscription = this.mProxy.switchBack$.subscribe((data) => {
      if (data instanceof Array && data.length > 1 && data[0] === 'thread-new') {
        this.routerExt.navigate(['../message/log', data[1]], {
          relativeTo: this.aRoute
        });
      }
    });

    this.fbtnEl = <Button>this.fbtn.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const aW = this.anchor.getMeasuredWidth() / screen.mainScreen.scale;
      const eW = this.fbtnEl.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.fbtnEl.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setLeft(this.fbtnEl, aW - eW - (eW * 0.33));
      AbsoluteLayout.setTop(this.fbtnEl, aH - eH - (eH * 0.33));
    }, 100);
  }

  ngOnDestroy() {
    this.msgSubscription.unsubscribe();
    this.mdlSubscription.unsubscribe();
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    this.routerExt.navigate(['../message/log', tItem.id], {
      relativeTo: this.aRoute
    });
  }

  onNavItemTap(args: any) {
    // onNavItemTap(args: ListViewEventData) {
    // const tItem = args.view.bindingContext;
    const tItem = args;

    this.currentCommunityId = tItem.id;
    this.messageService.fetchThreads(this.currentCommunityId);
  }

  onFabTap(name?: string) {
    this.mProxy.request(name ? name : 'message');
  }
}
