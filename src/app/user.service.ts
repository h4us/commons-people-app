import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';

// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SecureStorage } from 'nativescript-secure-storage';

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

// TODO:
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
  photoUrl: string;
  type: string;
};
// --

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // TODO:
  // private apiUrl: string = 'https://app.commons.love/api/';
  private apiUrl: string = 'https://app.test.commons.love/api/';
  // --

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

  constructor(private http: HttpClient) {
    const u = this._sStorage.getSync({ key: 'username' });
    const p = this._sStorage.getSync({ key: 'password' });

    if (u !== null && p !== null) {
      //
      this._restoreble = true;
    }
  }

  /*
   * login / logout, etc
   */
  updateRquest(target: string) {
    this.updateRequestSource.next(target);
  }

  login(username:string = '', password:string = ''): Observable<any> {
    this.loginData.username = username;
    this.loginData.password = password;

    return this.http.post(`${this.apiUrl}login`, this.loginData);
  }

  get restoreble(): boolean {
    return this._restoreble;
  }

  restore(): Observable<any> {
    this.loginData.username = this._sStorage.getSync({ key: 'username' });
    this.loginData.password = this._sStorage.getSync({ key: 'password' });

    return this.http.post(`${this.apiUrl}login`, this.loginData);
  }

  logout(): Observable<any> {
    // TODO:
    this._isLoggedIn = false;
    this._restoreble = false;

    return zip(
      from(this._sStorage.removeAll()),
      this.http.post(`${this.apiUrl}logout`, null)
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

  sendVelification(email:string = ''): any {
    return this.http.post(`${this.apiUrl}passwordreset`, { emailAddress:email });
  }

  /*
   * user
   */
  parseUser(data: User): User {
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

    this._isLoggedIn = true;

    if (this.user.communityList.length > 0) {
      this._currentCommunityId =  this.user.communityList[0].id;
    }

    this._sStorage.set({ key: 'username', value: this.loginData.username });
    this._sStorage.set({ key: 'password', value: this.loginData.password })
    this._sStorage.set({ key: 'lastLogin', value: new Date().toString() });

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
    // TODO:
    const t: number = targetCommunity || this._currentCommunityId;
    const allowChar: string = 'abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789_';
    let q: string = query ? `&q=${query}` : '';
    if (q == '') {
      const ob: Observable<any>[] = [];
      for (let i = 0; i < allowChar.length; i++) {
        ob.push(this.http.get(`${this.apiUrl}users?communityId=${t}&q=${allowChar[i]}`));
      }
      return forkJoin(...ob).pipe(mergeAll());
    } else {
      return this.http.get(`${this.apiUrl}users?communityId=${t}${q}`);
    }
    // --
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

  // TODO:
  getCommnities(query?: string): any {
    return query ? [] : this.user.communityList;
  }

  // TODO:
  updateCommunities(communities: Array<number>): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${this.user.id}/communities`, {
      communityList: communities
    });
  }

  /*
   * topics
   */
  // TODO:
  getTopics(targetCommunity?: number, query?: string): Observable<any> {
    let params = [];
    let ret: Observable<any> = of([]);

    if (targetCommunity) {
      params.push(`communityId=${targetCommunity}`)
    } else {
      params.push(`communityId=${this._currentCommunityId}`)
    }

    if (query && params.length > 0) {
      params.push(`filter=${query}`)
    }

    if (params.length > 0) {
      ret = this.http.get(`${this.apiUrl}ads?${params.join('&')}`);
    }

    return ret;
  }

  getTopic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}ads/${id}`);
  }

  createTopic(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ads`, data);
  }

  /*
   * messageing
   */
  createGroupMessageThread(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/group`, data);
  }

  tapDirectMessageThread(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/user/${id}`, { userId: id });
  }

  tapTopicMessageThread(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/for-ad/${id}`, { userId: id });
  }

  getMessageThreads(): Observable<any> {
    return this.http.get(`${this.apiUrl}message-threads`);
  }

  getMessages(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}message-threads/${id}/messages`);
  }

  sendMessages(id: number, msg: string): Observable<any> {
    return this.http.post(`${this.apiUrl}message-threads/${id}/messages`, {
      threadId: id,
      text: msg
    });
  }

  /*
   * points
   */
  getBalance(targetCommunity?: number, updateNow:boolean = false): Observable<any> {
    const t: number = targetCommunity || this._currentCommunityId;
    let ret: Observable<any>;

    if (updateNow) {
      ret = this.http.get(`${this.apiUrl}/balance?communityId=${t}`);
    } else {
      let c = this.user.balanceList.filter((el) => el.communityId == t);
      c = (c && c.length > 0) ? c[0] : null;
      ret = new Observable(s => {
        s.next(c);
        s.complete();
      });
    }

    return ret;
  }

  getTransactions(targetCommunity?: number): Observable<any> {
    const t: number = targetCommunity || this._currentCommunityId;
    return this.http.get(`${this.apiUrl}/transactions?communityId=${t}`);
  }

  /*
   * profiles
   */
  updateProfile(key:any, data:any): Observable<any> {
    let ret: Observable<any> = this.http.post(`${this.apiUrl}/users/${this.user.id}`, data);

    if (key === 'status') {
      ret = this.http.post(`${this.apiUrl}/users/${this.user.id}/status`, data);
    } else if (key === 'avatarUrl') {
      // TODO:
      ret = this.http.post(`${this.apiUrl}/users/${this.user.id}/avatar`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
      });
    } else if (key === 'emailAddress') {
      // TODO:
      ret = this.http.post(`${this.apiUrl}/users/${this.user.id}/emailaddress`, data);
    } else if (key === 'password') {
      // TODO:
      ret = this.http.post(`${this.apiUrl}/users/${this.user.id}/password`, data);
    }

    return ret;
  }

};
