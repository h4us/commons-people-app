import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { distinct, map, mergeAll, filter } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class MessageProxyService {

  private messagesSource = new Subject<any>();
  private threadsSource = new Subject<any>();
  private _activeThreads: any;
  private _currentThreadId: number = -1;
  private _incommingMessage: any;

  incommingMessage$ = this.messagesSource.asObservable();
  activeThreads$ = this.threadsSource.asObservable();

  constructor(private userService: UserService) {}

  get activeThreads() {
    return this._activeThreads;
  }

  get incommingMessage() {
    return this._incommingMessage;
  }

  fetchThreads(targetCommunity?: number) {
    let source: Observable<any>;
    if (targetCommunity) {
      // TODO:
      source = this.userService.getMessageThreads().pipe(
        map((el: any) => {
          return el.filter((iel) => iel.communityId == targetCommunity)
          // return el.filter((iel) => (iel.communityId == targetCommunity) || (typeof iel.ad == 'undefined' && !iel.group))
        })
      );
    } else {
      source = this.userService.getMessageThreads();
    }

    source.subscribe(
      (data) => {
        this._activeThreads = data;
        this.threadsSource.next(data);
      },
      (err) => console.error(err)
    );
  }

  searchThreads(input: any, targetCommunity?: number) {
    let source: Observable<any>;

    if (targetCommunity) {
      // TODO:
      source = this.userService.getMessageThreads(input).pipe(
        map((el: any) => {
          return el.filter((iel) => iel.communityId == targetCommunity)
          // return el.filter((iel) => (iel.communityId == targetCommunity) || (typeof iel.ad == 'undefined' && !iel.group))
        })
      );
    } else {
      source = this.userService.getMessageThreads(input);
    }

    source.subscribe(
      (data) => {
        this._activeThreads = data;
        this.threadsSource.next(data);
      },
      (err) => console.error(err),
    );
  }

  fetchMessages(id?: number) {
    const dest: number = id ? id : this._currentThreadId;
    if (dest > -1) {
      this.userService.getMessages(dest).subscribe(
        (data) => {
          this._currentThreadId = dest;
          this._incommingMessage = data;
          this.messagesSource.next(data);
        },
        (err) => console.error(err)
      );
    }
  }

  sendMessages(msg: string, id?: number) {
    const dest: number = id ? id : this._currentThreadId;
    this.userService.sendMessages(dest, msg).subscribe(
      (data) => {
        console.log('send', data);
      },
      (err) => console.error(err),
    );
  }
}
