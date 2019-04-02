import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

// import { UserService } from '../../user.service';
// import { RegisterValidatorService } from '../../register-validator.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {

  title:string = '';

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private page: Page
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  nextPage() {
    this.routerExt.navigate([{
      outlets: { userpage: ['profile'] }
    }], {
      relativeTo: this.aRoute.parent
    });
  }
}
