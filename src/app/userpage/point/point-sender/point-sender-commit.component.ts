import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { switchMap } from 'rxjs/operators';

import { Page } from 'tns-core-modules/ui/page';
import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';

@Component({
  selector: 'app-point-sender-commit',
  templateUrl: './point-sender-commit.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderCommitComponent implements OnInit {
  title: string = "ポイントを送る";

  currentCommunity: any;
  sendToUser: any;
  tokens: string[];
  sendData: any;
  selectedToken: string;
  points: number = 1;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
  ) {
    page.actionBarHidden = true;

    this.tokens = this.userService.getCommnities().map((el) => { return el.tokenSymbol });
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        const cid = <number>params.cid;
        const uid = <number>params.id;

        this.currentCommunity = this.userService.getCommunity(cid);

        this.userService.getUserDetail(uid).subscribe((data: any) => {
          this.sendToUser = data;
        });

        // TODO: strict default community, token
        this.sendData = {
          tokens: 0,
        }
        this.selectedToken = this.tokens[0];
        // --
      });
  }

  onCommitted(args) {
    const eObj = JSON.parse(args.object.editedObject);
    this.selectedToken = eObj['tokens'];
  }

  toConfirm() {
    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

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
        communityId: this.currentCommunity.id,
        tokenSymbol: this.selectedToken,
        points: this.points
      }
    });
  }
}
