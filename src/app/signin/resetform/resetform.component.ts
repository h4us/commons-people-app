import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-resetform',
  templateUrl: './resetform.component.html',
  styleUrls: ['./resetform.component.scss']
})
export class ResetformComponent implements OnInit {
  title: string = 'パスワードを再設定'

  password: string = '';

  constructor(
    private router: RouterExtensions,
    private userService:UserService,
    page: Page) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }
}
