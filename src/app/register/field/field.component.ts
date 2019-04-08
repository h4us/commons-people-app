import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { isIOS } from 'tns-core-modules/platform';

import { RegisterValidatorService } from '../../register-validator.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnDestroy, AfterViewInit {
  // TODO:
  stepAt: any[] = [
    {
      path: 'username',
      field: 'username',
      title: 'ユーザーネーム'
    },
    {
      path: 'email',
      field: 'emailAddress',
      title: 'メールアドレス'
    },
    {
      path: 'password',
      field: 'password',
      title: 'パスワード'
    }
  ];
  currentStep: any;
  // --

  title:string = 'ユーザーネーム';
  rForm: FormGroup;

  field: string = 'username';
  needConfirmInput: boolean = false;
  fieldIsValid: boolean = false;
  confirmIsValid: boolean = true;
  firstError: any;
  firstErrorInConfirm: any;
  isSecure: boolean = true;

  private touched: boolean = false;

  private rfSub: Subscription;

  @ViewChild('activeInput') aInput: ElementRef;
  @ViewChild('activeInputConfirm') aInputConfirm: ElementRef;

  constructor(
    private router: Router,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private rvService: RegisterValidatorService,
    page: Page
  ) {
    page.actionBarHidden = true;

    this.rForm = this.rvService.sendForm;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.data))
      .forEach((data) => {
        //
        this.needConfirmInput = <boolean>data.needConfirmInput;
        const fd: string = <string>data.field;
        this.currentStep = this.stepAt.find((el) => el.path == fd);
        this.title = this.currentStep.title;
        this.field = this.currentStep.field;

        this.rfSub = this.rvService.sendForm.valueChanges.subscribe((changes: any) => {
          if (!this.touched) {
            this.touched = true;
          }

          //
          this.firstError = this.rForm.get(this.field).errors ?
            {
              [Object.keys(this.rForm.get(this.field).errors)[0]] : this.rForm.get(this.field).errors[Object.keys(this.rForm.get(this.field).errors)[0]]
            } : null;

          //
          if (!this.needConfirmInput) {
            this.fieldIsValid = this.rForm.get(this.field).valid
          } else {
            //
            this.firstErrorInConfirm = this.rForm.get(`${this.field}Confirm`).errors ?
              {
                [Object.keys(this.rForm.get(`${this.field}Confirm`).errors)[0]] : this.rForm.get(`${this.field}Confirm`).errors[Object.keys(this.rForm.get(`${this.field}Confirm`).errors)[0]]
              } : null;
            //

            this.confirmIsValid = this.rForm.get(`${this.field}Confirm`).value == this.rForm.get(this.field).value;

            this.fieldIsValid = this.rForm.get(this.field).valid
              && this.rForm.get(`${this.field}Confirm`).valid
              && this.confirmIsValid;
            //
          }

        });

        if (!this.needConfirmInput) {
          this.fieldIsValid = this.rForm.get(this.field).valid
          this.touched = this.fieldIsValid;
        } else {
          this.confirmIsValid = this.rForm.get(`${this.field}Confirm`).value == this.rForm.get(this.field).value;
          this.fieldIsValid = this.rForm.get(this.field).valid
            && this.rForm.get(`${this.field}Confirm`).valid
            && this.confirmIsValid;

          this.touched = this.fieldIsValid && this.confirmIsValid;
        }

      });
  }

  ngAfterViewInit() {
    if (this.field == 'emailAddress' && this.aInput) {
      this.aInput.nativeElement.autocapitalizationType = 'none';
    }

    if (this.field == 'emailAddress' && this.aInputConfirm) {
      this.aInputConfirm.nativeElement.autocapitalizationType = 'none';
    }
  }

  ngOnDestroy() {
    this.rfSub.unsubscribe();
  }

  get isIOS(): boolean {
    return isIOS;
  }

  togglePassword() {
    this.isSecure = !this.isSecure;
  }

  onValidate() {
    //
  }

  goBack() {
    const c = this.stepAt.findIndex((el) => el.field == this.field) - 1;

    if (c >= 0) {
      this.routerExt.navigate([{
        outlets: {
          registerpage: [c == 0 ? 'entry' :  this.stepAt[c].path ]
        }
      }], { relativeTo: this.aRoute.parent });
    } else {
      this.routerExt.navigate(['']);
    }
  }

  goNext() {
    if (this.fieldIsValid) {
      const c = this.stepAt.findIndex((el) => el.field == this.field) + 1;

      if (c >= this.stepAt.length) {
        this.routerExt.navigate([{
          outlets: {
            registerpage: [ 'confirm' ]
          }
        }], { relativeTo: this.aRoute.parent });
      } else {
        this.routerExt.navigate([{
          outlets: {
            registerpage: [ this.stepAt[c].path ]
          }
        }], { relativeTo: this.aRoute.parent });
      }
    } else {
      // For safe
      alert({
        title: 'Invalid Value | 入力内容に誤りがあります',
        okButtonText: 'OK'
      });
    }
  }
}
