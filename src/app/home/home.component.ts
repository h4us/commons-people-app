import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { interval, Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../user.service';
import { RegisterValidatorService } from '../register-validator.service';
import { SigninValidatorService } from '../signin-validator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title:string = 'COMMONS PEOPLE';
  srcData: string;
  autologin: boolean = false;

  private _subs: Subscription;

  constructor(
    private router: Router,
    private routerExt:RouterExtensions,
    private userService:UserService,
    private rvService: RegisterValidatorService,
    private siService: SigninValidatorService,
    private page: Page
  ) {
    page.actionBarHidden = true;

    this.srcData = `data.json`;

    // ...
    this._subs = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '/') {
          this.rvService.resetData();
          // this.siService.resetData();
        }
      }
    });
  }

  ngOnInit() {
    this.autologin = this.userService.restoreble;

    if (this.userService.restoreble) {
      this.userService.restore().subscribe(
        (data: User) => this.userService.parseUser(data),
        (error) => console.error(error),
        () => {
          setTimeout(() => {
            //
            console.log(this.userService.getCommunities());

            const cl = this.userService.getCommunities();
            this.routerExt.navigate([(cl && cl.length > 0) ? 'user' : 'newuser'], {
              clearHistory: true,
              transition: { name: 'fade', duration: 300 }
            })
          }, 600);
        }
      );
    }
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  gotoRegister () {
    this.routerExt.navigate(['register'])
  }

  gotoSignin () {
    this.routerExt.navigate(['signin'])
  }

  // --
  gotoDemo () {
    this.routerExt.navigate(['demo'])
  }
  // ~~
}
