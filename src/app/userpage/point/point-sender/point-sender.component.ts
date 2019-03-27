import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  }

  ngOnInit() {
    console.log(`TODO: selecting destination by ${this.srcCommunityId} / ${this.destUserId}` );
    //
    const _dest = ['point', 'select', this.srcCommunityId ];

    //
    this.routerExt.navigate([{
      outlets: {
        pointsender: _dest
      }
    }], { relativeTo: this.aRoute });
  }

  ngOnDestroy() {
  }
}
