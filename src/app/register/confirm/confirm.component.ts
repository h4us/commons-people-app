import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';
import { RegisterValidatorService } from '../../register-validator.service';

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
    private aRoute: ActivatedRoute,
    page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.rForm = this.rvService.sendForm;
  }

  toEdit(key: string) {
    let dest = key;

    if (key == 'emailAddress') {
      dest = 'email';
    } else if (key == 'username') {
      dest = 'entry';
    }

    this.routerExt.navigate([{
      outlets: {
        registerpage: [ dest ]
      }
    }], { relativeTo: this.aRoute.parent });
  }

  getCurrent(key: string) {
    const c: any = this.rForm.get(key);
    let ret = c ? c.value : '';
    return (key === 'password') ? ret.replace(/./g, '·') : ret;
  }

  goBack() {
    // TODO: ?
    this.routerExt.navigate([{
      outlets: {
        registerpage: [ 'password' ]
      }
    }], { relativeTo: this.aRoute.parent });
  }

  goNext() {
    if (this.rForm.valid) {
      //
      const filled = {
        username: '',
        emailAddress: '',
        password: '',
        firstName: '',
        lastName: '',
        description: '',
        location: '',
        communityList: []
      }
      filled.emailAddress = this.rForm.get('emailAddress').value;
      filled.username = this.rForm.get('username').value;
      filled.password = this.rForm.get('password').value;

      this.userService.createAccount(filled).subscribe(_ => {
        this.routerExt.navigate([{
          outlets: {
            registerpage: [ 'sent' ]
          }
        }], { relativeTo: this.aRoute.parent });
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
