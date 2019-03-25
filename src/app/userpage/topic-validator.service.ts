import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

@Injectable({
  providedIn: UserpageModule
})
export class TopicValidatorService {
  sendForm: FormGroup;

  title: AbstractControl;
  description: AbstractControl;
  points: AbstractControl;
  location: AbstractControl;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required ]],
      points: ['', [Validators.required ]],
      location: ['', [Validators.required ]],
    });
  }
}
