import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { Subscription, interval } from 'rxjs';
import { skipWhile, switchMap, debounceTime, filter, tap, delay } from 'rxjs/operators';

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
  messageLog: any[];
  threadObj: any;

  limH: number = 70;
  limHforDevice: number = 200;
  minHforDevice: number = 70;
  firstFetchFlag: boolean = false;
  isEmpty: boolean = true;
  sendText = new FormControl('');

  mSubscription: Subscription;
  tCSubs: Subscription;

  @ViewChild('sendTray') sTrayRef: ElementRef;
  @ViewChild('sendInput') sInputRef: ElementRef;
  @ViewChild('mContent') mContentRef: ElementRef;

  constructor(
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
        this.messageLog = data;
        if (this.messageLog.length > 0) {
          setTimeout(() => {
            // TODO: scroll behavior
            const sc: number = this.mContentRef.nativeElement.scrollableHeight;
            this.mContentRef.nativeElement.scrollToVerticalOffset(sc, this.firstFetchFlag);
            this.firstFetchFlag = true;
          }, 40);
        }
      }
    );

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const desireId: number = <number>params.id;
        this.title = `ダイレクトメッセージ: ${desireId}`;
        // this.title = `Message: ${desireId}`;

        if (this.messageService.activeThreads) {
          const _thread = this.messageService.activeThreads.filter((el) => el.id == desireId);
          if (_thread.length > 0) {
            this.threadObj = _thread[0];
            this.title = this.threadObj.title;
          }
        }

        this.messageService.fetchMessages(desireId);
      });
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
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

  styled(text: string) {
    // TODO:
    const msg = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    return `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular; margin:0; line-height:1.2; font-size:14;">
${msg}
</div>`;
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
}
