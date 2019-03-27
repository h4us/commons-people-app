import { Component, OnInit } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

@Component({
  selector: 'app-topic-editor-entry',
  // templateUrl: './topic-editor-entry.component.html',
  // templateUrl: './topic-editor-edit.component.html',
  templateUrl: './topic-editor-edit.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorEditComponent implements OnInit {
  title: string = "トピックを編集";

  bottomSize: number = 0;

  constructor(
    private page: Page,
    private router: RouterExtensions
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    // AbsoluteLayout.setLeft(this.fbtnEl, layout.toDeviceIndependentPixels(screen.mainScreen.widthPixels - (screen.mainScreen.scale * (20 + 60))));
    this.bottomSize = layout.toDeviceIndependentPixels(screen.mainScreen.heightPixels - (screen.mainScreen.scale * (screen.mainScreen.scale > 2 ? 260 : 180)));
  }

  closeModal(tLayout: DockLayout) {
    tLayout.closeModal();
  }

  preview() {
    console.log('preview!');
    // this.router.navigate(['/community', 'topics', -1]);
  }
}
