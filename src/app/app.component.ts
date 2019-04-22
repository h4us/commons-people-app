import * as core from '@angular/core';

import { UserService } from './user.service';

import { RouterExtensions } from 'nativescript-angular/router';
import { handleOpenURL, AppURL } from 'nativescript-urlhandler';

//
import { LocalNotifications } from 'nativescript-local-notifications';
const firebase = require('nativescript-plugin-firebase');

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

    firebase.init({
      showNotificationsWhenInForeground: true,
      onMessageReceivedCallback(message) {
        // console.log('push notification comming -> ', message);
        LocalNotifications.schedule(
          [{
            // id: 1,
            thumbnail: true,
            title: message.title,
            body: message.body,
            forceShowWhenInForeground: true,
            at: new Date(new Date().getTime() + 3 * 1000),
          }])
          .catch(err => console.error(err));
      }
    }).then(
      (args) => {
        console.log(`firebase init done ${args}`);
      },
      error => {
        console.log(`firebase.init error: ${error}`);
      }
    );
  }
}
