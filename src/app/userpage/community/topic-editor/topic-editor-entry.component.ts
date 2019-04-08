import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { action } from 'tns-core-modules/ui/dialogs';
import { isIOS } from 'tns-core-modules/platform';

import * as imagepicker from 'nativescript-imagepicker';
import { ImagePicker } from 'nativescript-imagepicker';
import * as camera from 'nativescript-camera';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as fs from 'tns-core-modules/file-system';
import * as nsHttp from 'tns-core-modules/http';

import { ImageCropper, OptionsCommon }  from 'nativescript-imagecropper';

import { UserService } from '../../../user.service';
import { TopicValidatorService } from '../../topic-validator.service';

@Component({
  selector: 'app-topic-editor-entry',
  templateUrl: './topic-editor-entry.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorEntryComponent implements OnInit {
  title: string = "トピックを編集";

  bottomSize: number = 0;
  tForm: FormGroup;
  selectedType: string = 'GIVE';
  selectedPhoto: ImageAsset | string;
  imagePickerContext: ImagePicker;
  docPath: string;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tvService: TopicValidatorService,
  ) {
    page.actionBarHidden = true;

    this.tForm = tvService.sendForm;
    this.imagePickerContext = imagepicker.create({ mode: 'single' });
  }

  ngOnInit() {
    if (this.router.url.indexOf('topic/new') > -1) {
      this.tForm.patchValue({ type: 'GIVE', communityId: this.userService.currentCommunityId });
      this.title = "トピックを作成";
    } else {
      console.log(this.tvService.originalPhoto, this.tvService.originalCreated);
      if (this.tvService.originalPhoto) {
        this.selectedPhoto = this.tvService.originalPhoto;
      }
    }

    this.docPath = fs.path.normalize(`${fs.knownFolders.documents().path}`);
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
      actions: !this.selectedPhoto ? [ 'Take Photo', 'Choose Photo' ] : [ 'Take Photo', 'Choose Photo', 'Edit Photo' ]
    }).then((which: string) => {
      // Select from image picker
      if (which === 'Choose Photo') {
        this.imagePickerContext
          .authorize()
          .then(() => this.imagePickerContext.present())
          .then((selection) => {
            selection.forEach((selected: ImageAsset) => {
              // this.selectedPhoto = selected;
              // this.tvService.sendToAsset = selected;

              let source = new ImageSource();
              source.fromAsset(selected).then((isource: ImageSource) => {
                const imageCropper = new ImageCropper();
                imageCropper.show(isource, { width: 800, height: 800 })
                  .then((args: any) => {
                    if(args.image !== null){
                      const croppedImage: ImageSource = args.image;
                      const now: number = Date.now();
                      const success: boolean = croppedImage.saveToFile(`${this.docPath}/ad-${now}.png`, 'png');
                      this.selectedPhoto = `${this.docPath}/ad-${now}.png`;
                      this.tvService.sendToAsset = `${this.docPath}/ad-${now}.png`
                    }
                  })
                  .catch((e) => console.error('cropper error', e));
              });
            });
          })
          .catch((err: any) => console.error(err));
      }

      // boot camera
      if (which === 'Take Photo') {
        camera.requestPermissions()
          .then(
            () => {
              // camera.takePicture()
              camera.takePicture({ width: 800, height: 800, keepAspectRatio: true })
                .then((imageAsset: ImageAsset) => {
                  // this.selectedPhoto = imageAsset;
                  // this.tvService.sendToAsset = imageAsset;

                  let source = new ImageSource();
                  source.fromAsset(imageAsset).then((isource: ImageSource) => {
                    const imageCropper = new ImageCropper();
                    imageCropper.show(isource, { width: 800, height: 800 })
                      .then((args: any) => {
                        if(args.image !== null){
                          const croppedImage: ImageSource = args.image;
                          const now: number = Date.now();
                          const success: boolean = croppedImage.saveToFile(`${this.docPath}/ad-${now}.png`, 'png');
                          // 2.
                          this.selectedPhoto = `${this.docPath}/ad-${now}.png`;
                          this.tvService.sendToAsset = `${this.docPath}/ad-${now}.png`;
                        }
                      })
                      .catch((e) => console.error('cropper error', e));
                  });

                })
                .catch((err) => console.error(err));
            },
            () => {}
          );
      }

      // edit
      if (which === 'Edit Photo') {
        let source = new ImageSource();
        let p: Promise<unknown>;

        if (this.selectedPhoto && typeof this.selectedPhoto == 'string' && this.selectedPhoto.indexOf('http') != 0) {
          p = source.fromFile(this.selectedPhoto);
        } else if (typeof this.selectedPhoto == 'string' && this.selectedPhoto.indexOf('http') == 0) {
          p = nsHttp.getImage(this.selectedPhoto);
        } else {
          console.error(this.selectedPhoto, 'format error');
          return;
        }

        p.then((isource: unknown) => {
          const src: ImageSource = typeof isource == 'boolean' ? source : <ImageSource>isource;
          const imageCropper = new ImageCropper();
          // TODO: android lockSquare not work..
          const opt: OptionsCommon = isIOS ? { width: src.width, height: src.height, lockSquare: true } : null;
          imageCropper.show(src, opt)
            .then((args: any) => {
              if(args.image !== null){
                const croppedImage: ImageSource = args.image;
                const now: number = Date.now();
                const success: boolean = croppedImage.saveToFile(`${this.docPath}/ad-${now}.png`, 'png');

                this.selectedPhoto = `${this.docPath}/ad-${now}.png`;
                this.tvService.sendToAsset = `${this.docPath}/ad-${now}.png`;
              }
            })
            .catch((e) => console.error('cropper error', e));
        });

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
