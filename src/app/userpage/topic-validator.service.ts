import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { ImageAsset } from 'tns-core-modules/image-asset';

import { UserpageModule } from './userpage.module';

@Injectable({
  providedIn: UserpageModule
})
export class TopicValidatorService {
  sendForm: FormGroup;

  communityId: AbstractControl;
  title: AbstractControl;
  description: AbstractControl;
  points: AbstractControl;
  location: AbstractControl;
  type: AbstractControl;

  //
  sendToAsset: ImageAsset | string;
  editTo: number;
  originalCreated: string;
  originalPhoto: string;
  //

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      communityId: [-1, [Validators.required, Validators.min(0)]],
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required ]],
      points: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['WANT', [Validators.required]],
    });
  }

  resetData() {
    this.editTo = null;
    this.originalCreated = null;
    this.originalPhoto = null;
    this.sendToAsset = null;
    this.sendForm.reset();
  }
}
