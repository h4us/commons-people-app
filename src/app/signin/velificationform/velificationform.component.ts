import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService, User } from '../../user.service';
import { SigninValidatorService } from '../../signin-validator.service';

@Component({
  selector: 'app-velificationform',
  templateUrl: './velificationform.component.html',
  styleUrls: ['./velificationform.component.scss']
})
export class VelificationformComponent implements OnInit, OnDestroy {
  title: string = 'パスワードを再設定'
  sForm: FormGroup;

  fieldIsValid: boolean = false;
  confirmIsValid: boolean = false;

  firstErrors = {
    emailAddress: false,
    emailAddressConfirm: false
  };

  private sfSub: Subscription;

  email: string = '';

  constructor(
    private routerExt: RouterExtensions,
    private userService:UserService,
    private siService: SigninValidatorService,
    private page: Page
  ) {
    page.actionBarHidden = true;

    this.sForm = this.siService.sendForm;
  }

  ngOnInit() {
    this.sfSub = this.siService.sendForm.valueChanges.subscribe(() => {
      //
      Object.keys(this.firstErrors).forEach((key) => {
        this.firstErrors[key] = this.sForm.get(key).errors ?
          {
            [Object.keys(this.sForm.get(key).errors)[0]] : this.sForm.get(key).errors[Object.keys(this.sForm.get(key).errors)[0]]
          } : null;
      });

      this.fieldIsValid = this.sForm.get('emailAddress').valid && this.sForm.get('emailAddressConfirm').valid;
      this.confirmIsValid = this.sForm.get('emailAddress').value == this.sForm.get('emailAddressConfirm').value;
    });

    //
    this.fieldIsValid = this.sForm.get('emailAddress').valid && this.sForm.get('emailAddressConfirm').valid;
    this.confirmIsValid = this.sForm.get('emailAddress').value == this.sForm.get('emailAddressConfirm').value;
  }

  ngOnDestroy() {
    this.sfSub.unsubscribe();
   }

  public send() {
    // TODO: TEST, redirect, snackbar ?
    console.log('send ->', this.sForm.get('emailAddress').value);

    this.userService.sendVelification(this.sForm.get('emailAddress').value).subscribe(
      (data: any) => {
        this.routerExt.navigate(['/signin']);
      },
      (error: any) => { console.error(error); }
    );

    // this.routerExt.navigate(['/signin']);
  }
}
