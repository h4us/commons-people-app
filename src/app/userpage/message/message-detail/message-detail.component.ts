import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/platform';

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
export class MessageDetailComponent implements OnInit, OnDestroy {
  title: string = '';
  user: User;
  messageLog: any[];
  threadObj: any;

  sendText:string = 'hello';

  mSubscription: Subscription;

  @ViewChild('messageContainer') mContainer: RadListViewComponent;

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
  }

  ngOnDestroy() {
    this.mSubscription.unsubscribe();
  }

  onItemTap(event: any) {
    // this.mContainer.listView.scrollWithAmount(-200, true);
  }

  styled(text: string) {
    // TODO:
    const msg = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    return `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular; margin:0; line-height:1.2; font-size:14;">
${msg}
</div>`;
  }

  sendMessage() {
    this.messageService.sendMessages(this.sendText);
  }

  sendPoint() {
    this.mProxy.request('send-point');
  }

  // TODO:
  onTextChange(args: any) {
    // if (isIOS) {
    //   setTimeout(() => {
    //     // args.object.ios.contentOffset = new CGPoint();
    //     const iqKeyboard = IQKeyboardManager.sharedManager();
    //     iqKeyboard.reloadLayoutIfNeeded();
    //   }, 100);
    // }
  }

  onFocus(args: any) {
    // if (isIOS) {
    //   setTimeout(() => {
    //     const iqKeyboard = IQKeyboardManager.sharedManager();
    //     iqKeyboard.reloadLayoutIfNeeded();
    //   }, 100)
    // }
  }

}
