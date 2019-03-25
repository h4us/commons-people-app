import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../../user.service';
import { ProfileValidatorService } from '../../profile-validator.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {
  title: string = '';
  field: string = '';
  pForm: FormGroup;
  private touched: boolean = false;
  private lastCommit: any;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private pvService: ProfileValidatorService,
  ){
    page.actionBarHidden = true;

    this.pForm = pvService.sendForm;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const fld: string = <string>params.field;
        this.title = fld;
        this.field = fld;
      });

    this.lastCommit = this.pForm.value;
  }

  ngOnDestroy() {
    if (!this.touched) {
      this.pForm.patchValue(this.lastCommit);
    }
  }

  onValidate() {
  }

  submit() {
    if (['firstName', 'lastName', 'description', 'location'].includes(this.field)) {
      const _data: any = {}
      for (let k in this.pForm.value) {
        if (['firstName', 'lastName', 'description', 'location'].includes(k)) {
          Object.assign(_data, {[k]: this.pForm.value[k]});
        }
      }
      this.userService.updateUserInfo(_data)
        .subscribe((data) => {
          this.touched = true;
          this.routerExt.backToPreviousPage();
        });
    } else if (['emailAddress', 'password'].includes(this.field)) {
      //
      console.log('mail-base update');
      //
    } else if (this.field == 'status') {
      this.userService.updateUserInfo({ status: this.pForm.get('status').value }, 'status')
        .subscribe((data) => {
          this.touched = true;
          this.routerExt.backToPreviousPage();
        });
    } else if (this.field == 'username') {
      this.userService.updateUserInfo({ username: this.pForm.get('username').value }, 'username')
        .subscribe((data) => {
          this.touched = true;
          this.routerExt.backToPreviousPage();
        });
    }
  }
}
