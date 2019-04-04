import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ComponentRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { TrayService } from '../../shared/tray.service';

@Component({
  selector: 'app-signin-root',
  templateUrl: './signin-root.component.html',
  styleUrls: ['./signin-root.component.scss']
})
export class SigninRootComponent implements OnInit, OnDestroy {

  locked: boolean = false;
  lSubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private page: Page,
    private aRoute: ActivatedRoute,
    private trayService: TrayService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    //
    this.lSubscription = this.trayService.userpageLock$.subscribe((state: boolean) => {
      this.locked = state;
    });

    this.routerExt.navigate([{
      outlets: {
        signinpage: ['entry']
      }
    }], { relativeTo: this.aRoute });
  }

  ngOnDestroy() {
    this.lSubscription.unsubscribe();
  }

  onOuterTouch(): boolean {
    return false;
  }
}
