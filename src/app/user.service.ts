import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, forkJoin, from, of, zip, OperatorFunction } from 'rxjs';
import { distinct, concatMap, toArray, map, mergeAll, concatAll, tap } from 'rxjs/operators';

import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { SecureStorage } from 'nativescript-secure-storage';

import { environment } from '~/environments/environment';

export interface LoginData {
  username: string;
  password: string;
};

export interface User {
  id: number;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  communityList: Array<any>;
  balanceList: Array<any>;
  emailAddress: string;
  avatarUrl: string;
  description: string;
  location: string;
  status: string;
};

export interface Topic {
  id: number;
  communityId: number;
  createdBy: any;
  title: string;
  description: string;
  points: number;
  location: string;
  own: boolean;
  payable: boolean;
  createdAt: string;
  photoUrl: string | ImageAsset | ImageSource;
  type: string;
};
// --

@Injectable(
  // {
  //   providedIn: 'root'
  // }
)
export class UserService {

  private apiUrl: string = environment.apiBaseURL;
  private loginData = {
    username: null,
    password: null
  }
  private user: User;
  private _isLoggedIn: boolean;
  private _currentCommunityId: number = -1;

  private _sStorage: SecureStorage = new SecureStorage();
  private _restoreble: boolean = false;
  //
  private updateRequestSource = new Subject<string>();
  updateRequest$ = this.updateRequestSource.asObservable();

  draftCommunityIds: number[] = [];
  draftCommunities: any[] = [];

  defaultPaging: any = {
    topics: {
      page: 0,
      size: 10,
      sort: 'DESC'
    },

    news: {
      page: 0,
      size: 10,
      sort: 'DESC'
    },

    messages: {
      page: 0,
      size: 5,
      sort: 'DESC'
    }
  }

  constructor(private http: HttpClient) {
    const u = this._sStorage.getSync({ key: 'username' });
    const p = this._sStorage.getSync({ key: 'password' });

    if (u !== null && p !== null) {
      //
      this._restoreble = true;
    }
  }

  /*
   * login / logout / register, etc
   */
  updateRquest(target: string) {
    this.updateRequestSource.next(target);
  }

  login(username:string = '', password:string = ''): Observable<any> {
    this.loginData.username = username;
    this.loginData.password = password;

    return this.http.post(`${this.apiUrl}login`, this.loginData).pipe(
      tap((data: unknown) => {
        console.log('standard logged in', data);
        this.parseUser(<User>data, true);
      })
    );
  }

  get restoreble(): boolean {
    return this._restoreble;
  }

  restore(): Observable<any> {
    this.loginData.username = this._sStorage.getSync({ key: 'username' });
    this.loginData.password = this._sStorage.getSync({ key: 'password' });
    return this.http.post(`${this.apiUrl}login`, this.loginData).pipe(
      tap((data: unknown) => {
        console.log('restore logged in', data);
        this.parseUser(<User>data, true)
      })
    );
  }

  logout(completely: boolean = true): Observable<any> {
    // TODO:
    this._isLoggedIn = false;
    this._restoreble = false;
    this.user = null;
    this.loginData = {
      username: null,
      password: null
    };

    let ret: Observable<any> = of(null);

    if (completely) {
      // console.log('hard logout');
      ret = zip(
        from(this._sStorage.removeAll()),
        this.http.post(`${this.apiUrl}logout`, null)
      );
    } else {
      // console.log('soft logout');
    }

    return ret;
  }

  createAccount(data): Observable<any> {
    // return zip(
    //   from(this._sStorage.removeAll()),
    //   this.http.post(`${this.apiUrl}create-account`, data)
    // );
    return this.http.post(`${this.apiUrl}create-account`, data)
  }

  deleteAccount(): Observable<any> {
    // TODO:
    this._isLoggedIn = false;
    this._restoreble = false;

    return zip(
      from(this._sStorage.removeAll()),
      this.http.post(`${this.apiUrl}users/${this.user.id}/delete`, null)
    );
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get session(): HttpClient {
    return this.http;
  }

  get endpoint(): string {
    return this.apiUrl;
  }

  getCurrentLogin(): LoginData {
    return this.loginData;
  }

  sendVelification(email:string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}passwordreset`, { emailAddress:email });
  }

  /*
   * user
   */
  parseUser(data: User, initPhase?: boolean): User {
    this.user = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      communityList: data.communityList,
      balanceList: data.balanceList,
      emailAddress: data.emailAddress,
      avatarUrl: data.avatarUrl,
      description: data.description,
      location: data.location,
      status: data.status
    }

    if (this.user.communityList.length > 0 && this._currentCommunityId < 0) {
      this._currentCommunityId =  this.user.communityList[0].id;
    }

    if (initPhase) {
      this._isLoggedIn = true;

      this._sStorage.set({ key: 'username', value: this.loginData.username });
      this._sStorage.set({ key: 'password', value: this.loginData.password })
      this._sStorage.set({ key: 'lastLogin', value: new Date().toString() });
    }

    return this.user;
  }

  getCurrentUser(): User {
    return this.user;
  }

  findUser(id: number): any {
    // TODO:
    return this.http.get(`${this.apiUrl}users/${id}`);
  }

  getUserDetail(id: number): any {
    // TODO:
    return this.http.get(`${this.apiUrl}users/${id}`);
  }

  searchUsers(targetCommunity?:number, query?:string): any {
    // TODO: performance, error handling, etc
    // const t: number = targetCommunity || this._currentCommunityId;
    // const allowChar: string = 'abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789_';
    // let q: string = query ? `&q=${query}` : '';
    // if (q == '') {
    //   const ob: Observable<any>[] = [];
    //   for (let i = 0; i < allowChar.length; i++) {
    //     ob.push(this.http.get(`${this.apiUrl}users?communityId=${t}&q=${allowChar[i]}`));
    //   }
    //   return forkJoin(...ob).pipe(mergeAll());
    // } else {
    //   return this.http.get(`${this.apiUrl}users?communityId=${t}${q}`);
    // }

    const t: number = targetCommunity || this._currentCommunityId;
    const allowChar: string = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLnNmMoOpPqQrRsStTuUvVwWxXyYzZ_';

    let q: string = query || '';
    if (q == '') {
      const hParams: string[] = [];
      for (const c of allowChar) {
        hParams.push(
          [
            `communityId=${t}`,
            `q=${c}`,
            // `pagination[page]=0&pagenation[size]=10&pagenation[sort]=ASC`
          ].join('&')
        );
      }

      return from(hParams).pipe(
        concatMap((hp: any) => this.http.get(`${this.apiUrl}users?${hp}`)),
        map((res: any) => res.userList ? res.userList : res),
        concatAll(),
        distinct((el: any) => el.id),
        toArray()
      );
    } else {
      const hParam: string = [
        `communityId=${t}`,
        `q=${q}`,
        // `pagination[page]=0&pagenation[size]=10&pagenation[sort]=ASC`
      ].join('&');

      return this.http.get(`${this.apiUrl}users?${hParam}`).pipe(
        map((res: any) => res.userList ? res.userList : res)
      );
    }
  }

  updateUserInfo(data: any, mode?: string): Observable<any> {
    let ret: Observable<any>;
    if (mode === 'status') {
      ret = this.http.post(`${this.apiUrl}users/${this.user.id}/status`, data);
    } else if (mode === 'username') {
      ret = this.http.post(`${this.apiUrl}users/${this.user.id}/username`, data);
    } else {
      ret = this.http.post(`${this.apiUrl}users/${this.user.id}`, data);
    }

    return ret.pipe(
      tap((data: unknown) => {
        this.parseUser(<User>data)
      })
    );
  }

  updateUserEmailAddress(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/emailaddress`, data).pipe(
      tap((data: unknown) => {
        this.parseUser(<User>data)
      })
    );
  }

  updateUserPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/passwordreset`, data).pipe(
      tap((data: unknown) => {
        this.parseUser(<User>data)
      })
    );
  }

  updateSelf(): Observable<any> {
    return this.http.get(`${this.apiUrl}user`).pipe(
      tap((data: unknown) => {
        this.parseUser(<User>data)
      })
    );
  }

  /*
   * communities
   */
  get currentCommunityId() {
    return this._currentCommunityId;
  }

  switchCommunity(id: number): number {
    const c = this.user.communityList.filter((el) => el.id == id);
    if (c.length > 0) {
      this._currentCommunityId = c[0].id;
    }

    return this._currentCommunityId;
  }

  getCommunity(targetCommunity?: number): any {
    const t: number = targetCommunity || this._currentCommunityId;
    const c = this.user.communityList.filter((el) => el.id == t);
    return (c && c.length > 0) ? c[0] : null;
  }

  getCommunityByToken(targetToken: string): any {
    const c = this.user.communityList.filter((el) => el.tokenSymbol == targetToken);
    return (c && c.length > 0) ? c[0] : null;
  }

  getCommunities(): any {
    return this.user.communityList.slice();
  }

  searchCommunities(query?: string): Observable<any> {
    let params = [];
    let ret: Observable<any> = of([]);

    if (query) {
      params.push(`filter=${query}`)
    }

    if (params.length > 0) {
      ret = this.http.get(`${this.apiUrl}communities?${params.join('&')}`).pipe(
        map((res: any) => res.communityList ? res.communityList : res)
      );
    } else {
      ret = this.http.get(`${this.apiUrl}communities`).pipe(
        map((res: any) => res.communityList ? res.communityList : res)
      );
    }

    return ret
  }

  // TODO:
  updateCommunities(communities: Array<number>): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/communities`, {
      communityList: communities
    }).pipe(
      tap((data: unknown) => this.parseUser(<User>data))
    );
  }

  /*
   * topics
   */
  getTopics(targetCommunity?: number, query?: string, paging?: any): Observable<any> {
    let params = [];
    let ret: Observable<any> = of([]);
    // let _paging: any = {
    //   page: 0,
    //   size: 5,
    //   sort: 'DESC'
    // };

    let _paging: any = Object.assign({} , this.defaultPaging.topics);

    if (targetCommunity) {
      params.push(`communityId=${targetCommunity}`)
    } else {
      params.push(`communityId=${this._currentCommunityId}`)
    }

    if (query && query.length > 0 && params.length > 0) {
      params.push(`filter=${query}`)
    }

    if (paging) {
      _paging.page = paging.page || _paging.page;
      _paging.size = paging.size || _paging.size;
      _paging.sort = paging.sort || _paging.sort;
    }

    params.push(`pagination[page]=${_paging.page}&pagination[size]=${_paging.size}&pagination[sort]=${_paging.sort}`);

    // if (params.length > 0) {
    //   // TODO: rxjs issue
    //   // SEE: https://github.com/ReactiveX/rxjs/issues/3989

    //   // let observableFuncParams = [
    //   //   map((res: any) => res.adList ? res.adList : res),
    //   //   map((res: any) => res.sort((a, b) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) ? -1 : 1)),
    //   //   map((res: any) => res.filter((el, i) => i < 1)),
    //   // ];

    //   if (paging && paging.size) {
    //     ret = this.http.get(`${this.apiUrl}ads?${params.join('&')}`).pipe(
    //       map((res: any) => res.adList ? res.adList : res),
    //       map((res: any) => res.sort((a, b) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) ? -1 : 1)),
    //       map((res: any) => res.filter((el, i) => i < paging.size))
    //     );

    //   } else {
    //     ret = this.http.get(`${this.apiUrl}ads?${params.join('&')}`).pipe(
    //       map((res: any) => res.adList ? res.adList : res),
    //       map((res: any) => res.sort((a, b) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) ? -1 : 1))
    //     );
    //   }
    // }

    ret = this.http.get(`${this.apiUrl}ads?${params.join('&')}`).pipe(
      map((res: any) => res.adList ? res.adList : res)
    );

    return ret;
  }

  getTopic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}ads/${id}`);
  }

  createTopic(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ads`, data);
  }

  updateTopic(id:number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ads/${id}`, data);
  }

  updateTopicsLastViewTime(communityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/ad/lastViewTime`, { communityId });
  }

  /*
   * for news feed
   */
  updateNewsLastViewTime(communityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/notification/lastViewTime`, { communityId });
  }

  getNewsUpdates(communityId: number, paging?: any): Observable<any> {
    let params = [];
    let _paging: any = {
      page: 0,
      size: 10,
      sort: 'DESC'
    };

    if (paging) {
      _paging.page = paging.page || _paging.page;
      _paging.size = paging.size || _paging.size;
      _paging.sort = paging.sort || _paging.sort;
    }
    params.push(`pagination[page]=${_paging.page}&pagination[size]=${_paging.size}&pagination[sort]=${_paging.sort}`);

    return this.http.get(`${this.apiUrl}communities/${communityId}/notification?${params.join('&')}`).pipe(
      map((res: any) => res.notificationList ? res.notificationList : res)
    );
  }


  /*
   * messageing
   */
  createGroupMessageThread(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/group`, data);
  }

  updateGroupMessageThread(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/${id}/group`, data);
  }

  unsubscribeGroupMessageThread(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/${id}/unsubscribe`, null);
  }

  tapDirectMessageThread(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/user/${id}`, { userId: id });
  }

  tapTopicMessageThread(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/for-ad/${id}`, { userId: id });
  }

  getMessageThreads(filters?: any): Observable<any> {
    let params = [];
    let ret: Observable<any> = of([]);

    if (filters) {
      if (filters.memberFilter) {
        params.push(`memberFilter=${filters.memberFilter}`)
      }
      if (filters.messageFilter) {
        params.push(`messageFilter=${filters.messageFilter}`)
      }
    }

    if (params.length > 0) {
      ret = this.http.get(`${this.apiUrl}message-threads?${params.join('&')}`).pipe(
        map((res: any) => res.messageThreadList ? res.messageThreadList : res)
      );
    } else {
      ret = this.http.get(`${this.apiUrl}message-threads`).pipe(
        map((res: any) => res.messageThreadList ? res.messageThreadList : res)
      );
    }

    return ret;
  }

  getMessages(id: number, paging?: any): Observable<any> {
    let params = [];
    let _paging: any = {
      page: 0,
      size: 10,
      sort: 'DESC'
    };

    if (paging) {
      _paging.page = paging.page || _paging.page;
      _paging.size = paging.size || _paging.size;
      _paging.sort = paging.sort || _paging.sort;
    }

    // params.push(`pagination[page]=${_paging.page}&pagination[size]=${_paging.size}&pagination[sort]=${_paging.sort}`);

    params.push(`pagination[sort]=DESC`);

    return this.http.get(`${this.apiUrl}message-threads/${id}/messages?${params.join('&')}`).pipe(
      map((res: any) => res.messageList ? res.messageList : res)
    );
  }

  sendMessages(id: number, msg: string): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/${id}/messages`, {
      threadId: id,
      text: msg
    });
  }

  getUnreadMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}message-threads/unread-count`);
  }

  /*
   * points
   */
  getBalance(targetCommunity?: number, updateNow:boolean = false): Observable<any> {
    const t: number = targetCommunity || this._currentCommunityId;
    let ret: Observable<any>;

    if (updateNow) {
      ret = this.http.get(`${this.apiUrl}balance?communityId=${t}`);
    } else {
      let c = this.user.balanceList.find((el) => el.communityId == t);
      ret = new Observable(s => {
        s.next(c);
        s.complete();
      });
    }

    return ret;
  }

  getTransactions(targetCommunity?: number, paging?: any): Observable<any> {
    const params = [];
    const t: number = targetCommunity || this._currentCommunityId;
    let _paging: any = {
      page: 0,
      size: 10,
      sort: 'DESC'
    };
    let ret: Observable<any>;

    params.push(`communityId=${t}`);

    ret = this.http.get(`${this.apiUrl}transactions?${params.join('&')}`).pipe(
      map((res: any) => res.transactionList ? res.transactionList : res),
      // TODO | TEST: missing...?
      map((res: any) => res.map((el) => { el['communityId'] = t; return el; }))
      // --
    );

    // TODO: pagination by serve
    if (paging) {
      _paging.page = paging.page || _paging.page;
      _paging.size = paging.size || _paging.size;
      _paging.sort = paging.sort || _paging.sort;

      params.push(`pagination[page]=${_paging.page}&pagination[size]=${_paging.size}&pagination[sort]=${_paging.sort}`);

      if (paging.size) {
        ret = this.http.get(`${this.apiUrl}transactions?${params.join('&')}`).pipe(
          map((res: any) => res.transactionList ? res.transactionList : res),
          // TODO | TEST: missing...?
          map((res: any) => res.map((el) => { el['communityId'] = t; return el; })),
          // --
          map((res: any) => res.filter((el, i) => i < paging.size))
        );
      } else {
        ret = this.http.get(`${this.apiUrl}transactions?${params.join('&')}`).pipe(
          map((res: any) => res.transactionList ? res.transactionList : res),
          map((res: any) => res.map((el) => { el['communityId'] = t; return el; }))
        );
      }
    }

    return ret;
  }

  createTransactions(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}transactions`, data);
  }

  updateTransactionsLastViewTime(communityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}users/${this.user.id}/wallet/lastViewTime`, { communityId });
  }
};
