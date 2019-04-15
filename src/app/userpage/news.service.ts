import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';

import { HttpClient } from '@angular/common/http';

import { environment } from '~/environments/environment';

export class News {
  /*
   * from wordpress rest API
   */
  id: number; // post id
  date: string;
  date_gmt: string;
  guid: any;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: any;
  content: any;
  excerpt: any;
  author: number; // author id
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: number[];
  categories: number[];
  tags: number[];

  constructor() {
    //
  }
};

@Injectable({
  providedIn: UserpageModule
})
export class NewsService {
  //
  // private blogUrl: string = 'http://52.195.4.66/wp-json/wp/v2/';
  private blogUrl: string = environment.newsFeedURL;

  private _items: News[] = [];
  private _item: News;

  constructor(private http:HttpClient) {
    //
  }

  fetch(query: string = '', subscribeAuto: boolean = true): Observable<any> {
    const ret = this.http.get(`${this.blogUrl}info${query}`).pipe(
      tap((res: any) => {
        this._items = this._items.concat(res);
      }),
    )

    if (subscribeAuto) {
      ret.subscribe();
    }

    return ret;
  }

  fetchPost(id: number): Observable<any> {
    return this.http.get(`${this.blogUrl}info/${id}`).pipe(
      tap((res: any) => { this._item = res }),
    );
  }

  get items(): News[] {
    return this._items;
  }

  get item(): News {
    return this._item;
  }

  // TODO:
  clear() {
    this._items = [];
  }
}
