import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, fromEvent, timer } from 'rxjs';
import { take, switchMap, delay } from 'rxjs/operators'

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
  loadingRetired: boolean = false;

  msgSubscription: Subscription;
  mdlSubscription: Subscription

  @ViewChild('floatingButton') fbtnRef: ElementRef;
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
    this.navList = this.userService.getCommunities();

    //
    if (!this.msgSubscription) {
      this.msgSubscription = this.messageService.activeThreads$.subscribe((data:any) => {
        this.currentList = data;
      });
    }

    //
    if (!this.mdlSubscription) {
      this.mdlSubscription = this.mProxy.switchBack$.subscribe((data) => {
        if (data instanceof Array && data.length > 1 && data[0] === 'thread-new') {
          this.routerExt.navigate(['../message/log', data[1]], {
            relativeTo: this.aRoute
          });
        }
      });
    }

    this.fbtnRef.nativeElement.opactiy = 0;

    this.fbtnEl = <Button>this.fbtnRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    fromEvent(this.fbtnRef.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const aW = this.anchor.getMeasuredWidth() / screen.mainScreen.scale;
      const eW = this.fbtnEl.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.fbtnEl.getMeasuredHeight() / screen.mainScreen.scale;

      AbsoluteLayout.setLeft(this.fbtnRef.nativeElement, aW - eW - (eW * 0.33));
      AbsoluteLayout.setTop(this.fbtnRef.nativeElement, aH - eH - (eH * 0.33));
      this.fbtnRef.nativeElement.opacity = 1;
    });

    timer(3000).subscribe(_ => { this.loadingRetired = true; });

    this.messageService.fetchThreads(this.currentCommunityId);
  }

  ngOnDestroy() {
    this.msgSubscription.unsubscribe();
    this.mdlSubscription.unsubscribe();
  }

  onItemTap(tItem: any) {
    this.routerExt.navigate(['../message/log', tItem.id], {
      relativeTo: this.aRoute
    });
  }

  onNavItemTap(args: any) {
    const tItem = args;

    this.loadingRetired = false;
    timer(3000).subscribe(_ => { this.loadingRetired = true; });

    this.currentCommunityId = tItem.id;
    this.messageService.fetchThreads(this.currentCommunityId);
  }

  modalAction(name?: string) {
    this.mProxy.request(name ? name : 'thread-edit', { inCommunity: this.currentCommunityId });
  }

  searchAction() {
    this.routerExt.navigate(['../message/search'], {
      relativeTo: this.aRoute,
      queryParams: {
        communityId: this.currentCommunityId
      },
      // TODO: isIOS switch?
      transition: { name: 'fade', duration: 150 },
    });
  }

  get dstr() {
    return this.messageService.debugStr;
  }
}
