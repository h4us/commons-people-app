import { Injectable } from '@angular/core';

import { Observable, Subject, forkJoin, from, of, zip, interval, timer, Subscription } from 'rxjs';
import { distinct, switchMap, map, mergeAll, filter, tap } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';
import { SystemTrayService } from '../system-tray.service';

@Injectable({
  providedIn: UserpageModule
})
export class PeriodicTasksService {
  ticker: Observable<any>;

  tSubs: Subscription;
  tickerSubs: Subscription;

  constructor(
    private userServie: UserService,
    private trayService: SystemTrayService,
  ) {
    this.ticker = interval(10 * 1000).pipe(
      switchMap((n:number) => this.userServie.getUnreadMessages()),
      tap(() => {
        //

        //
      })
    );

    this.start();
  }

  start() {
    if (!this.tickerSubs || this.tickerSubs.closed) {
      this.tickerSubs = this.ticker.subscribe((res: any) => {
        this.trayService.unreadCount(res);
      });
    }
  }

  stop() {
    if (this.tickerSubs) {
      this.tickerSubs.unsubscribe();
    }
  }
}
