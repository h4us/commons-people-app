import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../../user.service';
import { PointValidatorService } from '../../point-validator.service';

// import { SnackbarLikeComponent } from '../../../shared/snackbar-like/snackbar-like.component';

import { SystemTrayService } from '../../../system-tray.service';


@Component({
  selector: 'app-point-sender-confirm',
  templateUrl: './point-sender-confirm.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderConfirmComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = "ポイントを送る";

  currentCommunity: any;
  sendToUser: any;
  tokenSymbol: string = '';
  points: number = 0;

  pForm: FormGroup;
  transactionDone: boolean = false;

  @ViewChild('pointSenderConfirm') rootLayoutRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  rootLayout: AbsoluteLayout;
  ovBcPrev: GridLayout;
  anchor: StackLayout;

  tNotifySubscription: Subscription;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
    private pvService: PointValidatorService,
    private trayService: SystemTrayService,
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

    this.anchor = <StackLayout>this.anchorRef.nativeElement;
    this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;
  }

  ngAfterViewInit() {
    const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : 'pointsenderAtUserpage';

    this.registerSnackbarActions();
    this.trayService.request(`snackbar/${currentOutlet}`, 'open', {
      doneMessage: '送信しています..',
      cancelAsClose: false
    });
  }

  ngOnDestroy() {
    if(this.tNotifySubscription) {
      this.tNotifySubscription.unsubscribe();

      if (this.transactionDone) {
        // this.trayService.request('snackbar/', 'open', {
        //   isApproved: true,
        //   step: 1,
        //   doneMessage: 'ポイントを送信しました'
        // });
      } else {
        const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : 'pointsenderAtUserpage';
        this.trayService.request(`snackbar/${currentOutlet}`, 'close' );
      }
    }
  }

  registerSnackbarActions() {
    const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : 'pointsenderAtUserpage';
    this.tNotifySubscription = this.trayService.notifyToUser$
      .subscribe((data: any) => {
        if (data[0] == `snackbar/${currentOutlet}`) {
          switch (data[1]) {
            case 'approveOrNext':
              this.onConfirm();
              break;
            case 'cancelOrBack':
              this.cancelAction();
              break;
            default:
              break;
          }
        }
      });
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

    const pt = Object.assign({} , this.pForm.value);
    pt.amount = parseInt(pt.amount);
    pt.description = `送金完了`;
    if (pt.adId == null) {
      delete pt.adId;
    } else {
      pt.adId = parseInt(pt.adId);
    }

    console.log('send transaction: data -> ', pt);

    this.userService.createTransactions(pt).subscribe(_ => {
        this.transactionDone = true;
        this.trayService.request(`snackbar/${(currentOutlet == 'userpage') ? '' : currentOutlet}`, 'close')

        setTimeout(() => {
          if (currentOutlet == 'userpage') {
            this.routerExt.navigate([{
              outlets: { userpage: ['point'] },
            }], {
              relativeTo: this.aRoute.parent,
            });
          } else {
            this.rootLayout.closeModal();
          }
        }, 600);
    }, (err) => this.trayService.showError(err));
  }

  cancelConfirm() {
    this.routerExt.backToPreviousPage();
  }

  forceClose() {
  }
  // --
}
