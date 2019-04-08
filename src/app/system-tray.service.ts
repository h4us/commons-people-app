import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, Subject, of, from, timer } from 'rxjs';
import { tap, delay } from "rxjs/operators";

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

  //
  errorReport$ = this.errorReportSource.asObservable();

  //
  requestFromUser$ = this.requestFromUserSource.asObservable();
  notifyToUser$ = this.notifyToUserSource.asObservable();

  //
  userpageLock$ = this.userpageLockSource.asObservable();
  navShowHide$ = this.navShowHideSource.asObservable();

  //
  trayPosition$ = this.trayPositionSource.asObservable();
  lastMeasuredPosition: any;

  private _isLocked:boolean = false;
  private _isShown:boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
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
    console.log(
      '[reported error]',
      errType,
      // this.router.url,
      // this.router.routerState.root,
      // this.router.routerState.root.component,
      // this.router.routerState.root.children
    );

    // TODO: modify / transform
    let errMessage = errType;

    //
    if (this._isLocked) {
      timer(1000).pipe(
        tap(_ => this.unLockUserpageArea()),
      ).subscribe(_ => {
        console.log('report!');
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

  //
  set trayPosition(p: any) {
    this.lastMeasuredPosition = p;
    this.trayPositionSource.next(p);
  }
}
