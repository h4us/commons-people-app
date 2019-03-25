import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../../user.service';

@Component({
  selector: 'app-point-sender-confirm',
  templateUrl: './point-sender-confirm.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderConfirmComponent implements OnInit {
  title: string = "ポイントを送る";

  currentCommunity: any;
  sendToUser: any;
  tokenSymbol: string = '';
  points: number = 0;

  @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  ovBcPrev: FlexboxLayout;
  anchor: StackLayout;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    // TODO: ..?
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const uid = <number>params.id;
        this.userService.getUserDetail(uid).subscribe((data: any) => {
          this.sendToUser = data;
        });
      });
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.queryParams))
      .forEach((params) => {
        this.points = <number>params.points;
        this.tokenSymbol = <string>params.tokenSymbol;
        this.currentCommunity = this.userService.getCommunityByToken(this.tokenSymbol);
      });

    this.ovBcPrev = <FlexboxLayout>this.ovBcPrevRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    // ...
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
    }, 100);
  }
}
