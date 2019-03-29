import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { Subscription, interval } from 'rxjs';
import { switchMap, debounceTime, filter } from 'rxjs/operators';

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

declare const IQKeyboardManager: any;

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

  resizes: number = 0;
  ovf: boolean = false;
  sendText = new FormControl('');

  mSubscription: Subscription;

  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  @ViewChild('sendTray') sTrayRef: ElementRef;
  sTray: GridLayout | StackLayout | TextView;
  anchor: StackLayout;

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
          // setTimeout(() => {
          //   this.mContainer.listView.scrollToIndex(this.messageLog.length - 1, false);
          // }, 300);
        }
      }
    );

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const desireId: number = <number>params.id;
        this.title = `Message: ${desireId}`;

        //
        if (this.messageService.activeThreads) {
          const _thread = this.messageService.activeThreads.filter((el) => el.id == desireId);
          if (_thread.length > 0) {
            this.threadObj = _thread[0];
            this.title = this.threadObj.title;
          }
        }
        //

        this.messageService.fetchMessages(desireId);
      });

    this.sTray = this.sTrayRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;

    // this.sendText.valueChanges.subscribe((val) => {
    //   if (this.sTray) {
    //     const eH: number = this.sTray.getMeasuredHeight() / screen.mainScreen.scale;
    //     if (eH > 200) {
    //       this.ovf = true;
    //       this.resizes = eH;
    //     } else if (this.resizes > 200){
    //       this.ovf = false;
    //       this.resizes = eH;
    //     }
    //   }
    // });
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
  }

  ngAfterViewInit() {
  }

  styled(text: string) {
    // TODO:
    const msg = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    return `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular; margin:0; line-height:1.2; font-size:14;">
${msg}
</div>`;
  }

  sendMessage() {
    this.messageService.sendMessages(this.sendText.value);
  }

  sendPoint() {
    this.mProxy.request('send-point');
  }
}
