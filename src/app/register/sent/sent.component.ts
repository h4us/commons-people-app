import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';
import { RegisterValidatorService } from '../register-validator.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {

  title:string = '新規登録';
  rForm: FormGroup;

  constructor(
    private routerExt: RouterExtensions,
    private userService: UserService,
    private rvService: RegisterValidatorService,
    private page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    this.rForm = this.rvService.sendForm;
  }

  nextPage() {
    this.routerExt.navigate(['']);
  }

}
