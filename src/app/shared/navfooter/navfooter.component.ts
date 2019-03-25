import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
// import { NavigationTransition, Frame } from 'tns-core-modules/ui/frame';

@Component({
  selector: 'app-navfooter',
  templateUrl: './navfooter.component.html',
  styleUrls: ['./navfooter.component.scss']
})
export class NavfooterComponent implements OnInit, OnDestroy {
  @Input() debugBorder: boolean = false;

  private _navActive: string;
  private _subs: Subscription;

  navMode: string = 'default';

  constructor(
    private router: Router,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute) {

    // TODO:
    this._subs = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.indexOf('userpage:community') >= 0) {
          this._navActive = 'community';
          this.navMode = 'default';
        } else if (this.router.url.indexOf('userpage:point') >= 0) {
          this._navActive = 'point';
          this.navMode = 'default';
        } else if (this.router.url.indexOf('userpage:message') >= 0) {
          //
          this._navActive = 'message';
          this.navMode = (this.router.url.indexOf('/log') >= 0) ? 'dm' : 'default';
          //
        } else if (this.router.url.indexOf('userpage:profile') >= 0) {
          this._navActive = 'profile';
          this.navMode = 'default';
        }
      }
    });
  }

  ngOnInit() {
      // curl (same as curlUp) (iOS only)
      // curlUp (iOS only)
      // curlDown (iOS only)
      // explode (Android Lollipop(21) and up only)
      // fade
      // flip (same as flipRight)
      // flipRight
      // flipLeft
      // slide (same as slideLeft)
      // slideLeft
      // slideRight
      // slideTop
      // slideBottom
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  get navActive(): string {
    return this._navActive;
  }

  gotoPoints() {
    // this.routerExt.navigate(['/user', 'point'], {
    //   transition: { name: 'fade', duration: 100 }
    // });

    this.routerExt.navigate([{
      outlets: {
        userpage: ['point']
      }
    }], {
      transition: { name: 'fade', duration: 150 },
      relativeTo: this.aRoute
    });
  }

  gotoCommunity() {
    this.routerExt.navigate([{
      outlets: {
        userpage: ['community']
      }
    }], {
      transition: { name: 'fade', duration: 150 },
      relativeTo: this.aRoute
    });
  }

  gotoMessage() {
    this.routerExt.navigate([{
      outlets: {
        userpage: ['message']
      }
    }], {
      transition: { name: 'fade', duration: 150 },
      relativeTo: this.aRoute
    });
  }

  gotoProfile() {
    this.routerExt.navigate([{
      outlets: {
        userpage: ['profile']
      }
    }], {
      transition: { name: 'fade', duration: 150 },
      relativeTo: this.aRoute
    });
  }
}
