import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../../user.service';
import { PointValidatorService } from '../../point-validator.service';

import { SnackbarLikeComponent } from '../../../shared/snackbar-like/snackbar-like.component';

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

  pForm: FormGroup;
  transactionDone: boolean = false;

  @ViewChild('pointSenderConfirm') rootLayoutRef: ElementRef;
  @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  @ViewChild('snackBar') snackBar: SnackbarLikeComponent;
  rootLayout: AbsoluteLayout;
  ovBcPrev: FlexboxLayout;
  anchor: StackLayout;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
    private pvService: PointValidatorService,
  ) {
    page.actionBarHidden = true;

    this.pForm = pvService.sendForm;
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
    // --

    this.ovBcPrev = <FlexboxLayout>this.ovBcPrevRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
    this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;
  }

  ngAfterViewInit() {
    // ...
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
    }, 100);
  }

  cancelAction() {
    const currentOutlet = this.aRoute.outlet;

    if (this.transactionDone) {
      if (currentOutlet == 'userpage') {
        this.routerExt.navigate([{
          outlets: { userpage: ['point'] },
        }], {
          relativeTo: this.aRoute.parent,
        });
      } else {
        this.rootLayout.closeModal();
      }
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  // TODO:
  onConfirm() {
    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

    console.log('from?', currentOutlet);

    // TODO:
    this.userService.createTransactions(this.pForm.value).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error('error status ->' , err);
      });

    this.transactionDone = true;

    if (currentOutlet == 'userpage') {
      this.routerExt.navigate([{
        outlets: { userpage: ['point'] },
      }], {
        relativeTo: this.aRoute.parent,
      });
    } else {
      this.rootLayout.closeModal();
    }
    // --

    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
    }, 30);
  }

  cancelConfirm() {
    this.routerExt.backToPreviousPage();
  }

  forceClose() {
    //
    this.snackBar.isShown = false;
  }
  // --
}
