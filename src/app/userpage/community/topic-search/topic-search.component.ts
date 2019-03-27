import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Subscription, Subject, of, from } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators'

import { map } from 'rxjs/operators';
import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService } from '../../../user.service';

@Component({
  selector: 'app-topic-search',
  templateUrl: './topic-search.component.html',
  styleUrls: ['./topic-search.component.scss']
})
export class TopicSearchComponent implements OnInit, AfterViewInit {

  currentCommunity: any;
  currentList: any[] = [];

  // private _subs: Subscription;
  // private _sub = new Subject<any>();

  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  //
  ngOnInit() {
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngOnDestroy() {
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

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    // this.routerExt.navigateByUrl(`/user;clearHistory=true/(userpage:community/topic/${tItem.id})`);
    // ..
    this.routerExt.navigate([{
      outlets: {
        userpage: (['community', 'topic', tItem.id])
      }
    }], { relativeTo: this.aRoute.parent });
    //
  }

  cancelAction() {
    this.routerExt.backToPreviousPage();
  }

  searchAction(e: any) {
    if (e.search) {
      this.userService.getTopics(this.userService.currentCommunityId, encodeURI(e.search)).subscribe((data: any) => {
        console.log(data);
        this.currentList = data;
      });
    }
  }
}
