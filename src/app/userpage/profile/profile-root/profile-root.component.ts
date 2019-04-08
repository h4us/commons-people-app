import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { action } from 'tns-core-modules/ui/dialogs';
import { isIOS } from 'tns-core-modules/platform';

import { ListViewEventData } from 'nativescript-ui-listview';
import * as imagepicker from 'nativescript-imagepicker';
import { ImagePicker } from 'nativescript-imagepicker';
import * as camera from 'nativescript-camera';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as fs from 'tns-core-modules/file-system';
import * as bgHttp from 'nativescript-background-http';
import * as nsHttp from 'tns-core-modules/http';

import { ImageCropper, OptionsCommon }  from 'nativescript-imagecropper';

import { UserService, User } from '../../../user.service';
import { SystemTrayService } from '../../../system-tray.service';
import { ModalProxyService } from '../../modal-proxy.service';
import { ProfileValidatorService } from '../../profile-validator.service';


@Component({
  selector: 'app-profile-root',
  templateUrl: './profile-root.component.html',
  styleUrls: ['./profile-root.component.scss']
})
export class ProfileRootComponent implements OnInit, OnDestroy {
  currentList: any[];

  user: User;
  pForm: FormGroup;
  tSubs: Subscription;

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
    private trayService: SystemTrayService,
    private pvService: ProfileValidatorService,
  ) {
    page.actionBarHidden = true;

    // this.pvService.resetData();
    // this.pForm = pvService.sendForm;
    // this.imagePickerContext = imagepicker.create({ mode: 'single' });
    // this.session = bgHttp.session('image-upload');
  }

  ngOnInit() {
    this.pvService.resetData();
    this.pForm = this.pvService.sendForm;
    this.imagePickerContext = imagepicker.create({ mode: 'single' });
    this.session = bgHttp.session('image-upload');

    this.user = this.userService.getCurrentUser();
    this.currentList = this.userService.getCommunities();

    this.docPath = fs.path.normalize(`${fs.knownFolders.documents().path}`);

    this.tSubs = this.trayService.notifyToUser$.subscribe((data: any) => {
      if (data && data.length > 1 && data[0] == 'snackbar/') {
        if (data[1] == 'approveOrNext') {

          this.trayService.lockUserpageArea();

          this.userService.logout().subscribe(
            () => {},
            (err) => {
              console.error(err, '..force logout');
              this.routerExt.navigate([''], {
                clearHistory: true
              });
            },
            () => {
              setTimeout(() => {
                this.trayService.request('snackbar/', 'close', { waitFor: 'logout' });
              }, 1500);
            }
          );
        }

        if (data[1] == 'disposeAnimationDone' && data.length > 2) {
          if (data[2].waitFor && data[2].waitFor == 'logout') {
            this.routerExt.navigate([''], {
              clearHistory: true
            })
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.tSubs.unsubscribe();
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
      actions: (!this.selectedPhoto  && !this.user.avatarUrl) ? [ 'Take Photo', 'Choose Photo' ] : [ 'Take Photo', 'Choose Photo', 'Edit Photo' ]
    }).then((which: string) => {
      // Select from image picker
      if (which === 'Choose Photo') {
        this.imagePickerContext
          .authorize()
          .then(() => this.imagePickerContext.present())
          .then((selection) => {
            selection.forEach((selected: any) => {
              // 1.
              // this.selectedPhoto = selected;

              let source = new ImageSource();
              source.fromAsset(selected).then((isource: ImageSource) => {
                // --
                if (isIOS) { this.trayService.hideNavigation(); }
                // --
                const imageCropper = new ImageCropper();
                imageCropper.show(isource, { width: 800, height: 800, lockSquare: true })
                  .then((args: any) => {
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

                    // --
                    if (isIOS) {
                      setTimeout(() => {
                        this.trayService.showNavigation();
                      }, 500)
                    }
                    // --
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
                  // this.selectedPhoto = imageAsset;

                  let source = new ImageSource();
                  source.fromAsset(imageAsset).then((isource: ImageSource) => {
                    // --
                    if (isIOS) { this.trayService.hideNavigation(); }
                    // --

                    const imageCropper = new ImageCropper();
                    imageCropper.show(isource, { width: 800, height: 800, lockSquare: true })
                      .then((args: any) => {
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

                        // --
                        if (isIOS) {
                          setTimeout(() => {
                            this.trayService.showNavigation();
                          }, 500)
                        }
                        // --
                      })
                      .catch((e) => console.error('cropper error', e));

                  }).catch((err) => console.error('resource serror', err));
                })
                .catch((err) => console.error('photo error', err));
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
        } else if(this.user.avatarUrl) {
          p = nsHttp.getImage(this.user.avatarUrl);
        } else {
          // ?
          return;
        }

        p.then((isource: unknown) => {
          const src: ImageSource = typeof isource == 'boolean' ? source : <ImageSource>isource;
          const imageCropper = new ImageCropper();
          // TODO: android lockSquare not work..
          const opt: OptionsCommon = isIOS ? { width: src.width, height: src.height, lockSquare: true } : null;

          // --
          if (isIOS) { this.trayService.hideNavigation(); }
          // --

          imageCropper.show(src, opt)
            .then((args: any) => {
              if(args.image !== null){
                const croppedImage: ImageSource = args.image;
                const pngfile: string = `${this.docPath}/face-${Date.now()}.png`;
                const success: boolean = croppedImage.saveToFile(pngfile, 'png');

                this.selectedPhoto = pngfile;

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

              // --
              if (isIOS) {
                setTimeout(() => {
                  this.trayService.showNavigation();
                }, 500)
              }
              // --
            })
            .catch((e) => console.error('cropper error', e));
        });

      }
    });
  }

  logout () {
    this.trayService.request('snackbar/', 'open', {
      approveMessage: 'サインアウトしますか？',
      doneMessage: 'サインアウトしています...',
      canUserDisposable: false
    });
  }

  toChildPage() {
    this.routerExt.navigate([`../profile/etc`], {
      relativeTo: this.aRoute
    });
  }
}
