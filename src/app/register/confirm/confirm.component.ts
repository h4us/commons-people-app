import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';
import { RegisterValidatorService } from '../register-validator.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  title:string = '新規登録';
  rForm: FormGroup;

  constructor(
    private routerExt: RouterExtensions,
    private userService: UserService,
    private rvService: RegisterValidatorService,
    page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.rForm = this.rvService.sendForm;
  }

  toEdit(key: string) {
    if (key == 'emailAddress') {
      this.routerExt.navigate(['/register', 'email']);
    } else if (key == 'username') {
      this.routerExt.navigate(['/register', 'username']);
    } else {
      this.routerExt.navigate(['/register', key]);
    }
  }

  getCurrent(key: string) {
    const c: any = this.rForm.get(key);
    let ret = c ? c.value : '';
    return (key === 'password') ? ret.replace(/./g, '·') : ret;
  }

  nextPage() {
    if (this.rForm.valid) {
      //
      this.userService.createAccount(this.rForm.value).subscribe(() => {
        this.routerExt.navigate(['/register', 'sent']);
      });
      //
    } else {
      alert({
        title: 'Invalid Value | 無効な値です',
        okButtonText: 'OK'
      });
    }
  }

}
