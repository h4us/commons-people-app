import { Component, OnInit } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

@Component({
  selector: 'app-thread-editor',
  templateUrl: './thread-editor.component.html',
  styleUrls: ['./thread-editor.component.scss']
})
export class ThreadEditorComponent implements OnInit {
  title: string = "リストから削除";

  bottomSize: number = 0;

  constructor(
    private page: Page,
    private router: RouterExtensions
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.bottomSize = layout.toDeviceIndependentPixels(screen.mainScreen.heightPixels - (screen.mainScreen.scale * (screen.mainScreen.scale > 2 ? 260 : 180)));
  }

  closeModal(layout: AbsoluteLayout) {
    layout.closeModal();
  }

  ok(layout: AbsoluteLayout) {
    layout.closeModal();
  }
}
