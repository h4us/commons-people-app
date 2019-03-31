import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { Subscription } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ListViewEventData } from 'nativescript-ui-listview';
import { UserService, User } from '../../../user.service';

import { SnackbarLikeComponent } from '../../../shared/snackbar-like/snackbar-like.component';

@Component({
  selector: 'app-community-list-edit',
  templateUrl: './community-list-edit.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListEditComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = 'コミュニティの切り替え';
  currentList: any[];
  selected: number;
  selectedList: number[];
  user: User;
  mode: string = 'switch';

  @ViewChild('communityList') rootLayoutRef: ElementRef;
  @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  @ViewChild('snackBar') snackBar: SnackbarLikeComponent;
  rootLayout: AbsoluteLayout;
  ovBcPrev: GridLayout;
  anchor: StackLayout;

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

      if (this.selectedList.length > 0) {
        this.userService.draftCommunityIds = this.selectedList;
        this.userService.draftCommunities = this.userService.getCommunities();
      }
    } else if (this.router.url.indexOf('communityeditor:community/submit') > -1) {
      this.mode = 'submit';
      this.title = 'コミュニティを選ぶ';
      this.currentList = this.userService.draftCommunities;
      this.selectedList = this.userService.draftCommunityIds;
    } else {
      this.userService.draftCommunityIds = [];
      this.userService.draftCommunities = [];
      this.currentList = this.userService.getCommunities();
      this.selected = this.userService.currentCommunityId;
    }
  }

  ngAfterViewInit() {
    if (this.mode == 'submit') {
      this.ovBcPrev = <GridLayout>this.ovBcPrevRef.nativeElement;
      this.anchor = <StackLayout>this.anchorRef.nativeElement;
      this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;

      //
      setTimeout(() => {
        const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
        AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
      }, 100);
    }
  }

  ngOnDestroy() {
  }

  get draftIsChanged(): boolean {
    // return this.userService.draftCommunityIds.length > 0;
    return true;
  }

  inDraft(id: number): boolean {
    return this.userService.draftCommunityIds.indexOf(id) > -1;
  }

  cancelAction(tLayout?: DockLayout | AbsoluteLayout) {
    // if ((this.mode == 'switch' || this.router.url.indexOf('/newuser') == 0)
    if ((this.mode == 'switch')
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
    } else {
      // nothing to do
    }
  }

  switchMode() {
    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', 'edit']
      }
    }], { relativeTo: this.aRoute.parent });
  }

  confirmChange() {
    console.log(
      this.userService.draftCommunityIds,
      this.userService.draftCommunities
    );

    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', 'submit']
      }
    }], { relativeTo: this.aRoute.parent });
  }

  cancelSnackbar() {
    this.routerExt.backToPreviousPage();
  }

  submitChange() {
    //
    console.log(
      'submit to server',
      this.userService.draftCommunityIds,
      // this.userService.draftCommunities
    );

    this.userService.updateCommunities(this.userService.draftCommunityIds).subscribe((data) => {
      console.log('submitted', data);
      this.userService.parseUser(data);
      this.rootLayout.closeModal();
    });

  }
}
