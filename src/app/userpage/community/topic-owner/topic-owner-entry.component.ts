import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';

import { UserService } from '../../../user.service';
import { ModalProxyService } from '../../modal-proxy.service';

@Component({
  selector: 'app-topic-owner-entry',
  templateUrl: './topic-owner-entry.component.html',
  styleUrls: ['./topic-owner.component.scss']
})
export class TopicOwnerEntryComponent implements OnInit {
  title: string = 'プロフィール';
  userId: number;
  profile: any;

  constructor(
    private page: Page,
    private pageRoute: PageRoute,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private mProxy: ModalProxyService,
  ) {
    page.actionBarHidden = true;

    // if (dParams.context) {
    //   this.userId = dParams.context.whois;
    // }
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const userId: number = <number>params.id;
        this.userId = userId;
        this.userService.getUserDetail(this.userId).subscribe((data) => {
          this.profile = data;
        })
      });
  }

  closeModal(tLayout: DockLayout | GridLayout | AbsoluteLayout) {
    tLayout.closeModal();
  }

  sendPoint() {
    this.routerExt.navigate([{
      outlets: {
        topicowner: (['community', 'topic', 'owner', this.userId, 'send'])
      }
    }], { relativeTo: this.aRoute.parent });

    // this.mProxy.request('send-point');
  }
}
