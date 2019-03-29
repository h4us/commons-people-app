import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { Subscription } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';

import { ListViewEventData } from 'nativescript-ui-listview';

import { UserService, User } from '../../../user.service';

@Component({
  selector: 'app-community-list-edit',
  templateUrl: './community-list-edit.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListEditComponent implements OnInit, OnDestroy {
  title: string = 'コミュニティの切り替え';
  currentList: any[];
  selected: number;
  selectedList: number[];
  user: User;
  mode: string = 'switch';

  constructor(
    private routerExt: RouterExtensions,
    private router: Router,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    if (this.router.url.indexOf('communityeditor:community/edit') > -1) {
      this.mode = 'edit';
      this.title = 'コミュニティを選ぶ';
      this.userService.searchCommunities().subscribe((data) => {
        //
        this.currentList = data;
      });
      this.selectedList = this.userService.getCommunities().map((el) => el.id);
    } else {
      this.currentList = this.userService.getCommunities();
      this.selected = this.userService.currentCommunityId;
    }
  }

  ngOnDestroy() {
  }

  cancelAction(tLayout?: DockLayout) {
    if ((this.mode == 'switch' || this.router.url.indexOf('/newuser') == 0)
        && tLayout) {
      tLayout.closeModal();
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  onItemTap(args: ListViewEventData) {
    const tItem = args.view.bindingContext;

    if (this.mode == 'switch') {
      this.selected = this.userService.switchCommunity(tItem.id);
      this.userService.updateRquest('refresh current community');
    } else {
      const idx = this.selectedList.indexOf(tItem.id);
      if (idx > -1) {
        this.selectedList.splice(idx, 1);
      } else {
        this.routerExt.navigate([{
          outlets: {
            communityeditor: ['community', 'preview', tItem.name]
          }
        }], { relativeTo: this.aRoute.parent });
      }
    }
  }

  switchMode() {
    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', 'edit']
      }
    }], { relativeTo: this.aRoute.parent });
  }
}
