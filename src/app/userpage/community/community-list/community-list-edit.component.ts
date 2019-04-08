import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { UserService, User } from '../../../user.service';

import { SystemTrayService } from '../../../system-tray.service';

@Component({
  selector: 'app-community-list-edit',
  templateUrl: './community-list-edit.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListEditComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = 'コミュニティの切り替え';
  currentList: any[];
  selected: number;
  draft: number;
  selectedList: number[];
  user: User;
  mode: string = 'switch';
  isSearchMode: boolean = false;

  @ViewChild('communityList') rootLayoutRef: ElementRef;

  tNotifySubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private router: Router,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private page: Page,
    private trayService: SystemTrayService
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

      if (this.selectedList.length > 0) {
        this.userService.draftCommunityIds = this.selectedList.slice();
        this.userService.draftCommunities = this.userService.getCommunities();
      }
    } else if (this.router.url.indexOf('communityeditor:community/submit') > -1) {
      this.mode = 'submit';
      this.title = 'コミュニティを選ぶ';
      this.currentList = this.userService.draftCommunities;
      this.selectedList = this.userService.draftCommunityIds;

      this.registerSnackbarActions();
    } else {
      this.userService.draftCommunityIds = [];
      this.userService.draftCommunities = [];
      this.currentList = this.userService.getCommunities();
      this.selected = this.userService.currentCommunityId;
      this.draft = this.userService.currentCommunityId;
    }
  }

  ngAfterViewInit() {
    if (this.mode == 'submit') {
      this.trayService.request('snackbar/communityeditor', 'open', {
        doneMessage: '送信しています..',
        cancelAsClose: false
      });
    }
  }

  ngOnDestroy() {
    if (this.tNotifySubscription) {
      this.tNotifySubscription.unsubscribe();
    }
  }

  registerSnackbarActions() {
    this.tNotifySubscription = this.trayService.notifyToUser$
      .subscribe((data: any) => {
        if (data[0] == 'snackbar/communityeditor') {
          switch (data[1]) {
            case 'approveOrNext':
              this.submitChange();
              break;
            case 'cancelOrBack':
              this.cancelAction();
              break;
            default:
              break;
          }
        }
      });
  }

  get draftIsChanged(): boolean {
    //! simple but not strict
    // return this.userService.draftCommunityIds.toString() != this.selectedList.toString();

    //! more strict
    return this.userService.draftCommunityIds.filter((el) => !this.selectedList.includes(el)).length > 0 ||
      this.userService.draftCommunityIds.length != this.selectedList.length;
  }

  inDraft(id: number): boolean {
    return this.userService.draftCommunityIds.indexOf(id) > -1;
  }

  cancelAction(tLayout?: DockLayout | AbsoluteLayout) {
    if (this.mode == 'submit') {
      this.trayService.request('snackbar/communityeditor', 'close');
    }

    // if ((this.mode == 'switch' || this.router.url.indexOf('/newuser') == 0)
    if ((this.mode == 'switch')
        && tLayout) {
      tLayout.closeModal();
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  onItemTap(tItem: any) {
    if (this.mode == 'switch') {
      this.draft = tItem.id;
    } else if (this.mode == 'edit') {
      const idx = this.selectedList.indexOf(tItem.id);
      if (idx > -1) {
        // -- community is removbale ?
        // this.selectedList.splice(idx, 1);
        // --
      } else {
        // this.routerExt.navigate([{
        //   outlets: {
        //     communityeditor: ['community', 'preview', tItem.name]
        //   }
        // }], { relativeTo: this.aRoute.parent });
      }
      this.routerExt.navigate([{
        outlets: {
          communityeditor: ['community', 'preview', tItem.name]
        }
      }], { relativeTo: this.aRoute.parent });
    }
  }

  switchModeOrSubmitChange() {
    if (this.draft != this.selected) {
      this.userService.switchCommunity(this.draft);
      this.userService.updateRquest('refresh current community');
      this.trayService.request('snackbar/', 'open', {
        doneMessage: 'コミュニティを変更しました',
        step: 1,
        isApproved: true
      });
      this.rootLayoutRef.nativeElement.closeModal();
    } else {
      this.routerExt.navigate([{
        outlets: {
          communityeditor: ['community', 'edit']
        }
      }], { relativeTo: this.aRoute.parent });
    }
  }

  searchMode() {
    this.isSearchMode = !this.isSearchMode;
  }

  searchAction(e: any) {
    console.log(e);
    this.userService.searchCommunities(e.search).subscribe((data: any) => {
      this.currentList = data;
    });
  }

  confirmChange() {
    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', 'submit']
      }
    }], { relativeTo: this.aRoute.parent });
  }

  submitChange() {
    //
    // console.log(
    //   'submit to server',
    //   this.userService.draftCommunityIds,
    //   // this.userService.draftCommunities
    // );

    this.userService.updateCommunities(this.userService.draftCommunityIds).subscribe((data: any) => {
      // --
      this.userService.parseUser(data);
      // --
      this.rootLayoutRef.nativeElement.closeModal();
    });

  }
}
