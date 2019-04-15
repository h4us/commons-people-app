import { Injectable } from '@angular/core';

import { Observable, Subject, from, of, zip, interval, timer, Subscription } from 'rxjs';
import { toArray, switchMap, map, mergeAll, mergeMap, concatMap, concatAll, tap } from 'rxjs/operators';

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

  intervalSec: number = 10;

  constructor(
    private userService: UserService,
    private trayService: SystemTrayService,
  ) {
    const unreadTask = timer(this.intervalSec * 1000, this.intervalSec * 1000).pipe(
      switchMap(_ => this.userService.getUnreadMessages()),
    );

    const checkTopicsTask = timer(this.intervalSec * 1000, this.intervalSec * 1000).pipe(
      switchMap(_ => of(...this.userService.getCommunities()).pipe(
        concatMap((el) => this.userService.getTopics(el.id, '', { page:0, size:1, sort:'DESC' })),
        concatAll(),
        toArray()
      )),
      map((res: any) => res.map((el: any) => { return {
        communityId: el.communityId, title: el.title, createdAt: el.createdAt
      } })),
    );

    const checkWalletTask = timer(this.intervalSec * 1000, this.intervalSec * 1000).pipe(
      switchMap(_ => of(...this.userService.getCommunities()).pipe(
        concatMap((el) => this.userService.getTransactions(el.id, { page:0, size:1, sort:'DESC' })),
        concatAll(),
        toArray()
      )),
      map((res: any) => res.map((el: any) => { return {
        communityId: el.communityId, createdAt: el.createdAt
      } })),
    );

    const checkNewsTask = timer(this.intervalSec * 1000, this.intervalSec * 1000).pipe(
      switchMap(_ => of(...this.userService.getCommunities()).pipe(
        concatMap((el) => this.userService.getNewsUpdates(el.id)),
        concatAll(),
        toArray()
      )),
      // tap((res: any) => console.log(res))
      // map((res: any) => res.map((el: any) => { return {
      //   communityId: el.communityId, createdAt: el.createdAt
      // } })),
    );

    this.ticker = zip(
      unreadTask,
      checkTopicsTask,
      checkWalletTask,
      // checkNewsTask,
    );

    this.start();
  }

  start() {
    if (!this.tickerSubs || this.tickerSubs.closed) {
      this.tickerSubs = this.ticker.subscribe((res: any) => {
        // --
        // console.log(res);

        const uc = this.userService.getCommunities();

        const newTopic = res[1].map((el: any) => {
          const mc = uc.find((iel: any) => el.communityId == iel.id);
          return {
            communityId: el.communityId,
            hasUnread: mc && (new Date(el.createdAt).getTime() > new Date(mc.adLastViewTime).getTime())
          }
        });

        const newTransactions = res[2].map((el: any) => {
          const mc = uc.find((iel: any) => el.communityId == iel.id);
          return {
            communityId: el.communityId,
            hasUnread: mc && (new Date(el.createdAt).getTime() > new Date(mc.walletLastViewTime).getTime())
          }
        });

        this.trayService.notifyUpdates({
          message: res[0],
          topic: newTopic,
          point: newTransactions
        });
        // --
      });
    }
  }

  stop() {
    if (this.tickerSubs) {
      this.tickerSubs.unsubscribe();
    }
  }
}
