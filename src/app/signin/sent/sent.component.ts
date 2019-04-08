import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {

  title:string = 'パスワードを再設定';
  rForm: FormGroup;

  constructor(
    private routerExt: RouterExtensions,
    private userService: UserService,
    private page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  nextPage() {
    this.routerExt.navigate(['/signin']);
  }

}
