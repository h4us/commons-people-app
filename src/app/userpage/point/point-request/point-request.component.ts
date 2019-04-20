import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { from, of } from 'rxjs';
import { mergeMap, concatMap, toArray, switchMap } from 'rxjs/operators';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';

import { UserService } from '../../../user.service';

@Component({
  selector: 'app-point-request',
  templateUrl: './point-request.component.html',
  styleUrls: ['./point-request.component.scss']
})
export class PointRequestComponent implements OnInit {

  title: string = "オーナーを選ぶ";

  currentCommunities: any[] = [];
  currentList: any[] = [];

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
    this.currentCommunities = this.userService.getCommunities()

    from(this.currentCommunities).pipe(
      concatMap((el: any) => this.userService.getUserDetail(el.adminUserId)),
      toArray()
    ).subscribe((res: any) => {
      this.currentList = res;
    });
  }

  onTap(id: number, communityId?: number) {
    this.userService.tapDirectMessageThread(id, communityId).subscribe((data: any) => {
      this.routerExt.navigate([{
        outlets: { userpage: ['message', 'log', data.id] }
      }], {
        relativeTo: this.aRoute.parent
      });
    });
  }
}
