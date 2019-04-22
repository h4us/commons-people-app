import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Subscription, Subject, of, from, timer } from 'rxjs';
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
  currentQueryParams: any;
  loadingRetired: boolean = true;

  // private _subs: Subscription;
  private topicSubject = new Subject<any>();

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

    this.currentCommunity = this.userService.getCommunity();

    this.currentQueryParams = {
      communityId: this.userService.currentCommunityId,
      pagination: { page: 0, size: 10, sort: 'DESC' }
    }

    from(this.topicSubject).pipe(
      switchMap((data: any) => {
        this.currentQueryParams = Object.assign(this.currentQueryParams, data);
        return this.userService.getTopics(data);
      })
    ).subscribe((data: any) => {
      if (this.currentList.length == 0) {
        this.currentList = data.adList;
      } else {
        const _data: any = data.adList.filter((el: any) => this.currentList.find((iel: any) => iel.id != el.id));
        this.currentList = this.currentList.concat(_data);
      }

      if (data && data.pagination) {
        this.currentQueryParams = Object.assign(this.currentQueryParams, { pagination: data.pagination });
      }

      timer(3000).subscribe(_ => this.loadingRetired = true);
    });
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    this.routerExt.navigate([{
      outlets: {
        userpage: (['community', 'topic', tItem.id])
      }
    }], { relativeTo: this.aRoute.parent });
  }

  cancelAction() {
    this.routerExt.backToPreviousPage();
  }

  searchAction(e: any) {
    if (e.search) {
      this.currentList = [];
      this.loadingRetired = false;

      this.topicSubject.next({
        communityId: this.userService.currentCommunityId,
        query: encodeURI(e.search),
        pagination: { page: 0, size: 10, sort: 'DESC' }
      });
    }
  }

  moreSearchResult() {
    const nextPageParams: any = Object.assign({}, this.currentQueryParams);
    nextPageParams.pagination.page = nextPageParams.pagination.page + 1;
    this.topicSubject.next(nextPageParams);
  }
}
