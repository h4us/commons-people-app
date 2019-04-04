import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/platform';

import { UserService, User } from '../../user.service';
import { TrayService } from '../../shared/tray.service';
import { SigninValidatorService } from '../../signin-validator.service';

@Component({
  selector: 'app-entryform',
  templateUrl: './entryform.component.html',
  styleUrls: ['./entryform.component.scss'],
})
export class EntryformComponent implements OnInit, OnDestroy {
  title: string = 'サインイン'
  sForm: FormGroup;
  isSecure: boolean = true;

  firstErrors = {
    username: false,
    password: false
  };

  fieldIsValid: boolean = false;

  private sfSub: Subscription;

  constructor(
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    private siService: SigninValidatorService,
    private trayService: TrayService,
    private page: Page
  ) {
    page.actionBarHidden = true;

    this.siService.resetData();
    this.sForm = this.siService.sendForm;
  }

  ngOnInit() {
    this.sfSub = this.siService.sendForm.valueChanges.subscribe(() => {
      //
      Object.keys(this.firstErrors).forEach((key) => {
        this.firstErrors[key] = this.sForm.get(key).errors ?
          {
            [Object.keys(this.sForm.get(key).errors)[0]] : this.sForm.get(key).errors[Object.keys(this.sForm.get(key).errors)[0]]
          } : null;
      });

      this.fieldIsValid = this.sForm.get('username').valid && this.sForm.get('password').valid;
    });

    //
    this.fieldIsValid = this.sForm.get('username').valid && this.sForm.get('password').valid;
  }

  ngOnDestroy() {
    this.sfSub.unsubscribe();
  }

  togglePassword() {
    this.isSecure = !this.isSecure;
  }

  get isIOS(): boolean {
    return isIOS;
  }

  goTo(to: string) {
    if (to == 'home') {
      this.routerExt.navigate(['']);
    } else {
      this.routerExt.navigate([{
        outlets: {
          signinpage: [ to ]
        }
      }], { relativeTo: this.aRoute.parent });
    }
  }

  login() {
    this.trayService.lockUserpageArea();
    this.userService.login(
      this.sForm.get('username').value,
      this.sForm.get('password').value
    ).subscribe(
      (data: User) => {
        this.userService.parseUser(data)
      },
      (error) => { console.error(error) },
      () => {
        const cl = this.userService.getCommunities();
        setTimeout(() => {
          this.routerExt.navigate([(cl && cl.length > 0) ? 'user' : 'newuser'], {
            clearHistory: true
          })
        }, 500);
      }
    );
  }
}
