import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ComponentRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { SystemTrayService } from '../../system-tray.service';

@Component({
  selector: 'app-register-root',
  templateUrl: './register-root.component.html',
  styleUrls: ['./register-root.component.scss']
})
export class RegisterRootComponent implements OnInit {

  locked: boolean = false;
  lSubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private page: Page,
    private aRoute: ActivatedRoute,
    private trayService: SystemTrayService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    console.log('hello');
    // .. in constructor?
    if (!this.lSubscription) {
      this.lSubscription = this.trayService.userpageLock$.subscribe((state: boolean) => {
        this.locked = state;
      });
    }

    this.routerExt.navigate([{
      outlets: {
        registerpage: ['entry']
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
