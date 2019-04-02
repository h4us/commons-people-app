import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SigninValidatorService {
  sendForm: FormGroup;

  username: AbstractControl;
  emailAddress: AbstractControl;
  emailAddressConfirm: AbstractControl;
  password: AbstractControl;
  passwordConfirm: AbstractControl;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      emailAddress: ['', [Validators.required, Validators.email ]],
      emailAddressConfirm: ['', [Validators.required, Validators.email ]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    });
  }

  resetData() {
    this.sendForm.reset({
      username: 'inafuku',
      password: 'helloworld'
    });

    // this.sendForm.reset();
  }
}
