import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { fromEvent } from 'rxjs';
import { take, switchMap, delay } from 'rxjs/operators'

import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';

import { UserService, User } from '../../../user.service';

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
  user: User;

  @ViewChild('floatingButton') fbtnRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  fbtnEl: Button;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const desireId: number = <number>params.id;

        this.user = this.userService.getCurrentUser();
        this.currentCommunity = this.userService.getCommunity(desireId);
        this.title = this.currentCommunity.name;

        this.userService.getBalance(desireId).subscribe((bl: any) => {
          this.currentBalanceInfo = bl;
        });

        this.userService.getTransactions(desireId).subscribe((tr: any) => {
          if (tr && tr.length > 0) {
            this.currentList = tr;
          } else {
            // TEST
            this.currentList = Array(30).fill({
              remitter: {
                username: 'testuser'
              },
              beneficiary: {
                username: 'testuser'
              },
              amount: 100,
              description: 'this is dummy this is dummy this is dummy this is dummy this is dummy this is dummy',
              createdAt: new Date()
            });
            // --
          }
        });
      });

    this.fbtnRef.nativeElement.opacity = 0;

    this.fbtnEl = <Button>this.fbtnRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
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
  }

  onFabTap() {
    this.routerExt.navigate(['../../select', this.currentCommunity.id ], {
      relativeTo: this.aRoute
    });
  }

  padName(n: string): string {
    // if (n.length < 15) {
    //   const p = Array(15 - n.length).fill('M');
    //   return n + p.join('');
    // } else {
    //   return n;
    // }
    return n;
  }

  padOrLimPoints(n: number): string {
    if (n.toString().length > 8) {
      return n.toString().slice(0, 4) + '.e+' + (n.toString().length - 4);
    } else {
      return n.toString();
    }
  }
}
