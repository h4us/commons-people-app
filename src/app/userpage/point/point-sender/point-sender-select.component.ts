import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { Subject, from, timer } from 'rxjs';
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
  selectionState: string = 'default';
  constraintUserNames: string = '';
  currentQueryParams: any;
  loadingRetired: boolean = false;

  private userSubject = new Subject<any>();

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

    from(this.userSubject).pipe(
      switchMap((data: any) => {
        this.currentQueryParams = Object.assign(this.currentQueryParams, data);
        return this.userService.searchUsers(data);
      })
    ).subscribe((data: any) => {
      // --
      let _data: any = data.userList;
      if (this.constraintUserNames && this.constraintUserNames != '') {
        _data = _data.filter((el:any) => this.constraintUserNames.split(',').find((iel:string) => iel == el.username));
        delete this.currentQueryParams.pagination;
      }
      // --

      if (this.currentList.length == 0) {
        this.currentList = _data;
      } else {
        _data = _data.filter((el: any) => this.currentList.find((iel: any) => iel.id != el.id));
        this.currentList = this.currentList.concat(_data);
      }

      if (data && data.pagination && !(this.constraintUserNames && this.constraintUserNames != '')) {
        this.currentQueryParams = Object.assign(this.currentQueryParams, { pagination: data.pagination });
      }

      timer(3000).subscribe(_ => this.loadingRetired = true);
    });

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        this.selected = <number>params.id;
      });

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.queryParams))
      .forEach((params) => {
        this.constraintUserNames = <string>params.userNameFilter;
        this.selected = <number>params.communityFilter || this.selected;
      });

    this.currentQueryParams = {
      communityId: this.selected || this.userService.currentCommunityId,
      query: this.constraintUserNames && this.constraintUserNames != '' ? this.constraintUserNames : '',
      pagination: { page: 0, size: 10, sort: 'ASC' }
    }

    if (this.aRoute.snapshot.url.filter((el) => el.path == 'search').length > 0) {
      this.selectionState = 'search';
    } else {
      this.userSubject.next(this.currentQueryParams);
    }

    this.isModal = (this.aRoute.outlet != 'userpage');
  }

  closeAction(layout?: AbsoluteLayout | DockLayout) {
    const currentOutlet = this.aRoute.outlet;

    if (currentOutlet == 'pointsender') {
      layout.closeModal();
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  searchAction(e?: any) {
    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

    if (this.selectionState == 'default') {
      if (currentOutlet == 'pointsender') {
        outletParam[currentOutlet] = ['point', 'search'];
      } else {
        outletParam[currentOutlet] = [
          'point', 'search'
        ];
      }
      this.routerExt.navigate([{
        outlets: outletParam,
      }], {
        relativeTo: this.aRoute.parent,
        transition: { name: 'fade', duration: 150 },
        queryParams: { userNameFilter: this.constraintUserNames, communityFilter: this.selected }
      });
    } else {
      if (e && e.search) {
        this.currentList = [];
        this.loadingRetired = false;

        this.userSubject.next({
          communityId: this.selected || this.userService.currentCommunityId,
          query: encodeURI(e.search),
          pagination: { page: 0, size: 10, sort: 'ASC' }
        });
      }
    }
  }

  onItemTap(tItem: any) {
    const currentOutlet = this.aRoute.outlet;
    const outletParam = {};

    // if (currentOutlet == 'pointsender') {
    //   outletParam[currentOutlet] = ['point', 'send', tItem.id];
    // } else {
    //   outletParam[currentOutlet] = [
    //     'point', 'send', tItem.id
    //   ];
    // }

    outletParam[currentOutlet] = ['point', 'send', tItem.id];

    this.routerExt.navigate([{
      outlets: outletParam,
    }], {
      relativeTo: this.aRoute.parent,
    });
  }

  moreResult() {
    const nextPageParams: any = Object.assign({}, this.currentQueryParams);
    nextPageParams.pagination.page = nextPageParams.pagination.page + 1;
    this.userSubject.next(nextPageParams);
  }
}
