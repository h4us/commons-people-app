import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../user.service';

@Component({
  selector: 'app-entryform',
  templateUrl: './entryform.component.html',
  styleUrls: ['./entryform.component.scss'],
})
export class EntryformComponent implements OnInit {
  title: string = 'サインイン'

  // TODO:
  username: string = 'inafuku';
  password: string = 'helloworld';

  constructor(
    private router: RouterExtensions,
    private _userService: UserService,
    page: Page) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  login() {
    this._userService.login(this.username, this.password).subscribe(
      (data: User) => {
        this._userService.parseUser(data)
      },
      (error) => { console.error(error) },
      () => {
        this.router.navigate(['user', {
          clearHistory: true
        }])
      }
    );
  }
}
