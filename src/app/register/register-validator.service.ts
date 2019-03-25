import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { RegisterModule } from './register.module';

@Injectable({
  providedIn: RegisterModule
})
export class RegisterValidatorService {
  sendForm: FormGroup;

  username: AbstractControl;
  email: AbstractControl;
  emailConfirm: AbstractControl;
  password: AbstractControl;
  passwordConfirm: AbstractControl;

  // static _emailConfirm(): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any } | null => {
  //     console.log(control.get('email'));
  //     return { 'emailConfirm': { value: control.value } };
  //   };
  // }

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/[a-zA-Z0-9_]+/)]],
      email: ['', [Validators.required, Validators.email ]],
      emailConfirm: ['', [Validators.required ]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[a-zA-Z0-9_]+/)]],
      passwordConfirm: ['', [Validators.required ]],
    });
  }
}
