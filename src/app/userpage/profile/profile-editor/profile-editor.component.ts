import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

import { Subscription, Observable } from 'rxjs';
// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/platform';

import { UserService } from '../../../user.service';
import { SystemTrayService } from '../../../system-tray.service';
import { ProfileValidatorService } from '../../profile-validator.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string = '';
  field: string = '';
  pForm: FormGroup;

  fieldIsValid: boolean = false;
  confirmIsValid: boolean = true;
  firstError: any;
  firstErrorInConfirm: any;
  isSecure: boolean = true;

  private touched: boolean = false;
  private edited: boolean = false;

  private lastCommit: any;

  private pfSub: Subscription;

  @ViewChild('activeInput') aInput: ElementRef;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private trayService: SystemTrayService,
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
        this.title = this.pvService.labelsForInput[fld].title;
        this.field = fld;
      });

    this.pfSub = this.pvService.sendForm.valueChanges.subscribe((changes: any) => {
      if (!this.touched) {
        this.touched = true;
      }

      this.firstError = this.pForm.get(this.field).errors ?
        {
          [Object.keys(this.pForm.get(this.field).errors)[0]] : this.pForm.get(this.field).errors[Object.keys(this.pForm.get(this.field).errors)[0]]
        } : null;

      if (this.field != 'password' && this.field != 'emailAddress') {
        this.fieldIsValid = this.pForm.get(this.field).valid
      } else {
        //
        this.firstErrorInConfirm = this.pForm.get(`${this.field}Confirm`).errors ?
          {
            [Object.keys(this.pForm.get(`${this.field}Confirm`).errors)[0]] : this.pForm.get(`${this.field}Confirm`).errors[Object.keys(this.pForm.get(`${this.field}Confirm`).errors)[0]]
          } : null;
        //

        this.confirmIsValid = this.pForm.get(`${this.field}Confirm`).value == this.pForm.get(this.field).value;

        this.fieldIsValid = this.pForm.get(this.field).valid
          && this.pForm.get(`${this.field}Confirm`).valid
          && this.confirmIsValid;
      }
    });

    this.lastCommit = this.pForm.value;
  }

  ngAfterViewInit() {
    if (this.field == 'emailAddress' && this.aInput) {
      this.aInput.nativeElement.autocapitalizationType = 'none';
    }
  }

  ngOnDestroy() {
    this.pfSub.unsubscribe();

    if (!this.edited) {
      this.pForm.patchValue(this.lastCommit);
    } else {
      this.trayService.request('snackbar/', 'open', {
        step: 1, isApproved: true,
        doneMessage: `${this.title}を編集しました.`
      });
    }
  }

  onValidate() {
  }

  togglePassword() {
    this.isSecure = !this.isSecure;
  }

  get isIOS(): boolean {
    return isIOS;
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
      let req: Observable<any>;
      if (this.field == 'password') {
        req = this.userService.updateUserPassword({
          currentPassword: this.pForm.get('password').value
        });
      } else {
        req = this.userService.updateUserEmailAddress({
          newEmailAddress: this.pForm.get('emailAddress').value
        });
      }
      req.subscribe((data) => {
        this.routerExt.navigate([{
          outlets: { userpage: ['profile', 'sent-edit'] }
        }], {
          relativeTo: this.aRoute.parent
        });
      });
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
