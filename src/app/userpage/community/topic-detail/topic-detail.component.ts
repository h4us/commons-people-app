import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from 'tns-core-modules/image-asset';
import * as fs from 'tns-core-modules/file-system';
import * as bgHttp from 'nativescript-background-http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ModalProxyService } from '../../modal-proxy.service';
import { TopicValidatorService } from '../../topic-validator.service';
import { UserService, Topic } from '../../../user.service';

import { SnackbarLikeComponent } from '../../../shared/snackbar-like/snackbar-like.component';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})
export class TopicDetailComponent implements OnInit, AfterViewInit {
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
  @ViewChild('snackBar') snackBar: SnackbarLikeComponent;
  rootLayout: AbsoluteLayout;
  ovBc: GridLayout;
  ovBcPrev: FlexboxLayout;
  anchor: StackLayout;

  constructor(
    private routerExt: RouterExtensions,
    private pageRoute: PageRoute,
    private userService: UserService,
    private tvService: TopicValidatorService,
    private page: Page,
    private aRoute: ActivatedRoute,
    private mProxy: ModalProxyService,
  ) {
    page.actionBarHidden = true;
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

          this.snackBar.isShown = false;
        } else {
          this.topic = this.tvService.sendForm.value;
          this.topic.createdBy = this.userService.getCurrentUser();
          this.topic.createdAt = this.tvService.originalCreated;

          if (this.tvService.originalPhoto) {
            this.topic.photoUrl = this.tvService.originalPhoto;
          } else if (this.tvService.sendToAsset) {
            let source = new ImageSource();
            source.fromAsset(this.tvService.sendToAsset)
              .then((source: ImageSource) => {
                const success: boolean = source.saveToFile(`${this.docPath}/topic-photo.png`, 'png');
                this.topic.photoUrl = `${this.docPath}/topic-photo.png`;
              })
          }

          this.community = this.userService.getCommunity();
          //
          this.session = bgHttp.session('image-upload');
          this.docPath = fs.path.normalize(`${fs.knownFolders.documents().path}`);
          this.tasks = [];
          //
          this.isPreview = true;
          this.rootLayout = <AbsoluteLayout>this.rootLayoutRef.nativeElement;
        }
        //
      });

    this.ovBc = <GridLayout>this.ovBcRef.nativeElement;
    this.ovBcPrev = <FlexboxLayout>this.ovBcPrevRef.nativeElement;
    this.anchor = <StackLayout>this.anchorRef.nativeElement;
  }

  ngAfterViewInit() {
    // ...
    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBc, aH - (this.ovBc.getMeasuredHeight() / screen.mainScreen.scale));
      AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
    }, 100);
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
      });
    } else {
      //
      console.log('validation error')
    }

    setTimeout(() => {
      const aH = this.anchor.getMeasuredHeight() / screen.mainScreen.scale;
      AbsoluteLayout.setTop(this.ovBcPrev, aH - (this.ovBcPrev.getMeasuredHeight() / screen.mainScreen.scale));
    }, 30);
  }
  cancelConfirm() {
    this.routerExt.backToPreviousPage();
  }
  forceClose() {
    this.snackBar.isShown = false;
    //
    this.rootLayout.closeModal();
  }
  /*
   * --
   */
}
