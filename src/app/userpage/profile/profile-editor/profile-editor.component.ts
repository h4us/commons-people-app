import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { Subscription } from 'rxjs';
// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../../user.service';
import { TrayService } from '../../../shared/tray.service';
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

  fieldIsValid: boolean;
  firstError: any;

  private touched: boolean = false;
  private edited: boolean = false;

  private lastCommit: any;

  private pfSub: Subscription;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private trayService: TrayService,
    private pvService: ProfileValidatorService,
  ){
    page.actionBarHidden = true;

    this.pForm = pvService.sendForm;

    this.pfSub = pvService.sendForm.valueChanges.subscribe((changes: any) => {
      if (!this.touched) {
        this.touched = true;
      }

      this.fieldIsValid = this.pForm.get(this.field).valid;
      this.firstError = this.pForm.get(this.field).errors ?
        {
          [Object.keys(this.pForm.get(this.field).errors)[0]] : this.pForm.get(this.field).errors[Object.keys(this.pForm.get(this.field).errors)[0]]
        } : null;
    });
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
    this.pfSub.unsubscribe();

    if (!this.edited) {
      this.pForm.patchValue(this.lastCommit);
    } else {
      this.trayService.request('snackbar/', 'open', {
        step: 1, isApproved: true,
        doneMessage: `${this.field} edited.`
      });
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
          this.edited = true;
          this.routerExt.backToPreviousPage();
        });
    } else if (['emailAddress', 'password'].includes(this.field)) {
      //
      console.log('mail-base update');
      //
    } else if (this.field == 'status') {
      this.userService.updateUserInfo({ status: this.pForm.get('status').value }, 'status')
        .subscribe((data) => {
          this.edited = true;
          this.routerExt.backToPreviousPage();
        });
    } else if (this.field == 'username') {
      this.userService.updateUserInfo({ username: this.pForm.get('username').value }, 'username')
        .subscribe((data) => {
          this.edited = true;
          this.routerExt.backToPreviousPage();
        });
    }
  }
}
