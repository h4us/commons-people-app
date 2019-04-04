import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserpageModule } from './userpage.module';

@Injectable({
  providedIn: UserpageModule
})
export class ModalProxyService {

  private requestModalSource = new Subject<any>();
  private switchBackSource = new Subject<any>();
  private userpageLockSource = new Subject<boolean>();

  requestModal$ = this.requestModalSource.asObservable();
  switchBack$ = this.switchBackSource.asObservable();

  constructor() { }

  request(msg: string, option?: any) {
    if (option) {
      this.requestModalSource.next([msg, option]);
    } else {
      this.requestModalSource.next(msg);
    }
  }

  switchBack(msg: string, option?: any) {
    if (option) {
      this.switchBackSource.next([msg, option]);
    } else {
      this.switchBackSource.next(msg);
    }
  }
}
