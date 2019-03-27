import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { UserpageModule } from './userpage.module';
// import { CommunityModule } from './community.module';

import { HttpClient } from '@angular/common/http';

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

  /*
   * extra params;
   */
  tpl: string = 'news';

  constructor() {
    //
    //
  }
};

@Injectable({
  providedIn: UserpageModule
  // providedIn: CommunityModule
})
export class NewsService {
  //
  private blogUrl: string = 'http://52.195.4.66';
  private wpApiEndpoint: string = '/wp-json/wp/v2/';
  // --

  private _items: News[] = [];

  constructor(private http:HttpClient) {
    //
  }

  fetch(query: string = ''): News[] {
    this.http
      .get(`${this.blogUrl}${this.wpApiEndpoint}posts${query}`)
      .pipe(map((data: any) => {
        return data.map((el) => { el['tpl'] = 'news'; return el; });
      }))
      .subscribe(
        (data: any) => {
          this._items = data;
        },
        (err: any) => console.error(err),
        // () => console.log('done')
      );

    //
    return this._items;
  }

  get items(): News[] {
    return this._items;
  }
}
