import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-topic-owner',
  templateUrl: './topic-owner.component.html',
  styleUrls: ['./topic-owner.component.scss']
})
export class TopicOwnerComponent implements OnInit {
  title: string = 'プロフィール';

  userId: number;
  referenceFrom: number;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private dParams: ModalDialogParams,
  ) {
    page.actionBarHidden = true;

    if (dParams.context) {
      this.userId = dParams.context.whois;
      this.referenceFrom = dParams.context.owned;
    }
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        topicowner: (['community', 'topic', 'owner', this.userId])
      }
    }], {
      relativeTo: this.aRoute,
      queryParams: {
        referenceFrom: this.referenceFrom
      }
    });
  }
}
