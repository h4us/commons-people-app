import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Subscription, fromEvent } from 'rxjs';
import { switchMap, take, delay } from 'rxjs/operators'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { screen, isIOS } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';

import { UserService } from '../../user.service';
import { SystemTrayService } from '../../system-tray.service';

import { CommunityListComponent } from '../community/community-list/community-list.component';

import { environment } from '~/environments/environment';

@Component({
  selector: 'app-newbie',
  templateUrl: './newbie.component.html',
  styleUrls: ['./newbie.component.scss']
})
export class NewbieComponent implements OnInit, OnDestroy {

  @ViewChild('newbieRoot') uRoot: ElementRef;

  mSubscription: Subscription;

  isProd: boolean = environment.production;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private modalService: ModalDialogService,
    private userService: UserService,
    private trayService: SystemTrayService,
    private page: Page,
    private vcRef: ViewContainerRef,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    fromEvent(this.uRoot.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      if (isIOS) {
        let safeAreaSpan: number = 0;
        if (application.ios.window.safeAreaInsets) {
          safeAreaSpan = <number>application.ios.window.safeAreaInsets.top + <number>application.ios.window.safeAreaInsets.bottom;
        }
        this.trayService.trayPosition = screen.mainScreen.heightDIPs - (safeAreaSpan);
      } else {
        const aH = this.uRoot.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;
        this.trayService.trayPosition = aH;
      }
    });
  }

  ngOnDestroy() {

  }

  goNext() {
    const options: ModalDialogOptions = {
      fullscreen: true,
      viewContainerRef: this.vcRef,
      context: {
        forNewbie: true
      }
    };

    this.modalService.showModal(CommunityListComponent, options)
      .then(() => {
        if (this.userService.getCommunities().length > 0) {
          setTimeout(() => {
            this.routerExt.navigate([ 'user' ], {
              clearHistory: true,
              transition: { name: 'fade', duration: 300 }
            })
          }, 500);
        }
      });
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
