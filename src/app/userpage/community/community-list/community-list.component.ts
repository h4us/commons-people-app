import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogParams, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit, OnDestroy {
  title: string = 'コミュニティの切り替え';
  addOnly: boolean = false;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
    private dParams: ModalDialogParams,
  ) {
    page.actionBarHidden = true;

    // w/ modal action
    if (dParams.context && dParams.context.forNewbie) {
      this.addOnly = dParams.context.forNewbie;
    }
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', (this.addOnly ? 'edit' : 'switch')]
      }
    }], { relativeTo: this.aRoute });
  }

  ngOnDestroy() {
  }
}
