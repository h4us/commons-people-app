import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { RegisterValidatorService } from '../register-validator.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
  title: string = 'ユーザーネーム';
  rForm: FormGroup;

  constructor(
    private routerExt: RouterExtensions,
    private rvService: RegisterValidatorService,
    page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.rForm = this.rvService.sendForm;
  }

  onValidate(): any {
    return this.rForm.get('username').valid;
  }

  nextPage() {
    if (this.onValidate()) {
      this.routerExt.navigate(['/register', 'email']);
    } else {
      alert({
        title: 'Invalid Value | 無効な値です',
        okButtonText: 'OK'
      });
    }
  }
}
