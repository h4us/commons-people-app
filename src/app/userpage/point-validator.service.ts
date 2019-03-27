import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class PointValidatorService {
  sendForm: FormGroup;

  communityId: AbstractControl;
  beneficiaryId: AbstractControl;
  description: AbstractControl;
  amount: AbstractControl;
  adId: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.sendForm = this.formBuilder.group({
      communityId: [0, [Validators.required, Validators.min(0)]],
      beneficiaryId: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(100)]],
      amount: [1, [Validators.required, Validators.min(0)]],
      adId: [null, []],
    });
  }

  resetData() {
    this.sendForm.reset();
  }
}
