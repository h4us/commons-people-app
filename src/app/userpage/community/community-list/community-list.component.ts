import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogParams, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../../user.service';
import { CommunityValidatorService } from '../../community-validator.service';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit, OnDestroy {
  title: string = 'コミュニティの切り替え';
  addOnly: boolean = false;

  constructor(
    private page: Page,
    private aRoute: ActivatedRoute,
    private routerExt: RouterExtensions,
    private dParams: ModalDialogParams,
    private userService: UserService,
    private cvService: CommunityValidatorService,
  ) {
    page.actionBarHidden = true;

    // w/ modal action
    if ((dParams.context && dParams.context.forNewbie) ||
        (dParams.context && dParams.context.addOnly)) {
      this.addOnly = true;
    }
  }

  ngOnInit() {
    this.cvService.addOnlyMode = this.addOnly;

    this.routerExt.navigate([{
      outlets: {
        communityeditor: ['community', (this.addOnly ? 'edit' : 'switch')]
      }
    }], {
      relativeTo: this.aRoute,
      queryParams: { addOnly: this.addOnly }
    });
  }

  ngOnDestroy() {

  }
}
