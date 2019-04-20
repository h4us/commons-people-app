import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { interval, Subscription, fromEvent } from 'rxjs';
import { skipWhile, delay, take } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { screen, isIOS } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';

import { UserService, User } from '../user.service';
import { RegisterValidatorService } from '../register-validator.service';
import { SigninValidatorService } from '../signin-validator.service';

import { SystemTrayService } from '../system-tray.service';

import { environment } from '~/environments/environment';

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
  @ViewChild('homepageRoot') hRoot: ElementRef;
  @ViewChild('lottieViewAnchor') ltAnchor: ElementRef;

  isProd: boolean = environment.production;
  useApiBase: string = environment.apiBaseURL;

  private _subs: Subscription;

  constructor(
    private router: Router,
    private routerExt:RouterExtensions,
    private userService:UserService,
    private rvService: RegisterValidatorService,
    private siService: SigninValidatorService,
    private trayService: SystemTrayService,
    private page: Page
  ) {
    page.actionBarHidden = true;
    // ...
    this._subs = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '/') {
          this.rvService.resetData();
        }
      }
    });

    this.autologin = this.userService.restoreble;
  }

  ngOnInit() {
    this.autologin = this.userService.restoreble;

    if (this.userService.restoreble) {
      this.userService.restore().subscribe(_ => {
        const cl = this.userService.getCommunities();
        this.routerExt.navigate([(cl && cl.length > 0) ? 'user' : 'newuser'], {
          clearHistory: true,
          animated: false,
          // transition: { name: 'fade', duration: 150 }
        })
      }, (err: any) => {
        this.userService.logout(false).subscribe(_ => this.routerExt.navigate(['signin']));
      });
    }
  }

  ngAfterViewInit() {
    fromEvent(this.hRoot.nativeElement, 'loaded').pipe(
      take(1), delay(1)
    ).subscribe(_ => {
      // if (isIOS) {
      //   if (application.ios.window.safeAreaInsets) {
      //     this.safeAreaSpan = (<number>application.ios.window.safeAreaInsets.top) * -1;
      //   }
      // }

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
    });
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
    // this.routerExt.navigate(['demo'])
  }
  // ~~
}
