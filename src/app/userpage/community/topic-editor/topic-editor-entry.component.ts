import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { action } from 'tns-core-modules/ui/dialogs';

import * as imagepicker from 'nativescript-imagepicker';
import { ImagePicker } from 'nativescript-imagepicker';
import * as camera from 'nativescript-camera';
import { Image } from 'tns-core-modules/ui/image';
import { ImageAsset } from 'tns-core-modules/image-asset';

import { UserService } from '../../../user.service';
import { TopicValidatorService } from '../../topic-validator.service';

// TODO:
export class TopicData {
  communityId: number;
  title: string;
  description: string;
  points: number;
  location: string;
  type: string;

  constructor () {
  }
}
// --

@Component({
  selector: 'app-topic-editor-entry',
  templateUrl: './topic-editor-entry.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorEntryComponent implements OnInit {
  title: string = "トピックを作成";

  bottomSize: number = 0;
  tForm: FormGroup;
  selectedType: string = 'GIVE';
  selectedPhoto: ImageAsset;
  imagePickerContext: ImagePicker;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private tvService: TopicValidatorService,
  ) {
    page.actionBarHidden = true;

    tvService.resetData();
    this.tForm = tvService.sendForm;
    this.imagePickerContext = imagepicker.create({ mode: 'single' });
  }

  ngOnInit() {
    this.tForm.patchValue({ type: 'GIVE', communityId: this.userService.currentCommunityId });
    this.bottomSize = layout.toDeviceIndependentPixels(screen.mainScreen.heightPixels - (screen.mainScreen.scale * (screen.mainScreen.scale > 2 ? 260 : 180)));
    this.onValidate();
  }

  closeModal(tLayout: DockLayout) {
    tLayout.closeModal();
  }

  toEdit(field: string = 'test') {
    this.routerExt.navigate([{
      outlets: {
        topiceditor: ['community', 'topic', 'edit', field]
      }
    }], { relativeTo: this.aRoute.parent });
  }

  toSelect(key: string) {
    this.selectedType = key;
    this.tForm.patchValue({ type: key });
  }

  photoDialog() {
    // TODO:
    action({
      cancelButtonText: 'Cancel',
      actions: [
        'Take Photo',
        'Choose Photo',
        'Edit Photo'
      ]
    }).then((which: string) => {
      // Select from image picker
      if (which === 'Choose Photo') {
        this.imagePickerContext
          .authorize()
          .then(() => this.imagePickerContext.present())
          .then((selection) => {
            selection.forEach((selected: ImageAsset) => {
              this.selectedPhoto = selected;
              this.tvService.sendToAsset = selected;
            });
          })
          .catch((err: any) => console.log(err));
      }

      // boot camera
      if (which === 'Take Photo') {
        camera.requestPermissions()
          .then(
            () => {
              camera.takePicture({ width: 600, height: 600, keepAspectRatio: true })
              // camera.takePicture()
                .then((imageAsset: ImageAsset) => {
                  this.selectedPhoto = imageAsset;
                  this.tvService.sendToAsset = imageAsset;
                })
                .catch((err) => console.error(err));
            },
            () => {}
          );
      }

      // edit
      if (which === 'Edit Photo') {
        console.log('TODO: editor');
      }
    })
  }

  onValidate() {
    return this.tForm.valid;
  }

  getCurrent(key): any {
    const c: any = this.tForm.get(key);
    return c ? c.value : '';
  }

  preview() {
    this.routerExt.navigate([{
      outlets: {
        topiceditor: ['community', 'topic', 'preview']
      }
    }], { relativeTo: this.aRoute.parent });
  }
}
