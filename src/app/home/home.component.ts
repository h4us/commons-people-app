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

import { TrayService } from '../shared/tray.service';

import { environment } from '~/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // providers: [ TrayService ]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  title:string = 'COMMONS PEOPLE';
  autologin: boolean = false;

  srcData: string = 'data.json';
  ltCalcWidth: number = 0;
  safeAreaSpan: number = 12;
  @ViewChild('homepageRoot') hRoot: ElementRef;
  @ViewChild('lottieViewAnchor') ltAnchor: ElementRef;
  @ViewChild('lottieView') lt: ElementRef;

  isProd: boolean = environment.production;
  useApiBase: string = environment.apiBaseURL;

  private _subs: Subscription;

  constructor(
    private router: Router,
    private routerExt:RouterExtensions,
    private userService:UserService,
    private rvService: RegisterValidatorService,
    private siService: SigninValidatorService,
    private trayService: TrayService,
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
        (error) => {
          // TODO: error message
          console.error(error),
          this.autologin = false;
          this.trayService.request('snackbar/home', 'open', {
            isApproved: true,
            step: 1,
            doneMessage: 'ログイン中にエラーが発生しました',
            barColor: 'error',
            autoDisposeDelay: 10000
          })
        },
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

      //
      const aH = this.hRoot.nativeElement.getMeasuredHeight() / screen.mainScreen.scale;
      const sc: number = 1 / screen.mainScreen.scale;
      if (isIOS) {
        let safeAreaSpan: number = 0;
        if (application.ios.window.safeAreaInsets) {
          safeAreaSpan = <number>application.ios.window.safeAreaInsets.top + <number>application.ios.window.safeAreaInsets.bottom;
        }
        this.trayService.trayPosition = screen.mainScreen.heightDIPs - (safeAreaSpan);
      } else {
        this.trayService.trayPosition = aH;
      }
      //

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
