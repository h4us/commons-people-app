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

import { TrayService } from '../../../shared/tray.service';


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
  // @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  // @ViewChild('snackBar') snackBar: SnackbarLikeComponent;
  rootLayout: AbsoluteLayout;
  // ovBcPrev: FlexboxLayout;
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
    private trayService: TrayService,
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

    this.anchor = <StackLayout>this.anchorRef.nativeElement;
    this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;
  }

  ngAfterViewInit() {
    const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : '';
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
        const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : '';
        this.trayService.request(`snackbar/${currentOutlet}`, 'close' );
      }
    }
  }

  registerSnackbarActions() {
    const currentOutlet = this.aRoute.outlet != 'userpage' ?  this.aRoute.outlet : '';
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
    const outletParam = {};

    // TODO:
    this.userService.createTransactions(this.pForm.value).subscribe(
      (res) => {
        console.log(res);

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

      },
      (err) => {
        console.error('error status ->' , err);

        if(this.tNotifySubscription && this.aRoute.outlet == 'userpage') {
          this.tNotifySubscription.unsubscribe();

          this.transactionDone = true;
          this.trayService.request('snackbar/', 'close')

          setTimeout(() => {
            this.trayService.request('snackbar/', 'open', {
              isApproved: true,
              step: 1,
              doneMessage: 'ポイントを送信しました (ダミ―メッセージ)'
            });

            this.routerExt.navigate([{
              outlets: { userpage: ['point'] },
            }], {
              relativeTo: this.aRoute.parent,
            });
          }, 600);
        } else {
          this.transactionDone = true;
          this.trayService.request(`snackbar/${currentOutlet}`, 'close');
          setTimeout(() => {
            this.rootLayout.closeModal({
              snackbarRedirect: {
                id: 'snackbar/',
                doneMessage: 'ポイントを送信しました'
              }
            });
          }, 600);
        }
      });
    // --
  }

  cancelConfirm() {
    this.routerExt.backToPreviousPage();
  }

  forceClose() {
  }
  // --
}
