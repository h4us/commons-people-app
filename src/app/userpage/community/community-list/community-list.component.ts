import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit, OnDestroy {
  title: string = 'コミュニティの切り替え';

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', 'switch']
      }
    }], { relativeTo: this.aRoute });
  }

  ngOnDestroy() {
  }
}
