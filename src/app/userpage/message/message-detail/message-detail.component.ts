import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription, timer, fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/platform';

import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { TextView } from 'tns-core-modules/ui/text-view';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData, ListViewItemSnapMode } from 'nativescript-ui-listview';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';

import { UserService, User } from '../../../user.service';
import { ModalProxyService } from '../../modal-proxy.service';
import { MessageProxyService } from '../../message-proxy.service';

// declare const IQKeyboardManager: any;

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = '';
  user: User;
  messageLog: any[] = [];
  threadObj: any;

  limH: number = 70;
  limHforDevice: number = 200;
  minHforDevice: number = 70;
  firstFetchFlag: boolean = false;
  isEmpty: boolean = true;
  sendText = new FormControl('');

  loadingRetired: boolean = false;

  mSubscription: Subscription;
  fSubscription: Subscription;
  tCSubs: Subscription;

  @ViewChild('sendTray') sTrayRef: ElementRef;
  @ViewChild('sendInput') sInputRef: ElementRef;
  @ViewChild('mContent') mContentRef: ElementRef;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
    private pageRoute: PageRoute,
    private page: Page,
    private userService: UserService,
    private messageService: MessageProxyService,
    private mProxy: ModalProxyService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    this.mSubscription = this.messageService.incommingMessage$.subscribe(
      (data) => {
        // TODO:
        // - scroll behavior
        // - performance
        if (this.messageLog.length == 0) {
          this.messageLog = data;

          if (this.messageLog.length > 0) {
            setTimeout(() => {
              const sc: number = this.mContentRef.nativeElement.scrollableHeight;
              this.mContentRef.nativeElement.scrollToVerticalOffset(sc, this.firstFetchFlag);
              this.firstFetchFlag = true;
            }, 40);
          }
        } else {
          if (data.length > this.messageLog.length) {
            const nmsg = data.slice(this.messageLog.length).filter((el) => {
              return this.messageLog.findIndex((iel) => el.id == iel.id) < 0
            });
            this.messageLog = this.messageLog.concat(nmsg);
            setTimeout(() => {
              // TODO: scroll behavior
              const sc: number = this.mContentRef.nativeElement.scrollableHeight;
              this.mContentRef.nativeElement.scrollToVerticalOffset(sc, this.firstFetchFlag);
            }, 40);
          }
        }
      }
    );

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        // 1. default
        const desireId: number = <number>params.id;
        this.title = `ダイレクトメッセージ: ${desireId}`;

        // 2. case: created & posted already
        const _thread = this.messageService.activeThreads.find((el) => el.id == desireId);
        if (_thread) {
          this.threadObj = _thread;
          this.title = this.threadObj.title;
        }

        // 3. case: completely new (empty message)
        this.pageRoute.activatedRoute
          .pipe(switchMap((aRoute) => aRoute.queryParams))
          .forEach((qparams) => {
            if (!this.threadObj && qparams && qparams.title) {
              this.title = qparams.title;
            }

            if (qparams && qparams.focusAtInit) {
              timer(isIOS ? 200 : 100, 100).pipe(
                takeUntil(fromEvent(this.sInputRef.nativeElement, 'focus'))
              ).subscribe(_ => this.sInputRef.nativeElement.focus())
            }
          })

        this.fSubscription = timer(3000, 2000).subscribe((data: any) => {
          this.messageService.fetchMessages(desireId);
        });

        this.messageService.fetchMessages(desireId);

        timer(3000).subscribe(_ => { this.loadingRetired = true; });
      });
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
    this.fSubscription.unsubscribe();
    this.tCSubs.unsubscribe();
  }

  ngAfterViewInit() {
    // a. watch text content changed, then expand area if not expanded
    this.tCSubs = this.sendText.valueChanges.subscribe((val: string) => {
      if (this.limH != this.limHforDevice && val != '') {
        this.limH = this.limHforDevice;
      } else if (val == '') {
        this.limH = this.minHforDevice;
      }

      this.isEmpty = val == '';
    });
  }

  //   styled(text: string) {
  //     const msg = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
  //     return `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular, Noto Sans JP Regular; margin:0; line-height:1.2; font-size:14;">
  // ${msg}
  // </div>`;
  //   }

  getAvatar(id: number): string {
    let avatar: string = '~/assets/placeholder__user.png';

    if(this.threadObj && this.threadObj.parties) {
      let u: any = this.threadObj.parties.find((el) => el.id == id);
      if (!u) {
        u = this.threadObj.creator.id == id ? this.threadObj.creator : false;
      }
      if (u && u.avatarUrl) {
        avatar = u.avatarUrl;
      }
    }

    return avatar;
  }

  onActiveContentArea() {
    const nH: number = this.sTrayRef.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;
    if (this.limH == this.limHforDevice && nH < this.limHforDevice) {
      this.limH = nH;
    }
  }

  onFocus() {
    // TODO: use calicurate device height
    this.limH = this.limHforDevice;
  }

  sendMessage() {
    this.messageService.sendMessages(this.sendText.value);
    this.sendText.setValue('');
  }

  sendPoint() {
    this.mProxy.request('send-point');
  }

  goToSettings() {
    this.routerExt.navigate([{
      outlets: { userpage: [ 'message', 'settings', this.threadObj.id ]  }
    }], {
      relativeTo: this.aRoute.parent
    })
  }
}
