import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { ModalDialogParams, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { TopicValidatorService } from '../../topic-validator.service';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.component.html',
  styleUrls: ['./topic-editor.component.scss'],
})
export class TopicEditorComponent implements OnInit {
  title: string = "";
  srcTopicId: number = -1;
  srcTopic: any;
  tForm: FormGroup;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private dParams: ModalDialogParams,
    private tvService: TopicValidatorService,
  ) {
    page.actionBarHidden = true;

    //
    tvService.resetData();

    //
    if (dParams.context && dParams.context.edit) {
      this.srcTopic = dParams.context.edit;
      this.tForm = tvService.sendForm;
      this.tForm.patchValue(this.srcTopic);
      tvService.editTo = this.srcTopic.id;
      tvService.originalCreated = this.srcTopic.createdAt;
      tvService.originalPhoto = this.srcTopic.photoUrl;
    }
  }

  ngOnInit() {
    this.routerExt.navigate([{
      outlets: {
        topiceditor: (this.srcTopic ? ['community', 'topic', 'edit'] : ['community', 'topic', 'new'])
      }
    }], { relativeTo: this.aRoute });
  }
}
