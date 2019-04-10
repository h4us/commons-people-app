import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { Subscription, Subject, of, from, fromEvent } from 'rxjs';
import { take, switchMap, delay, map } from 'rxjs/operators';

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

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.scss'],
  // providers: [NewsService],
})
export class CommunityRootComponent implements OnInit, OnDestroy, AfterViewInit {
  //
  currentCommunity: any;
  currentList: any[] = [];
  topics: any[];
  profile: any[];
  currentTab: string = 'topics';
  isPreview: boolean = false;

  private _news: News[];

  private uSubscription: Subscription;
  private mSubscription: Subscription;
  private _sub = new Subject<any>();

  @ViewChild('floatingButton') fbtnRef: ElementRef;
  @ViewChild('floatingToggle') ftglRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  fbtnEl: Button;
  ftgl: FlexboxLayout;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pagRoute: PageRoute,
    private userService: UserService,
    private newsService: NewsService,
    private mProxy: ModalProxyService,
    private page: Page,
    private vcRef: ViewContainerRef,
    private tService: SystemTrayService
  ) {
    page.actionBarHidden = true;
  }

  //
  ngOnInit() {
    //
    from(this._sub).pipe(
      switchMap(_ => { return this.userService.getTopics() })
    ).subscribe((data: any) => {
      const _data: any = data.map((el) => { el['tpl'] = 'topics'; return el; })
      this.topics = _data;
      this.currentList = _data;
    });

    this.uSubscription = this.userService.updateRequest$.subscribe(_ => {
      // --
      this.currentCommunity = this.userService.getCommunity();
      this._sub.next(true);
      this.newsService.fetch(`?categories=${this.userService.currentCommunityId}`);
      // --
    });

    this.mSubscription = this.mProxy.switchBack$.subscribe((data: any) => {
      if (data == 'topic') {
        console.log('after create reload!')
        this.currentCommunity = this.userService.getCommunity();
        this._sub.next(true);
      }
    });

    //
    if (this.aRoute.snapshot.url.filter((el) => el.path == 'preview').length > 0) {
      this.isPreview = true;
      this.userService.searchCommunities(encodeURI(this.aRoute.snapshot.params.name)).subscribe((data: any) => {
        // TODO:
        this.currentCommunity = data[0];
        this.currentList = [
          {
            tpl: 'profile',
            description: this.currentCommunity.description
          }
        ];
        this.currentTab = 'profile';
        this.newsService.fetch(`?categories=${this.currentCommunity.id}`);
        // --
      });
    } else {
      this.currentCommunity = this.userService.getCommunity();
      this._sub.next(true);
      this.newsService.fetch();
    }

    this.fbtnRef.nativeElement.opacity = 0;
    this.ftglRef.nativeElement.opacity = 0;
    this.fbtnEl = <Button>this.fbtnRef.nativeElement;
    this.ftgl = <FlexboxLayout>this.ftglRef.nativeElement;
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
      const eW = this.fbtnEl.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.fbtnEl.getMeasuredHeight() / screen.mainScreen.scale;

      AbsoluteLayout.setLeft(this.fbtnRef.nativeElement, aW - eW - (eW * 0.33));
      AbsoluteLayout.setTop(this.fbtnRef.nativeElement, aH - eH - (eH * 0.33));
      this.fbtnRef.nativeElement.opacity = 1;
    });

    fromEvent(this.ftglRef.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const tH = this.ftgl.getMeasuredHeight() / screen.mainScreen.scale;

      AbsoluteLayout.setTop(this.ftglRef.nativeElement, aH - tH);
      this.ftglRef.nativeElement.opacity = 1;
    });
  }

  get news() {
    this._news = this.newsService.items;
    return this._news;
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    if (this.currentTab === 'topics') {
      this.routerExt.navigate(['../community/topic', tItem.id], {
        relativeTo: this.aRoute
      });
    } else if (this.currentTab === 'news' && !this.isPreview) {
      this.routerExt.navigate(['../community/news', tItem.id], {
        relativeTo: this.aRoute
      });
    }
  }

  onSwitchTab(args: string) {
    this.currentTab = args;

    if (args === 'topics') {
      this.currentList = this.topics;
      AbsoluteLayout.setLeft(this.fbtnEl, layout.toDeviceIndependentPixels(screen.mainScreen.widthPixels - (screen.mainScreen.scale * (20 + 60))));
    } else if (args === 'news') {
      this._news = this.newsService.items;
      this.currentList = this._news;
      AbsoluteLayout.setLeft(this.fbtnEl, -300);
    } else {
      this.currentList = [
        {
          tpl: 'profile',
          description: this.currentCommunity.description
        }
      ];
      AbsoluteLayout.setLeft(this.fbtnEl, -300);
    }
  }

  searchAction() {
    this.routerExt.navigate(['./topics/search'], {
      relativeTo: this.aRoute
    });
  }

  onFabTap() {
    this.mProxy.request('topic');
  }

  onSwitchTap() {
    this.mProxy.request('switch-community');
  }

  templateSelector(item: any, index: number, items: any) {
    return item.tpl;
  }

  toDraft() {
    const inDraft: number = this.userService.draftCommunityIds.indexOf(this.currentCommunity.id);
    if (inDraft < 0) {
      this.userService.draftCommunityIds.push(this.currentCommunity.id);
      this.userService.draftCommunities.push(this.currentCommunity);
    } else {
      this.userService.draftCommunityIds.splice(inDraft, 1);
      this.userService.draftCommunities.splice(inDraft, 1);
    }

    console.log(this.userService.draftCommunityIds, this.userService.draftCommunities);
  }

  get inDraft(): boolean {
    return (this.currentCommunity && (this.userService.draftCommunityIds.indexOf(this.currentCommunity.id) > -1));
  }

  styled(text: string) {
    // TODO:
    const content = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    return `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular, Noto Sans JP Regular; margin:0; line-height:1.2; font-size:14;">
${content}
</div>`;
  }
}
