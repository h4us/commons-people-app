import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { switchMap } from 'rxjs/operators';

import { Page } from 'tns-core-modules/ui/page';
import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';
import { PointValidatorService } from '../../point-validator.service';

@Component({
  selector: 'app-point-sender-commit',
  templateUrl: './point-sender-commit.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderCommitComponent implements OnInit {
  title: string = "ポイントを送る";

  sendToUser: any;
  tokens: string[];
  sendData: any;
  selectedToken: string;
  // points: number = 1;
  pForm: FormGroup;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
    private pvService: PointValidatorService,
  ) {
    page.actionBarHidden = true;

    this.tokens = this.userService.getCommnities().map((el) => { return el.tokenSymbol });

    pvService.resetData();
    this.pForm = pvService.sendForm;
  }

  ngOnInit() {
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
          this.sendToUser = data;
          this.pForm.patchValue({ beneficiaryId: this.sendToUser.id });
          const cm: any = this.userService.getCommunityByToken(this.selectedToken);
          this.pForm.patchValue({
            communityId: cm.id,
            beneficiaryId: this.sendToUser.id,
            amount: 1
          });

          console.log(this.pForm.value, this.pForm.valid);
        });
      });
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
