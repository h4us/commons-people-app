import * as core from '@angular/core';

import { UserService } from './user.service';

import { RouterExtensions } from 'nativescript-angular/router';
import { handleOpenURL, AppURL } from 'nativescript-urlhandler';


@core.Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private routerExt: RouterExtensions,
    private userService: UserService
  ) {
    //
  }

  ngOnInit() {
    handleOpenURL((appURL: AppURL) => {
      console.log('from custom url schema handled', appURL);
      // TODO: switch case
      this.routerExt.navigate(['signin']);
      // --
    });
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
}
