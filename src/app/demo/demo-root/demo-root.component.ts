import {
  Component, OnInit, AfterViewInit,
  ElementRef, ViewContainerRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen, isIOS } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import * as application from 'tns-core-modules/application';

import { ThreadEditorComponent } from '../../userpage/message/thread-editor/thread-editor.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo-root.component.html',
  styleUrls: ['./demo-root.component.scss']
})
export class DemoRootComponent implements OnInit, AfterViewInit {
  srcData: string = `data.json`;
  lottie: boolean = true;
  ltCalcWidth: number = 70;

  @ViewChild('lottieViewContainer') ltContainer: ElementRef;
  @ViewChild('lottieView') lt: ElementRef;

  constructor(
    private router: RouterExtensions,
    private modalService: ModalDialogService,
    private page: Page,
    private vcRef: ViewContainerRef,
    private aRoute: ActivatedRoute,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    // this.router.navigate([{
    //   outlets: {
    //     extOutlet: ['altdemo']
    //   }
    // }], { relativeTo: this.aRoute });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const lCW = this.ltContainer.nativeElement.getMeasuredWidth() / screen.mainScreen.scale;
      const lW = this.lt.nativeElement.getMeasuredWidth() / screen.mainScreen.scale;
      let safeAreaSpan: number = 0;
      if (isIOS) {
        if (application.ios.window.safeAreaInsets) {
          safeAreaSpan = <number>application.ios.window.safeAreaInsets.top + <number>application.ios.window.safeAreaInsets.bottom;
        }
      }

      console.log(safeAreaSpan, lW, lCW, screen.mainScreen.heightDIPs - (safeAreaSpan), screen.mainScreen.scale);

      this.ltCalcWidth = 64.853 * (320 / lCW);
      // this.ltCalcWidth = 76 * (375 / lCW);
    }, 100);
  }

  onFabTap() {
    this.lottie = !this.lottie;
    console.log('change lottie visibility', this.lottie);
    // const options: ModalDialogOptions = {
    //   fullscreen: true,
    //   viewContainerRef: this.vcRef
    // };

    // this.modalService.showModal(ThreadEditorComponent, options);
  }

  onExtTap() {
    // this.router.navigate([{
    //   outlets: {
    //     extOutlet: ['altdemo']
    //   }
    // }], { relativeTo: this.aRoute });
  }
}
