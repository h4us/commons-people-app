import * as core from '@angular/core';

import { UserService } from './user.service';

@core.Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
}
