import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { tap, map, share } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class MessageProxyService {

  private messagesSource = new Subject<any>();
  private threadsSource = new Subject<any>();
  private _activeThreads: any[] = [];
  private _currentThreadId: number = -1;
  private _incommingMessage: any;

  incommingMessage$ = this.messagesSource.asObservable();
  activeThreads$ = this.threadsSource.asObservable();

  private _debugStr: string = '';

  constructor(private userService: UserService) {}

  get activeThreads() {
    return this._activeThreads;
  }

  get incommingMessage() {
    return this._incommingMessage;
  }

  get debugStr() {
    return this._debugStr;
  }

  fetchThreads(targetCommunity?: number) {
    let source: Observable<any>;
    if (targetCommunity) {
      // source = this.userService.getMessageThreads({ communityId: targetCommunity }).pipe(
      //   // tap((res) => this._debugStr = JSON.stringify(res)),
      //   map((el: any) => {
      //     return el.filter((iel) => iel.communityId && iel.communityId == targetCommunity)
      //   }),
      // );
      source = this.userService.getMessageThreads({ communityId: targetCommunity });
    } else {
      source = this.userService.getMessageThreads({ communityId: this.userService.getCommunity().id });
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
      const _input = Object.assign({ communityId: targetCommunity } , input);
      source = this.userService.getMessageThreads(_input);
      // source = this.userService.getMessageThreads(input).pipe(
      //   map((el: any) => {
      //     return el.filter((iel) => iel.communityId && iel.communityId == targetCommunity)
      //   }),
      // );
    } else {
      const _input = Object.assign({ communityId: this.userService.getCommunity().id } , input);
      source = this.userService.getMessageThreads(_input);
    }

    source.subscribe(
      (data) => {
        this._activeThreads = data;
        this.threadsSource.next(data);
      },
      (err) => console.error(err),
    );
  }

  clear() {
    this._activeThreads = [];
    this.threadsSource.next([]);
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
