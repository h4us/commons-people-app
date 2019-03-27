import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

import { ListViewEventData } from 'nativescript-ui-listview';

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
        console.log(data);
        this.currentList = data;
      });
  }

  closeModal(layout: AbsoluteLayout | DockLayout) {
    layout.closeModal();
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;
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
    }
  }
}
