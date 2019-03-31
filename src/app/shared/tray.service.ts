import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SharedModule } from './shared.module';

@Injectable({
  providedIn: SharedModule
})
export class TrayService {
  private requestFromUserSource = new Subject<any>();
  private notifyToUserSource = new Subject<any>();
  private trayPositionSource = new Subject<any>();

  // private commandLog: any[] = [];

  requestFromUser$ = this.requestFromUserSource.asObservable();
  notifyToUser$ = this.notifyToUserSource.asObservable();
  trayPosition$ = this.trayPositionSource.asObservable();

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

  set trayPosition(p: any) {
    this.lastMeasuredPosition = p;
    this.trayPositionSource.next(p);
  }
}
