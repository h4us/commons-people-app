import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

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

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private messageService: MessageProxyService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.queryParams))
      .forEach((qparams: any) => {
        if (qparams && qparams.communityId) {
          this.currentCommunityId = qparams.communityId;
        } else {
          this.currentCommunityId = this.userService.currentCommunityId;
        }
      });

    this.msgSubscription = this.messageService.activeThreads$.subscribe(
      (data) => {
        this.currentList = data;
      }
    );
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // this.messageService.clear();
    this.msgSubscription.unsubscribe();
    this.messageService.fetchThreads(this.currentCommunityId);
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
    if (e.search) {
      const t = `${this.filterBy}Filter`;
      this.messageService.searchThreads(
        { [t]: encodeURI(e.search) }, this.currentCommunityId
      );
    }
  }
}
