import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { switchMap } from 'rxjs/operators';

import { ModalProxyService } from '../../modal-proxy.service';
import { TopicValidatorService } from '../../topic-validator.service';
import { UserService, Topic } from '../../../user.service';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})
export class TopicDetailComponent implements OnInit, AfterViewInit {
  topic: Topic;
  community: any;
  isPreview: boolean = false;

  @ViewChild('overlayButtonContainer') ovBcRef: ElementRef;
  @ViewChild('overlayButtonContainerForPreview') ovBcPrevRef: ElementRef;
  @ViewChild('sizeAnchor') anchorRef: ElementRef;
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
        } else {
          // TODO:
          this.topic = this.tvService.sendForm.value;
          this.topic.createdBy = this.userService.getCurrentUser();
          this.topic.createdAt = new Date().toString();
          this.community = this.userService.getCommunity();
          this.isPreview = true;
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
    this.mProxy.request('topic-owner', { whois: who });
  }

  openEditDialog() {
    this.mProxy.request('topic', { edit: this.topic.id });
  }
}
