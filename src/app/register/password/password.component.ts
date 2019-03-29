import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { RegisterValidatorService } from '../register-validator.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  title:string = 'パスワード';
  rForm: FormGroup;

  constructor(
    private routerExt: RouterExtensions,
    private rvService: RegisterValidatorService,
    page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.rForm = this.rvService.sendForm;
  }

  onValidate(): any {
    return (this.rForm.get('password').valid &&
            this.rForm.get('passwordConfirm').value == this.rForm.get('password').value);
  }

  nextPage() {
    if (this.onValidate() && this.rForm.valid) {
      //
      this.routerExt.navigate(['/register', 'confirm']);
      //
    } else {
      alert({
        title: 'Invalid Value | 無効な値です',
        okButtonText: 'OK'
      });
    }
  }
}
