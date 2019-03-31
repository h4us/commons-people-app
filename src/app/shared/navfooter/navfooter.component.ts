import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Input, Output,
  ViewChild, ElementRef
} from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
// import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
// import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { RouterExtensions } from 'nativescript-angular/router';
import { screen } from 'tns-core-modules/platform';

// import { NavigationTransition, Frame } from 'tns-core-modules/ui/frame';

@Component({
  selector: 'app-navfooter',
  templateUrl: './navfooter.component.html',
  styleUrls: ['./navfooter.component.scss']
})
export class NavfooterComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() debugBorder: boolean = false;

  private _navActive: string;
  private _subs: Subscription;

  navMode: string = 'default';
  iPoint: number = 0;

  @ViewChild('navPoint') npRef: ElementRef;
  npEl: AbsoluteLayout;

  constructor(
    private router: Router,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
  ) {

    // TODO:
    this._subs = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('nav start ->', this.router.url)
      }

      if (event instanceof NavigationEnd) {
        //
        console.log('nav end ->', this.router.url);
        //
        if (this.router.url.match(/.*\/search/)) {
          this.navMode = 'dm';
        } else {
          if (this.router.url.indexOf('userpage:community') >= 0) {
            this._navActive = 'community';
            this.navMode = 'default';
          } else if (this.router.url.indexOf('userpage:point') >= 0) {
            this._navActive = 'point';
            this.navMode = (this.router.url.match(/\/select|send|confirm/)) ? 'dm' : 'default';
          } else if (this.router.url.indexOf('userpage:message') >= 0) {
            this._navActive = 'message';
            this.navMode = (this.router.url.indexOf('/log') >= 0) ? 'dm' : 'default';
          } else if (this.router.url.indexOf('userpage:profile') >= 0) {
            this._navActive = 'profile';
            this.navMode = 'default';
          }
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

  ngAfterViewInit() {
    this.npEl = <AbsoluteLayout>this.npRef.nativeElement;

    // TODO:
    setTimeout(() => {
      const eW = this.npEl.getMeasuredWidth() / screen.mainScreen.scale;
      const eH = this.npEl.getMeasuredHeight() / screen.mainScreen.scale;
      this.iPoint = (eW / 75) * 48;
    }, 100);
    // --
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  get navActive(): string {
    return this._navActive;
  }

  indicated(key: string): string {
    // TODO: dummy
    return (key == 'point') ? 'visible' : 'collapsed';
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
