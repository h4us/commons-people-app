import { Component, OnInit } from '@angular/core';

import { Observable, from } from 'rxjs';
import { distinct, toArray } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

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

  isSearchMode: boolean = false;

  constructor(
    private page: Page,
    private router: Router,
    private aRoute: ActivatedRoute,
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
    if (this.selected.length === 1) {
      this.userService.tapDirectMessageThread(this.selected[0]).subscribe((data: any) => {
        layout.closeModal({
          willCreate: data.id
        });
      });
    } else if (this.selected.length > 1) {
      //
      let names: any[] = this.selected.map((id: number) => this.currentList.find((el: any) => el.id == id));
      names.push(this.userService.getCurrentUser());
      names = names.map((el: any) => el.username);

      //
      this.userService.createGroupMessageThread({
        title: names.join(),
        communityId: this.userService.currentCommunityId,
        memberIds: this.selected
      }).subscribe((data: any) => {
        layout.closeModal({
          willCreate: data.id
        });
      });
    }
  }

  switchMode() {
    this.isSearchMode = !this.isSearchMode;
  }

  searchAction(e: any) {
    this.userService.searchUsers(this.userService.currentCommunityId, e.search)
      .subscribe((data: any) => {
        this.currentList = data;
      });
    // console.log(e);
  }
}
