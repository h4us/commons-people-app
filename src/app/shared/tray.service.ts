import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SharedModule } from './shared.module';

@Injectable({
  // providedIn: SharedModule
  providedIn: 'root'
})
export class TrayService {
  private requestFromUserSource = new Subject<any>();
  private notifyToUserSource = new Subject<any>();
  private trayPositionSource = new Subject<any>();
  private userpageLockSource = new Subject<boolean>();
  private navShowHideSource = new Subject<boolean>();

  // private commandLog: any[] = [];

  requestFromUser$ = this.requestFromUserSource.asObservable();
  notifyToUser$ = this.notifyToUserSource.asObservable();
  trayPosition$ = this.trayPositionSource.asObservable();

  userpageLock$ = this.userpageLockSource.asObservable();
  navShowHide$ = this.navShowHideSource.asObservable();

  lastMeasuredPosition: any;

  constructor() { }

  request(id:string, command: any, option?: any) {
    if (option) {
      this.requestFromUserSource.next([id, command, option]);
    } else {
      this.requestFromUserSource.next([id, command]);
    }

    // this.commandLog.push({
    //   id,
    //   command,
    //   option: option || {}
    // });
    // console.log(this.commandLog);
  }

  notify(id:string, command: any, option?: any) {
    if (option) {
      this.notifyToUserSource.next([id, command, option]);
    } else {
      this.notifyToUserSource.next([id, command]);
    }
  }

  lockUserpageArea() {
    this.userpageLockSource.next(true);
  }

  unLockUserpageArea() {
    this.userpageLockSource.next(false);
  }

  showNavigation() {
    this.navShowHideSource.next(true);
  }

  hideNavigation() {
    this.navShowHideSource.next(false);
  }

  set trayPosition(p: any) {
    this.lastMeasuredPosition = p;
    this.trayPositionSource.next(p);
  }
}
