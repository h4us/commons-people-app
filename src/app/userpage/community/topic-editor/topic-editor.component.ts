import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { ModalDialogParams, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.component.html',
  styleUrls: ['./topic-editor.component.scss'],
})
export class TopicEditorComponent implements OnInit {
  title: string = "トピックを作成";
  srcTopicId: number = -1;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private dParams: ModalDialogParams,
  ) {
    page.actionBarHidden = true;

    if (dParams.context && dParams.context.edit) {
      this.srcTopicId = dParams.context.edit;
      this.title = "トピックを編集";
    }
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        topiceditor: (this.srcTopicId > -1 ? ['community', 'topic', 'edit'] : ['community', 'topic', 'new'])
      }
    }], { relativeTo: this.aRoute });
  }
}
