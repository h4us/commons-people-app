import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { interval, Subscription } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { screen, isIOS } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';

import { UserService, User } from '../user.service';
import { RegisterValidatorService } from '../register-validator.service';
import { SigninValidatorService } from '../signin-validator.service';

// import { handleOpenURL, AppURL } from 'nativescript-urlhandler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  title:string = 'COMMONS PEOPLE';
  autologin: boolean = false;

  srcData: string = 'data.json';
  ltCalcWidth: number = 0;
  safeAreaSpan: number = 12;
  @ViewChild('lottieViewAnchor') ltAnchor: ElementRef;
  @ViewChild('lottieView') lt: ElementRef;

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

    // TODO:
    const sb = interval(30).pipe(skipWhile(() => {
      return this.ltAnchor.nativeElement.getMeasuredWidth() < 1;
    })).subscribe(() => {
      const lCW = this.ltAnchor.nativeElement.getMeasuredWidth() / screen.mainScreen.scale;

      if (isIOS) {
        if (application.ios.window.safeAreaInsets) {
          this.safeAreaSpan = (<number>application.ios.window.safeAreaInsets.top) * -1;
          console.log('--> ios safeAreaSpan?', this.safeAreaSpan);
        }
      }

      if (lCW < 321) {
        this.ltCalcWidth = 64.853 * (320 / lCW);
      } else {
        this.ltCalcWidth = 76 * (375 / lCW);
      }

      sb.unsubscribe();
    });
    // --
  }

  ngAfterViewInit() {
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
