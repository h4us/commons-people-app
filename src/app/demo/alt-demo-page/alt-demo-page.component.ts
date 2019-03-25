import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AnimationCurve } from 'tns-core-modules/ui/enums';

import { ThreadEditorComponent } from '../../userpage/message/thread-editor/thread-editor.component';

@Component({
  selector: 'app-alt-demo-page',
  templateUrl: './alt-demo-page.component.html',
  styleUrls: ['./alt-demo-page.component.scss']
})
export class AltDemoPageComponent implements OnInit {
  title: string = 'alt demo';

  constructor(
    private router: RouterExtensions,
    private page: Page,
    private aRoute: ActivatedRoute,
    private vcRef: ViewContainerRef,
    private modalService: ModalDialogService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  onNextTap() {
    this.router.navigate([{
      outlets: {
        extOutlet: ['moredemo']
      }
    }], {
      relativeTo: this.aRoute.parent,
      transition: { name: 'slideTop', duration:300, curve: AnimationCurve.cubicBezier(0.3, 0.1, 0, 0.875) }
    });

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

  onFabTap() {
    const parentView = this.vcRef.element.nativeElement;
    console.log(parentView, parentView.ngAppRoot);

    const options: ModalDialogOptions = {
      fullscreen: true,
      // stretched: true,
      viewContainerRef: this.vcRef
    };

    this.modalService.showModal(ThreadEditorComponent, options);
  }
}
