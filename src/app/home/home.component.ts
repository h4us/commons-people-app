import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title:string = 'COMMONS PEOPLE';
  srcData: string;
  autologin: boolean = false;

  constructor(
    private router:RouterExtensions,
    private userService:UserService,
    page: Page) {
    page.actionBarHidden = true;
    this.srcData = `data.json`;
  }

  ngOnInit() {
    this.autologin = this.userService.restoreble;

    if (this.userService.restoreble) {
      this.userService.restore().subscribe(
        (data: User) => this.userService.parseUser(data),
        (error) => console.error(error),
        () => {
          setTimeout(() => {
            this.router.navigate(['user', { clearHistory: true }], { transition: { name: 'fade', duration: 300 } })
          }, 600);
        }
      );
    }
  }

  gotoRegister () {
    this.router.navigate(['register'])
  }

  gotoSignin () {
    this.router.navigate(['signin'])
  }

  // --
  gotoDemo () {
    this.router.navigate(['demo'])
  }
  // ~~
}
