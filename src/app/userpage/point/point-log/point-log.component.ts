import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { switchMap } from 'rxjs/operators';

import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { UserService } from '../../../user.service';
import { ModalProxyService } from '../../modal-proxy.service';

@Component({
  selector: 'app-point-log',
  templateUrl: './point-log.component.html',
  styleUrls: ['./point-log.component.scss']
})
export class PointLogComponent implements OnInit, AfterViewInit {
  title: string = '';
  currentCommunity: any;
  currentBalanceInfo: any;
  currentList: any[] = [];

  @ViewChild('floatingButton') fbtn: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  fbtnEl: Button;
  anchor: StackLayout;

  constructor(
    private router: RouterExtensions,
    private pageRoute: PageRoute,
    private userService: UserService,
    private mProxy: ModalProxyService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const desireId: number = <number>params.id;
        this.currentCommunity = this.userService.getCommunity(desireId);
        this.title = this.currentCommunity.name;

        this.userService.getBalance(desireId).subscribe((bl: any) => {
          this.currentBalanceInfo = bl;
        });

        this.userService.getTransactions(desireId).subscribe((tr: any) => {
          if (tr && tr.length > 0) {
            this.currentList = tr;
          } else {
            // TEST:
            // TODO: no-point image
            this.currentList = Array(30).fill({
              remitter: {
                username: 'testuser'
              },
              beneficiary: {
                username: 'testuser'
              },
              amount: 100,
              description: 'test',
              createdAt: new Date()
            });
            // --
          }
        });
      });

    this.fbtnEl = <Button>this.fbtn.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      const aW = this.anchor.getMeasuredWidth() / screen.mainScreen.scale;
      const eW = this.fbtnEl.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.fbtnEl.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setLeft(this.fbtnEl, aW - eW - (eW * 0.33));
      AbsoluteLayout.setTop(this.fbtnEl, aH - eH - (eH * 0.33));
    }, 100);
  }

  onFabTap(args?: any) {
    this.mProxy.request('send-point', { communityId: this.currentCommunity.id });
  }
}
