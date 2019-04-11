import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, of, from, timer } from 'rxjs';
import { tap } from "rxjs/operators";

import { RouterExtensions } from 'nativescript-angular/router';

import { UserService } from './user.service';

@Injectable(
  // {
  //   providedIn: 'root'
  // }
)
export class SystemTrayService {
  private errorReportSource = new Subject<any>();
  private requestFromUserSource = new Subject<any>();
  private notifyToUserSource = new Subject<any>();
  private trayPositionSource = new Subject<any>();
  private userpageLockSource = new Subject<boolean>();
  private navShowHideSource = new Subject<boolean>();
  private unreadMessagesSource = new Subject<any>();

  //
  errorReport$ = this.errorReportSource.asObservable();

  //
  requestFromUser$ = this.requestFromUserSource.asObservable();
  notifyToUser$ = this.notifyToUserSource.asObservable();

  //
  userpageLock$ = this.userpageLockSource.asObservable();
  navShowHide$ = this.navShowHideSource.asObservable();

  //
  unreadMessages$ = this.unreadMessagesSource.asObservable();

  //
  trayPosition$ = this.trayPositionSource.asObservable();
  lastMeasuredPosition: any;

  private _isLocked:boolean = false;
  private _isShown:boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private routerExt: RouterExtensions,
  ) {}

  //
  request(id:string, command: any, option?: any) {
    if (option) {
      this.requestFromUserSource.next([id, command, option]);
    } else {
      this.requestFromUserSource.next([id, command]);
    }
  }

  notify(id:string, command: any, option?: any) {
    if (option) {
      this.notifyToUserSource.next([id, command, option]);
    } else {
      this.notifyToUserSource.next([id, command]);
    }
  }

  showError(errType: any) {
    //
    console.log(
      '[reported error]',
      errType,
    );

    // TODO: modify / transform
    let errMessage = errType;

    // TODO: critcal error handling, variations
    if ((errMessage && errMessage.status) && (
      errMessage.status == 503 ||
        errMessage.status == 504
    )) {
      timer(5000).subscribe(_ => {
        this.userService.logout(false).subscribe(_ => {
          if (this.router.url == '/') this.routerExt.navigate(['signin'])
        });
      });
    }

    //
    if (this._isLocked) {
      timer(1000).pipe(
        tap(_ => this.unLockUserpageArea()),
      ).subscribe(_ => {
        this.errorReportSource.next(errMessage);
      })
    } else {
      this.errorReportSource.next(errMessage);
    }
  }

  //
  lockUserpageArea() {
    this._isLocked = true;
    this.userpageLockSource.next(true);
  }

  unLockUserpageArea() {
    this._isLocked = false;
    this.userpageLockSource.next(false);
  }

  //
  showNavigation() {
    this._isShown = true;
    this.navShowHideSource.next(true);
  }

  hideNavigation() {
    this._isShown = false;
    this.navShowHideSource.next(false);
  }

  unreadCount(data: any) {
    this.unreadMessagesSource.next(data);
  }

  //
  set trayPosition(p: any) {
    this.lastMeasuredPosition = p;
    this.trayPositionSource.next(p);
  }
}
