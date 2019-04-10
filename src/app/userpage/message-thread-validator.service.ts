import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class MessageThreadValidatorService {
  sendForm: FormGroup;

  communityId: AbstractControl;
  title: AbstractControl;
  personalTitle: AbstractControl;
  memberIds: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.sendForm = this.formBuilder.group({
      communityId: [0, [Validators.required, Validators.min(0)]],
      title: ['', [Validators.maxLength(100)]],
      personalTitle: ['', [Validators.maxLength(100)]],
      memberIds: ['', []]
    });
  }

  resetData() {
    this.sendForm.reset();
  }
}
