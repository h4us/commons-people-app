import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { RegisterValidatorService } from '../register-validator.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  title:string = 'メールアドレス';
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
    // TODO:
    return (this.rForm.get('emailAddress').valid &&
            this.rForm.get('emailAddressConfirm').value == this.rForm.get('emailAddress').value);
  }

  nextPage() {
    if (this.onValidate()) {
      this.routerExt.navigate(['/register', 'password']);
    } else {
      alert({
        title: 'Invalid Value | 無効な値です',
        okButtonText: 'OK'
      });
    }
  }
}
