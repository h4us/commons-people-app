import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-velificationform',
  templateUrl: './velificationform.component.html',
  styleUrls: ['./velificationform.component.scss']
})
export class VelificationformComponent implements OnInit {
  title: string = 'パスワードを再設定'

  //
  email: string = '';

  constructor(
    private router: RouterExtensions,
    private userService:UserService,
    page: Page) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  public send() {
    // TEST:
    console.log('send ->', this.email);
    this.router.navigate(['/signin', 'reset']);

    // this.userService.sendVelification(this.email).subscribe(
    //   (data: any) => { console.log(data); },
    //   (error: any) => { console.error(error); }
    // );
  }
}
