import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { switchMap } from 'rxjs/operators';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService } from '../../../user.service';

@Component({
  selector: 'app-point-sender-select',
  templateUrl: './point-sender-select.component.html',
  styleUrls: ['./point-sender.component.scss']
})
export class PointSenderSelectComponent implements OnInit {
  title: string = "ポイントを送る";

  selected: number;
  currentList: any[] = [];
  isModal: boolean = false;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.userService.searchUsers(this.userService.currentCommunityId)
      .subscribe((data: any) => {
        this.currentList = data;
      });

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        this.selected = <number>params.id;
      });

    this.isModal = (this.aRoute.outlet != 'userpage');
  }

  closeAction(layout: AbsoluteLayout | DockLayout) {
    const currentOutlet = this.aRoute.outlet;

    if (currentOutlet == 'pointsender') {
      layout.closeModal();
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    // this.routerExt.navigate([{
    //   outlets: {
    //     // pointsender: ['point', 'send', this.selected, tItem.id]
    //     pointsender: ['point', 'send', tItem.id]
    //   }
    // }], { relativeTo: this.aRoute.parent });

    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

    if (currentOutlet == 'pointsender') {
      outletParam[currentOutlet] = ['point', 'send', tItem.id];
    } else {
      outletParam[currentOutlet] = [
        'point', 'send', tItem.id
      ];
    }

    this.routerExt.navigate([{
      outlets: outletParam,
    }], {
      relativeTo: this.aRoute.parent,
    });
  }
}
