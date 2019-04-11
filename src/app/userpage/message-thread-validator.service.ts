import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormArray, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

import { UserService } from '../user.service';

@Injectable({
  providedIn: UserpageModule
})
export class MessageThreadValidatorService {
  sendForm: FormGroup;

  // id: AbstractControl;
  title: AbstractControl;
  // memberIds: AbstractControl;
  memberIds: FormArray;

  labelsForInput: any = {
    title: {
      title: 'グループ名',
      hint: 'グループ名：未設定',
    },

    memberIds: {
      title: 'メンバー',
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.sendForm = this.formBuilder.group({
      // id: [0, [Validators.required, Validators.min(0)]],
      title: ['', [Validators.maxLength(100)]],
      // memberIds: this.formBuilder.array([])
      memberIds: [[], []]
    });
  }

  resetData() {
    this.sendForm.reset();
  }
}
