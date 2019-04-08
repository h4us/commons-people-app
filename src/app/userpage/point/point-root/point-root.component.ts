import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';

@Component({
  selector: 'app-point-root',
  templateUrl: './point-root.component.html',
  styleUrls: ['./point-root.component.scss']
})
export class PointRootComponent implements OnInit {
  //
  currentList: any[];
  balanceList: any[];
  user: User;
  allZero: boolean = true;

  constructor(
    private router: RouterExtensions,
    private userService: UserService,
    private aRoute: ActivatedRoute,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.currentList = this.userService.getCommunities();
    this.user = this.userService.getCurrentUser();
    this.balanceList = this.user.balanceList;

    if (this.user.balanceList && this.user.balanceList.length > 0) {
      this.allZero = this.user.balanceList.every((el) => el.balance == 0);
    }
  }

  getBalanceFromCommunityId(id: number): number {
    const bl: any  = this.balanceList.find((el) => el.communityId == id);
    return bl ? bl.balance : 0;
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;
    this.router.navigate(['../point/log', tItem.id], {
      relativeTo: this.aRoute
    });
  }

  gotoCommunity() {
    this.router.navigate(['../community'], {
      relativeTo: this.aRoute,
      transition: { name: 'fade', duration: 150 },
    });
  }

  giveMePoint() {
    // this.router.navigate(['../community'], {
    //   relativeTo: this.aRoute
    // });
  }
}
