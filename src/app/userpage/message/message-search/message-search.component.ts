import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';
import { MessageProxyService } from '../../message-proxy.service';

@Component({
  selector: 'app-message-search',
  templateUrl: './message-search.component.html',
  styleUrls: ['./message-search.component.scss']
})
export class MessageSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  currentList: any[];
  user: User;
  currentCommunityId: number;
  filterBy: string = 'member';
  msgSubscription: Subscription;

  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageProxyService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.currentCommunityId = this.userService.currentCommunityId;

    //
    this.msgSubscription = this.messageService.activeThreads$.subscribe(
      (data) => { this.currentList = data; }
    );
    // this.messageService.fetchThreads(this.currentCommunityId);

    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
    //   const aW = this.anchor.getMeasuredWidth() / screen.mainScreen.scale;
    //   const eW = this.fbtnEl.getMeasuredWidth() / screen.mainScreen.scale;
    //   const eH = this.fbtnEl.getMeasuredHeight() / screen.mainScreen.scale;
    //   AbsoluteLayout.setLeft(this.fbtnEl, aW - eW - (eW * 0.33));
    //   AbsoluteLayout.setTop(this.fbtnEl, aH - eH - (eH * 0.33));
    // }, 100);
  }

  ngOnDestroy() {
    this.msgSubscription.unsubscribe();
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    // this.routerExt.navigateByUrl(`/user;clearHistory=true/(userpage:community/topic/${tItem.id})`);
    // ...
    this.routerExt.navigate([{
      outlets: {
        userpage: (['message', 'log', tItem.id])
      }
    }], { relativeTo: this.aRoute.parent });
  }

  onNavItemTap(args: any) {
    this.filterBy = <string>args;

  }

  cancelAction() {
    this.routerExt.backToPreviousPage();
  }

  searchAction(e: any) {
    // this.messageService.fetchThreads(this.currentCommunityId);
    if (e.search) {
      const t = `${this.filterBy}Filter`;
      this.messageService.searchThreads(
        { [t]: encodeURI(e.search) }
      );
    }
  }
}
