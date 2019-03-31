import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen, isIOS } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import * as application from 'tns-core-modules/application';

import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as fs from 'tns-core-modules/file-system';
import * as bgHttp from 'nativescript-background-http';

import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ModalProxyService } from '../../modal-proxy.service';
import { TopicValidatorService } from '../../topic-validator.service';
import { UserService, Topic } from '../../../user.service';

import { TrayService } from '../../../shared/tray.service'

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})
export class TopicDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  topic: Topic;
  community: any;
  session: any;
  docPath: string;
  tasks: bgHttp.Task[];

  isPreview: boolean = false;
  isCreated: boolean = false;

  @ViewChild('topicDetail') rootLayoutRef: ElementRef;
  @ViewChild('overlayButtonContainer') ovBcRef: ElementRef;
  @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
  rootLayout: AbsoluteLayout;
  ovBc: GridLayout;
  anchor: StackLayout;

  tNotifySubscription: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private pageRoute: PageRoute,
    private userService: UserService,
    private tvService: TopicValidatorService,
    private trayService: TrayService,
    private page: Page,
    private aRoute: ActivatedRoute,
    private mProxy: ModalProxyService,
  ) {
    page.actionBarHidden = true;
    page.backgroundSpanUnderStatusBar = true; // ...?
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const desireId: number = <number>params.id;

        if (desireId && desireId > -1) {
          this.userService.getTopic(desireId).subscribe((data: any) => {
            this.topic = data;
            this.community = this.userService.getCommunity(this.topic.communityId);
          });

          // this.snackBar.isShown = false;
        } else {
          this.topic = this.tvService.sendForm.value;
          this.topic.createdBy = this.userService.getCurrentUser();
          this.topic.createdAt = this.tvService.originalCreated;

          this.session = bgHttp.session('image-upload');
          this.docPath = fs.path.normalize(`${fs.knownFolders.documents().path}`);
          this.tasks = [];

          if (this.tvService.originalPhoto) {
            this.topic.photoUrl = this.tvService.originalPhoto;
          } else if (this.tvService.sendToAsset) {
            if (this.tvService.sendToAsset instanceof ImageAsset) {
              let source = new ImageSource();
              source.fromAsset(this.tvService.sendToAsset)
                .then((source: ImageSource) => {
                  const now: number = Date.now()
                  const success: boolean = source.saveToFile(`${this.docPath}/ad-${now}.png`, 'png');
                  this.topic.photoUrl = `${this.docPath}/ad-${now}.png`;
                })
            } else {
              this.topic.photoUrl = this.tvService.sendToAsset;
            }
          }

          this.community = this.userService.getCommunity();
          //
          this.isPreview = true;
          this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;

          this.registerSnackbarActions();
        }
        //
      });

    this.ovBc = <GridLayout>this.ovBcRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBc, aH - (this.ovBc.getMeasuredHeight() / screen.mainScreen.scale));
    }, 100);

    if (this.isPreview) {
      this.trayService.request('snackbar/topiceditor', 'open', {
        doneMessage: '作成しています..',
        cancelAsClose: false
        // autoNextStep: false
      });
    }
  }

  ngOnDestroy() {
    if(this.tNotifySubscription) {
      console.log('clear subscription @topiceditor');
      this.trayService.request('snackbar/topiceditor', 'close');
      this.tNotifySubscription.unsubscribe();
    }
  }

  registerSnackbarActions() {
    this.tNotifySubscription = this.trayService.notifyToUser$
      .subscribe((data: any) => {
        console.log('@topiceditor', data);

        if (data[0] == 'snackbar/topiceditor') {
          switch (data[1]) {
            case 'approveOrNext':
              this.onConfirm();
              break;
            case 'cancelOrBack':
              this.cancelAction();
              break;
            default:
              break;
          }
        }
      });
  }

  openMessageDialog(topic?: any) {
    this.userService.tapTopicMessageThread(topic.id).subscribe(
      (data) => {
        this.routerExt.navigate(['../../../message/log', data.id], {
          relativeTo: this.aRoute
        });
      },
      (err) => console.error(err)
    );
  }

  openProfileDialog(who?: number) {
    if (!this.isPreview) {
      this.mProxy.request('topic-owner', { whois: who });
    }
  }

  openEditDialog() {
    if (!this.isPreview) {
      this.mProxy.request('topic', { edit: this.topic });
    }
  }

  cancelAction() {
    if (this.isPreview && this.isCreated) {
      this.rootLayout.closeModal();
    } else {
      this.routerExt.backToPreviousPage();
    }
  }

  /*
   * preview mode only
   */
  // TODO:
  onConfirm() {
    if (this.tvService.sendForm.valid) {
      let req: Observable<any>;
      if (this.tvService.editTo) {
        req = this.userService.updateTopic(this.tvService.editTo, this.tvService.sendForm.value)
      } else {
        req = this.userService.createTopic(this.tvService.sendForm.value);
      }

      req.subscribe((ret) => {
        console.log('created new topic', ret);

        if (this.tvService.sendToAsset && this.topic.photoUrl) {
          console.log('... and upload image', ret);

          const request = {
            url: `${this.userService.endpoint}/ads/${ret.id}/photo`,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              'File-Name': 'photo',
            },
            // androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: 'Uploading image session by commonsapp',
          };
          let task: bgHttp.Task;
          let lastEvent = '';
          const params = [
            { name: 'photo', filename: this.topic.photoUrl, mimeType: 'image/png' }
          ];
          task = this.session.multipartUpload(params, request);
          task.on('progress', (e) => {
            console.log(e);
          });
          this.tasks.push(task);
        }

        this.isCreated = true;

        // done.
        this.trayService.request('snackbar/', 'open', {
          isApproved: true,
          step: 1,
          doneMessage: 'トピックを作成しました'
        });

        this.forceClose();
      });
    } else {
      //
      console.log('validation error')
    }
  }

  cancelConfirm() {
    this.routerExt.backToPreviousPage();
  }

  forceClose() {
    //
    this.rootLayout.closeModal();
  }
  /*
   * --
   */
}
