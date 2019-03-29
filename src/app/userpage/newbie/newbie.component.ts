import { Component, OnInit, AfterViewInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Subscription } from 'rxjs';
// import { switchMap, mergeMap } from 'rxjs/operators'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { UserService } from '../../user.service';

import { CommunityListComponent } from '../community/community-list/community-list.component';

@Component({
  selector: 'app-newbie',
  templateUrl: './newbie.component.html',
  styleUrls: ['./newbie.component.scss']
})
export class NewbieComponent implements OnInit, OnDestroy {

  mSubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private modalService: ModalDialogService,
    private userService: UserService,
    private page: Page,
    private vcRef: ViewContainerRef,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  goNext() {
    // TODO:
    const options: ModalDialogOptions = {
      fullscreen: true,
      viewContainerRef: this.vcRef,
      context: {
        forNewbie: true
      }
    };
    this.modalService.showModal(CommunityListComponent, options);

    // this.routerExt.navigate([ 'user' ], {
    //   clearHistory: true,
    //   transition: { name: 'fade', duration: 300 }
    // })
  }

  logout () {
    this.userService.logout().subscribe(
      (data: any) => {
        console.log('logout..', data);
      },
      (err) => {
        console.error(err, '..force logout');
        this.routerExt.navigate([''], {
          clearHistory: true
        });
      },
      () => this.routerExt.navigate([''], {
        clearHistory: true
      })
    );
  }

}
