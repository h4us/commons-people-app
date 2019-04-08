import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { isIOS } from 'tns-core-modules/platform';

import { Page } from 'tns-core-modules/ui/page';
import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';
import { PointValidatorService } from '../../point-validator.service';

import { SystemTrayService } from '../../../system-tray.service';

@Component({
  selector: 'app-point-sender-commit',
  templateUrl: './point-sender-commit.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderCommitComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = "ポイントを送る";

  sendToUser: any;
  tokens: string[];
  sendData: any;
  selectedToken: string;
  pForm: FormGroup;

  @ViewChild('forceNumKey') nkbd: ElementRef;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
    private pvService: PointValidatorService,
    private tService: SystemTrayService,
  ) {
    page.actionBarHidden = true;

    this.tokens = this.userService.getCommunities().map((el) => { return el.tokenSymbol });
  }

  ngOnInit() {
    this.pvService.resetData();
    this.pForm = this.pvService.sendForm;

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const cid = <number>params.cid;
        const uid = <number>params.id;

        //
        // this.currentCommunity = this.userService.getCommunity(cid);
        // TODO: strict default community, token
        this.sendData = {
          tokens: 0,
        }
        this.selectedToken = this.tokens[0];
        // --

        this.userService.getUserDetail(uid).subscribe((data: any) => {
          const cm: any = this.userService.getCommunityByToken(this.selectedToken);

          this.sendToUser = data;
          this.pForm.patchValue({
            communityId: cm.id,
            beneficiaryId: this.sendToUser.id,
            amount: 1
          });

          console.log(this.pForm.value, this.pForm.valid);
        });
      });

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.queryParams))
      .forEach((params) => {
        if (params.adId) {
          this.pForm.patchValue({
            adId: <number>params.adId
          });
        }
      });
  }

  ngAfterViewInit() {
    if (isIOS && this.nkbd) {
      this.nkbd.nativeElement.keyboardType = 11;
    }

    this.tService.request('snackbar', 'open');
  }

  ngOnDestroy() {
  }

  onCommitted(args) {
    const eObj = JSON.parse(args.object.editedObject);
    this.selectedToken = eObj['tokens'];

    const cm: any = this.userService.getCommunityByToken(this.selectedToken);
    this.pForm.patchValue({ communityId: cm.id });
  }

  onConfirm() {
    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

    console.log(this.pForm.value, this.pForm.valid);

    if (currentOutlet == 'pointsender') {
      outletParam[currentOutlet] = ['point', 'confirm', this.sendToUser.id];
    } else if (currentOutlet == 'topicowner') {
      outletParam[currentOutlet] = [
        'community', 'topic', 'owner', this.sendToUser.id, 'send-confirm'
      ];
    } else {
      outletParam[currentOutlet] = [
        'point', 'confirm', this.sendToUser.id
      ];
    }

    this.routerExt.navigate([{
      outlets: outletParam,
    }], {
      relativeTo: this.aRoute.parent,
      queryParams: {
        communityId: this.pForm.get('communityId').value,
        tokenSymbol: this.selectedToken,
        points: this.pForm.get('amount').value
      }
    });
  }
}
