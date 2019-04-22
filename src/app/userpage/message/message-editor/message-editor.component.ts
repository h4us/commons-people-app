import { Component, OnInit } from '@angular/core';

import { Observable, Subject, from } from 'rxjs';
import { distinct, toArray, switchMap } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { UserService } from '../../../user.service';

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent implements OnInit {
  title: string = "メンバーを選択";

  selected: number[] = [];
  currentList: any[] = [];
  ignore: number[] = [];
  inCommunity: number = -1;
  currentCommunity: number = -1; //! alias

  isSearchMode: boolean = false;
  editorContext: string = 'new';

  currentQueryParams: any;
  private userSubject = new Subject<any>();

  constructor(
    private page: Page,
    private router: Router,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
    private userService: UserService,
    private dParams: ModalDialogParams,
  ) {
    page.actionBarHidden = true;

    if (dParams.context && dParams.context.ignore) {
      this.ignore = dParams.context.ignore.map((el) => el.id);
    }
    if (dParams.context && dParams.context.inCommunity) {
      this.inCommunity = dParams.context.inCommunity;
      this.currentCommunity = dParams.context.inCommunity;
    }
    if (dParams.context && dParams.context.editorContext) {
      this.editorContext = dParams.context.editorContext;
    }
  }

  ngOnInit() {

    from(this.userSubject).pipe(
      switchMap((data: any) => {
        this.currentQueryParams = Object.assign(this.currentQueryParams, data);
        return this.userService.searchUsers(data);
      })
    ).subscribe((data: any) => {
      if (this.currentList.length == 0) {
        this.currentList = data.userList;
      } else {
        const _data: any = data.userList.filter((el: any) => this.currentList.find((iel: any) => iel.id != el.id));
        this.currentList = this.currentList.concat(_data);
      }

      if (data && data.pagination) {
        this.currentQueryParams = Object.assign(this.currentQueryParams, { pagination: data.pagination });
      }

      // timer(3000).subscribe(_ => this.loadingRetired = true);
    });

    this.currentQueryParams = {
      communityId: this.inCommunity > -1 ?  this.inCommunity : this.userService.currentCommunityId,
      pagination: { page: 0, size: 10, sort: 'ASC' }
    }

    this.userSubject.next(this.currentQueryParams);
  }

  closeModal(layout: AbsoluteLayout | DockLayout) {
    layout.closeModal();
  }

  onItemTap(tItem: any) {
      const hasItem = this.selected.indexOf(tItem.id);
    if (hasItem > -1) {
      this.selected.splice(hasItem, 1);
    } else {
      this.selected.push(tItem.id);
    }
  }

  ok(layout: AbsoluteLayout | DockLayout) {
    if (this.editorContext == 'new') {
      if (this.selected.length === 1) {
        const u: any = this.currentList.find((el: any) => el.id == this.selected[0]);

        // TODO: which one is better?
        this.userService.tapDirectMessageThread(this.selected[0], this.inCommunity).subscribe((data: any) => {
          layout.closeModal({
            willCreate: data.id,
            defaultTitle: u.username
          });
        });
        //
        // this.userService.createGroupMessageThread({
        //   title: u.username,
        //   communityId: (this.inCommunity > -1 ?  this.inCommunity : this.userService.currentCommunityId),
        //   memberIds: this.selected
        // }).subscribe((data: any) => {
        //   layout.closeModal({
        //     willCreate: data.id
        //   });
        // });
      } else if (this.selected.length > 1) {
        //
        let names: any[] = this.selected.map((id: number) => this.currentList.find((el: any) => el.id == id));
        names.push(this.userService.getCurrentUser());
        names = names.map((el: any) => el.username);

        this.userService.createGroupMessageThread({
          title: names.join(),
          communityId: (this.inCommunity > -1 ?  this.inCommunity : this.userService.currentCommunityId),
          memberIds: this.selected
        }).subscribe((data: any) => {
          layout.closeModal({
            willCreate: data.id
          });
        });
      }
    } else {
      layout.closeModal({ willAdd: this.selected });
    }
  }

  switchMode() {
    this.isSearchMode = !this.isSearchMode;
  }

  searchAction(e: any) {
    if (e && e.search) {
      this.currentList = [];
      // this.loadingRetired = false;

      this.userSubject.next({
        communityId: this.inCommunity > -1 ?  this.inCommunity : this.userService.currentCommunityId,
        query: encodeURI(e.search),
        pagination: { page: 0, size: 10, sort: 'ASC' }
      });
    }
  }

  moreResult() {
    const nextPageParams: any = Object.assign({}, this.currentQueryParams);
    nextPageParams.pagination.page = nextPageParams.pagination.page + 1;
    this.userSubject.next(nextPageParams);
  }
}
