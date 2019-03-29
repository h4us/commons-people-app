import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { action } from 'tns-core-modules/ui/dialogs';

import { ListViewEventData } from 'nativescript-ui-listview';
import * as imagepicker from 'nativescript-imagepicker';
import { ImagePicker } from 'nativescript-imagepicker';
import * as camera from 'nativescript-camera';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as fs from 'tns-core-modules/file-system';
import * as bgHttp from 'nativescript-background-http';

import { ImageCropper }  from 'nativescript-imagecropper';

import { UserService, User } from '../../../user.service';
import { ProfileValidatorService } from '../../profile-validator.service';


@Component({
  selector: 'app-profile-root',
  templateUrl: './profile-root.component.html',
  styleUrls: ['./profile-root.component.scss']
})
export class ProfileRootComponent implements OnInit {
  currentList: any[];

  user: User;
  pForm: FormGroup;

  docPath: any;
  session: any;
  tasks: bgHttp.Task[] = [];

  selectedPhoto: ImageAsset | string;
  imagePickerContext: ImagePicker;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private page: Page,
    private userService: UserService,
    private pvService: ProfileValidatorService,
  ) {
    page.actionBarHidden = true;

    this.pForm = pvService.sendForm;
    this.imagePickerContext = imagepicker.create({ mode: 'single' });
    this.session = bgHttp.session('image-upload');
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.currentList = this.userService.getCommunities();

    this.docPath = fs.path.normalize(`${fs.knownFolders.documents().path}`);
    console.log(this.docPath);
  }

  toEdit(field:string) {
    this.routerExt.navigate([`../profile/edit`, field], {
      relativeTo: this.aRoute
    });
  }

  gotoCommunityPage(args: any) {
    this.userService.switchCommunity(args.id);
    this.routerExt.navigate([{
      outlets: { userpage: [ 'community' ] }
    }], {
      relativeTo: this.aRoute.parent
    });
  }

  getCurrent(key): any {
    const c: any = this.pForm.get(key);
    let ret = c ? c.value : '';
    return (key === 'password') ? ret.replace(/./g, '·') : ret;
  }

  getAvatar() {
    // TODO:
    return this.selectedPhoto || (this.user.avatarUrl  || '~/assets/placeholder__user@2x.png');
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
            selection.forEach((selected: any) => {
              // 1.
              this.selectedPhoto = selected;

              let source = new ImageSource();
              source.fromAsset(selected).then((isource: ImageSource) => {
                const imageCropper = new ImageCropper();
                imageCropper.show(isource, { width: 800, height: 800 })
                  .then((args: any) => {
                    console.log(args)
                    if(args.image !== null){
                      const croppedImage: ImageSource = args.image;
                      const pngfile: string = `${this.docPath}/face-${Date.now()}.png`;
                      const success: boolean = croppedImage.saveToFile(pngfile, 'png');
                      // 2.
                      this.selectedPhoto = pngfile;
                      //
                      const request = {
                        url: `${this.userService.endpoint}/users/${this.user.id}/avatar`,
                        method: 'POST',
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          'File-Name': 'photo',
                        },
                        description: '',
                        androidAutoDeleteAfterUpload: false,
                        androidNotificationTitle: 'commonsapp HTTP background',
                      };
                      let task: bgHttp.Task;
                      let lastEvent = '';
                      const params = [
                        { name: 'photo', filename: pngfile, mimeType: 'image/png' }
                      ];
                      task = this.session.multipartUpload(params, request);
                      task.on('progress', (e) => {
                        console.log(e);
                      });
                      this.tasks.push(task);
                    }
                  })
                  .catch((e) => console.error('cropper error', e));
              });

            });
          })
          .catch((err: any) => console.log('picker error', err));
      }

      // boot camera
      if (which === 'Take Photo') {
        camera.requestPermissions()
          .then(
            () => {
              // camera.takePicture()
              camera.takePicture({ width: 800, height: 800, keepAspectRatio: true })
                .then((imageAsset: ImageAsset) => {
                  // 1.
                  this.selectedPhoto = imageAsset;

                  let source = new ImageSource();
                  source.fromAsset(imageAsset).then((isource: ImageSource) => {
                    const imageCropper = new ImageCropper();
                    imageCropper.show(isource, { width: 800, height: 800 })
                      .then((args: any) => {
                        console.log(args)
                        if(args.image !== null){
                          const croppedImage: ImageSource = args.image;
                          const pngfile: string = `${this.docPath}/face.png`;
                          const success: boolean = croppedImage.saveToFile(pngfile, 'png');
                          // 2.
                          this.selectedPhoto = pngfile;
                          //
                          const request = {
                            url: `${this.userService.endpoint}/users/${this.user.id}/avatar`,
                            method: 'POST',
                            headers: {
                              'Content-Type': 'multipart/form-data',
                              'File-Name': 'photo',
                            },
                            description: '',
                            androidAutoDeleteAfterUpload: false,
                            androidNotificationTitle: 'commonsapp HTTP background',
                          };
                          let task: bgHttp.Task;
                          let lastEvent = '';
                          const params = [
                            { name: 'photo', filename: pngfile, mimeType: 'image/png' }
                          ];
                          task = this.session.multipartUpload(params, request);
                          task.on('progress', (e) => {
                            console.log(e);
                          });
                          this.tasks.push(task);
                        }
                      })
                      .catch((e) => console.error('cropper error', e));

                    // const success: boolean = source.saveToFile(`${this.docPath}/test2.png`, 'png');
                    // console.log('saved?', success);

                    // //
                    // const request = {
                    //   // url: 'http://192.168.11.7:8080',
                    //   url: `${this.userService.endpoint}/users/${this.user.id}/avatar`,
                    //   method: 'POST',
                    //   headers: {
                    //     // 'Content-Type': 'application/octet-stream',
                    //     'Content-Type': 'multipart/form-data',
                    //     'File-Name': 'photo',
                    //   },
                    //   description: 'test',
                    //   androidAutoDeleteAfterUpload: false,
                    //   androidNotificationTitle: 'NativeScript HTTP background',
                    // };
                    // let task: bgHttp.Task;
                    // let lastEvent = '';
                    // const params = [
                    //   { name: 'photo', filename: `${this.docPath}/test2.png`, mimeType: 'image/png' }
                    // ];
                    // task = this.session.multipartUpload(params, request);
                    // task.on('progress', (e) => {
                    //   console.log(e);
                    // });
                    // this.tasks.push(task);
                    // //
                  }).catch((err) => console.error('resource serror', err));
                })
                .catch((err) => console.error('photo error', err));
            },
            () => {}
          );
      }

      // edit
      if (which === 'Edit Photo') {
        console.log('TODO: editor');
      }
    });
  }

  logout () {
    this.userService.logout().subscribe(
      (data: any) => {
        console.log('logout..', data);
      },
      (err) => {
        console.error(err, '..force logout');
        this.routerExt.navigate([''], {
          clearHistory: true
        });
      },
      () => this.routerExt.navigate([''], {
        clearHistory: true
      })
    );
  }

  deleteAccount () {
    this.userService.deleteAccount().subscribe(
      (data: any) => {
        console.log('logout..', data);
      },
      (err) => {
        console.error(err, '..force logout');
        this.routerExt.navigate([''], {
          clearHistory: true
        });
      },
      () => this.routerExt.navigate([''], {
        clearHistory: true
      })
    );
  }

}
