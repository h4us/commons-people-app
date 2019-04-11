import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import * as fs from 'tns-core-modules/file-system';

import { UserService, User } from '../../../user.service';

import { confirm as nsConfirm } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'app-profile-etc',
  templateUrl: './profile-etc.component.html',
  styleUrls: ['./profile-etc.component.scss']
})
export class ProfileEtcComponent implements OnInit {
  title: string = 'その他';
  field: string;
  resourceHtml: string;

  labelsForPage = {
    agreement: {
      title: '利用規約',
    },

    deleteAcount: {
      title: 'アカウントの削除',
    },
  };

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const fld: string = <string>params.field;
        if (fld) {
          this.title = this.labelsForPage[fld].title;
          this.field = fld;

          const _assets = fs.knownFolders.currentApp().getFolder('assets');
          _assets.getFile(`${this.field}.html`).readText()
            .then((content) => {
              // console.log(content);
              // const msg = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
              this.resourceHtml = `<div style="font-family:NotoSansJP Regular, NotoSansJP-Regular, Noto Sans JP Regular; margin:0; line-height:1.2; font-size:16;">
${content}
</div>`;
            })
            .catch((err) => console.error(err));
        }
      });
  }

  gotoChild(child: string) {

    this.routerExt.navigate([{
      outlets: {
        userpage: ['profile', 'etc', child]
      }
    }], {
      relativeTo: this.aRoute.parent
    });
  }

  deleteAccount () {
    let options = {
      title: 'アカウントの削除',
      message: 'ほんとうにアカウントを削除してよろしいですか？',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      neutralButtonText: 'キャンセル'
    };

    nsConfirm(options)
      .then((result: boolean) => {
        if (result) {
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
      });
  }

}
