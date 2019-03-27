import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ThreadEditorComponent } from '../../userpage/message/thread-editor/thread-editor.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo-root.component.html',
  styleUrls: ['./demo-root.component.scss']
})
export class DemoRootComponent implements OnInit {

  @ViewChild('floatingButton') fbtn: ElementRef;
  fbtnEl: Button;

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
    this.router.navigate([{
      outlets: {
        extOutlet: ['altdemo']
      }
    }], { relativeTo: this.aRoute });
  }

  onFabTap() {
    const options: ModalDialogOptions = {
      fullscreen: true,
      viewContainerRef: this.vcRef
    };

    this.modalService.showModal(ThreadEditorComponent, options);
  }

  onExtTap() {
    this.router.navigate([{
      outlets: {
        extOutlet: ['altdemo']
      }
    }], { relativeTo: this.aRoute });
  }
}
