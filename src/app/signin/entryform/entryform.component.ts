import { Component, OnInit } from '@angular/core';
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
  // for development

  constructor(
    private router: RouterExtensions,
    private userService: UserService,
    private page: Page) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.username, this.password).subscribe(
      (data: User) => {
        this.userService.parseUser(data)
      },
      (error) => { console.error(error) },
      () => {
        const cl = this.userService.getCommunities();
        this.router.navigate([(cl && cl.length > 0) ? 'user' : 'newuser'], {
          clearHistory: true
        })
      }
    );
  }
}
