import { Injectable } from '@angular/core';

import { Observable, Subject, forkJoin, from, of, zip, interval, timer, Subscription } from 'rxjs';
import { distinct, switchMap, map, mergeAll, filter, tap } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class PeriodicTasksService {
  ticker: Observable<any>;
  tSubs: Subscription;

  constructor(
    private userServie: UserService
  ) {
    this.ticker = interval(20 * 1000).pipe(
      switchMap((n:number) => this.userServie.getUnreadMessages()),
      tap(() => {
        //
        console.log('periodic service says:', new Date())
        //
      }),
      map((res: any) => console.log('unread count ?', res))
    );

    this.start();
  }

  start() {
    if (!this.tSubs || this.tSubs.closed) {
      this.tSubs = this.ticker.subscribe();
    }
  }

  stop() {
    if (this.tSubs) {
      this.tSubs.unsubscribe();
    }
  }
}
