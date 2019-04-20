import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { Subscription, Subject, of, from, fromEvent } from 'rxjs';
import { take, switchMap, delay, map, tap } from 'rxjs/operators';

import { Page } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen, isIOS } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService } from '../../../user.service';
import { ModalProxyService } from '../../modal-proxy.service';
import { NewsService, News } from '../../news.service';

import { SystemTrayService } from '../../../system-tray.service';

import { environment } from '~/environments/environment';

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.scss'],
})
export class CommunityRootComponent implements OnInit, OnDestroy, AfterViewInit {
  //
  currentCommunity: any;
  topics: any[];
  profile: any;
  currentTab: string = 'topics';
  isPreview: boolean = false;
  currentPaging: any = {
    topics: 1,
    news: 10
  }
  pagingConfig: any;
  currentTotalTopics: number = -1;
  toScrollBack: number = -1;

  private _news: News[];

  private uSubscription: Subscription;
  private mSubscription: Subscription;
  private _sub = new Subject<any>();

  @ViewChild('floatingButton') fbtnRef: ElementRef;
  @ViewChild('floatingToggle') ftglRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  @ViewChild('scrollView') scRef: ElementRef;

  @ViewChild('topicsContainer') tContainerRef: ElementRef;
  tcTopEdge: number = 0;

  anchor: StackLayout;

  isProd: boolean = environment.production;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private newsService: NewsService,
    private mProxy: ModalProxyService,
    private page: Page,
    private tService: SystemTrayService
  ) {
    page.actionBarHidden = true;
  }

  //
  ngOnInit() {
    this.pagingConfig = Object.assign({}, this.userService.defaultPaging);

    //
    from(this._sub).pipe(
      switchMap((data: any) => {
        let ret = this.userService.getTopics();

        // TODO: more better way..
        if (data == 'new topic') {
          // ret = this.userService.getTopics(this.currentCommunity.id, '', { size: this.topics.length + 1 });
          this.toScrollBack = this.tcTopEdge;
        } else {
          this.toScrollBack = -1;
        }

        return ret;
      })
    ).subscribe((data: any) => {
      const _data: any = data.map((el) => { return el; })
      this.topics = _data;
      this.profile = {
        description: this.currentCommunity.description || ''
      }

      //
      this.currentPaging = {
        topics: 1,
        news: 10
      }

      // TODO:
      this.userService.getTopics(this.currentCommunity.id, '', 'FETCH_ALL').subscribe((res: any) => {
        this.currentTotalTopics = res.length;
      });

      if (this.toScrollBack > -1) {
        setTimeout(() => {
          this.scRef.nativeElement.scrollToVerticalOffset(this.toScrollBack, true);
        }, 300);
      }
    });

    this.uSubscription = this.userService.updateRequest$.subscribe(_ => {
      this.currentCommunity = this.userService.getCommunity();
      this._sub.next(true);
    });

    this.mSubscription = this.mProxy.switchBack$.subscribe((data: any) => {
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

      if (this.userService.getCommunities().length == 0) {
        // TODO: need test
        setTimeout(() => {
          this.uSubscription.unsubscribe();
          this.mSubscription.unsubscribe();

          this.routerExt.navigate(['newuser'], {
            clearHistory: true
          });
        }, 500);
        return;
      }

      if (target == 'topic' && options && options.needRefresh) {
        this.currentCommunity = this.userService.getCommunity();
        this._sub.next('new topic');
      }

      if (target == 'switch-community') {
        this.newsService.clear();
        this.newsService.fetch(`?community_id=${this.currentCommunity.id}&per_page=10`);
      }
    });

    //
    if (this.aRoute.snapshot.url.filter((el) => el.path == 'preview').length > 0) {
      this.isPreview = true;
      this.userService.searchCommunities(encodeURI(this.aRoute.snapshot.params.name)).subscribe((data: any) => {
        // TODO..:
        this.currentCommunity = data[0];
        this.profile = {
          description: this.currentCommunity.description || ''
        }
        this.currentTab = 'profile';
        this.newsService.clear();
        this.currentPaging = {
          topics: 1,
          news: 10
        }
        this.newsService.fetch(`?community_id=${this.currentCommunity.id}&per_page=10`);
        // --
      });
    } else {
      this.currentCommunity = this.userService.getCommunity();
      this.newsService.clear();
      this.newsService.fetch(`?community_id=${this.userService.currentCommunityId}&per_page=10`);
      this._sub.next(true);
    }

    this.fbtnRef.nativeElement.opacity = 0;
    this.ftglRef.nativeElement.opacity = 0;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngOnDestroy() {
    this.uSubscription.unsubscribe();
    this.mSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    fromEvent(this.fbtnRef.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const aW = this.anchor.getMeasuredWidth() / screen.mainScreen.scale;
      const eW = this.fbtnRef.nativeElement.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.fbtnRef.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;
      ;
      AbsoluteLayout.setLeft(this.fbtnRef.nativeElement, aW - eW - (eW * 0.33));
      AbsoluteLayout.setTop(this.fbtnRef.nativeElement, aH - eH - (eH * 0.33));
      this.fbtnRef.nativeElement.opacity = 1;
    });

    fromEvent(this.ftglRef.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const tH = this.ftglRef.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;

      AbsoluteLayout.setTop(this.ftglRef.nativeElement, aH - tH);
      this.ftglRef.nativeElement.opacity = 1;
    });

    fromEvent(this.tContainerRef.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      this.tcTopEdge = this.tContainerRef.nativeElement.getLocationInWindow().y - 30;
    });
  }

  get news() {
    this._news = this.newsService.items;
    return this._news;
  }

  get communities() {
    return this.userService.getCommunities();
  }

  onItemTap(tItem: any) {
    if (this.currentTab === 'topics') {
      this.routerExt.navigate(['../community/topic', tItem.id], {
        relativeTo: this.aRoute
      });
    } else if (this.currentTab === 'news' && !this.isPreview) {
      this.routerExt.navigate(['../community/news', tItem.ID], {
        relativeTo: this.aRoute
      });
    }
  }

  onTabTap(args: string) {
    this.currentTab = args;

    if (args === 'topics') {
      this.userService.updateTopicsLastViewTime(this.currentCommunity.id).subscribe(_ => {
        this.userService.updateSelf().subscribe();
      });
      AbsoluteLayout.setLeft(
        this.fbtnRef.nativeElement,
        layout.toDeviceIndependentPixels(screen.mainScreen.widthPixels - (screen.mainScreen.scale * (20 + 60)))
      );
    } else if (args === 'news') {
      this.userService.updateNewsLastViewTime(this.currentCommunity.id).subscribe(_ => {
        this.userService.updateSelf().subscribe();
      });
      AbsoluteLayout.setLeft(this.fbtnRef.nativeElement, -300);
    } else {
      AbsoluteLayout.setLeft(this.fbtnRef.nativeElement, -300);
    }
  }

  searchAction() {
    this.routerExt.navigate(['./topics/search'], {
      relativeTo: this.aRoute,
      transition: { name: 'fade', duration: 150 },
    });
  }

  onFabTap() {
    this.mProxy.request('topic');
  }

  onSwitchTap() {
    if (this.userService.getCommunities().length > 1) {
      this.mProxy.request('switch-community');
    } else {
      this.mProxy.request('switch-community', { addOnly: true });
    }
  }

  onMoreReadTap() {
    // TODO: button behavior
    if (this.currentTab === 'topics') {
      this.userService.getTopics(this.currentCommunity.id, '', { page: this.currentPaging.topics }).subscribe((data: any) => {
        const _data: any = data.filter((el: any) => this.topics.find((iel: any) => iel.id != el.id));
        this.topics = this.topics.concat(_data);
        this.currentPaging.topics += 1;
      });
    } else if (this.currentTab === 'news') {
      this.newsService.fetch(`?community_id=${this.userService.currentCommunityId}&per_page=10&offset=${this.currentPaging.news}`, false).subscribe(_ => {
        this.currentPaging.news += 10;
      });
    }
  }

  // --
  // preview mode only
  // --
  toDraft() {
    const inDraft: number = this.userService.draftCommunityIds.indexOf(this.currentCommunity.id);
    if (inDraft < 0) {
      this.userService.draftCommunityIds.push(this.currentCommunity.id);
      this.userService.draftCommunities.push(this.currentCommunity);
    } else {
      this.userService.draftCommunityIds.splice(inDraft, 1);
      this.userService.draftCommunities.splice(inDraft, 1);
    }
  }

  get inDraft(): boolean {
    return (this.currentCommunity && (this.userService.draftCommunityIds.indexOf(this.currentCommunity.id) > -1));
  }
  // --
}
