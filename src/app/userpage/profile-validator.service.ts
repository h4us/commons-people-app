import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

import { UserService, User, LoginData } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class ProfileValidatorService {
  sendForm: FormGroup;

  username: AbstractControl;
  firstName: AbstractControl;
  lastName: AbstractControl;
  description: AbstractControl;
  location: AbstractControl;
  emailAddress: AbstractControl;
  emailAddressConfirm: AbstractControl;
  status: AbstractControl;
  password: AbstractControl;
  passwordConfirm: AbstractControl;

  labelsForInput = {
    username: {
      title: 'ユーザーネーム',
      hint: ''
    },
    firstName: {
      title: '名',
      hint: ''
    },
    lastName: {
      title: '姓',
      hint: ''
    },
    description: {
      title: '自己紹介',
      hint: ''
    },
    location: {
      title: '場所',
      hint: ''
    },
    emailAddress: {
      title: 'メールアドレス',
      hint: ''
    },
    status: {
      title: 'ステータス',
      hint: ''
    },
    password: {
      title: 'パスワード',
      hint: ''
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.sendForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      //
      firstName: ['', [Validators.maxLength(30)]],
      lastName: ['', [Validators.maxLength(30)]],
      description: ['', [Validators.maxLength(200)]],
      location: ['', [Validators.maxLength(100)]],
      //
      emailAddress: ['', [Validators.required, Validators.email ]],
      emailAddressConfirm: ['', [Validators.required, Validators.email ]],
      //
      status: ['', [Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    });

    this.resetData();
  }

  resetData() {
    const { username, firstName, lastName, description, location, emailAddress, status } = this.userService.getCurrentUser();
    const { password } = this.userService.getCurrentLogin();

    this.sendForm.reset({
      username,
      firstName,
      lastName,
      description,
      location,
      emailAddress,
      status,
      password
    });
  }
}
