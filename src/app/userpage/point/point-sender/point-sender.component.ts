import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogParams, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'app-point-sender',
  templateUrl: './point-sender.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderComponent implements OnInit {
  title: string = "ポイントを送る";
  srcCommunityId: number;
  destUserId: number;
  constrainUsers: any[] = [];

  constructor(
    private page: Page,
    private pageRoute: PageRoute,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
    private dParams: ModalDialogParams,
  ) {
    page.actionBarHidden = true;

    // w/ modal action
    if (dParams.context && dParams.context.communityId) {
      this.srcCommunityId = dParams.context.communityId;
    }
    if (dParams.context && dParams.context.userId) {
      this.destUserId = dParams.context.userId;
    }
    if (dParams.context && dParams.context.constrainUsers) {
      this.constrainUsers = dParams.context.constrainUsers;
    }
  }

  ngOnInit() {
    // 1. default
    let dest = ['point', 'select', this.srcCommunityId ];
    let routerOptions: any = {
      relativeTo: this.aRoute,
    }

    if (this.constrainUsers && this.constrainUsers.length == 1) {
      // 2. skip selection
      dest = ['point', 'send', this.constrainUsers[0].id];
      routerOptions.queryParams = {
        isModal: true
      }
    } else if (this.constrainUsers && this.constrainUsers.length > 1) {
      // 3. filterd specific users
      routerOptions.queryParams = {
        userNameFilter: this.constrainUsers.map((el:any) => el.username).join(',')
      }
    }

    this.routerExt.navigate([{
      outlets: {
        pointsender: dest
      }
    }], routerOptions);

  }

  ngOnDestroy() {
  }
}
