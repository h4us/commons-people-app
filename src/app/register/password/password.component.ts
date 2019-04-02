import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { RegisterValidatorService } from '../../register-validator.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {
  title:string = 'パスワード';
  rForm: FormGroup;

  field: string = 'password';
  fieldIsValid: boolean;
  firstError: any;

  private touched: boolean = false;
  private edited: boolean = false;

  private rfSub: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private rvService: RegisterValidatorService,
    page: Page
  ) {
    page.actionBarHidden = true;

    this.rForm = this.rvService.sendForm;

    this.rfSub = rvService.sendForm.valueChanges.subscribe((changes: any) => {
      if (!this.touched) {
        this.touched = true;
      }

      this.fieldIsValid = this.rForm.get(this.field).valid &&
        this.rForm.get(`${this.field}Confirm`).value == this.rForm.get(this.field).value;

      this.firstError = this.rForm.get(this.field).errors ?
        {
          [Object.keys(this.rForm.get(this.field).errors)[0]] : this.rForm.get(this.field).errors[Object.keys(this.rForm.get(this.field).errors)[0]]
        } : null;
    });
  }

  ngOnInit() {
    //
    this.fieldIsValid = this.rForm.get(this.field).valid &&
      this.rForm.get(`${this.field}Confirm`).value == this.rForm.get(this.field).value;
    //
  }

  ngOnDestroy() {
    this.rfSub.unsubscribe();
  }

  onValidate(): any {
    // return (this.rForm.get('password').valid &&
    //         this.rForm.get('passwordConfirm').value == this.rForm.get('password').value);
  }

  nextPage() {
    if (this.fieldIsValid) {
      this.routerExt.navigate(['/register', 'confirm']);
    } else {
      // For safe
      alert({
        title: 'Invalid Value | 入力内容に誤りがあります',
        okButtonText: 'OK'
      });
    }
  }
}
