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

  // -
  sendToAsset: ImageAsset | string;
  editTo: number;
  originalCreated: string;
  originalPhoto: string;

  labelsForInput = {
    title: {
      title: 'タイトル',
      hint: ''
    },
    description: {
      title: '概要',
      hint: ''
    },
    points: {
      title: 'ポイント',
      hint: ''
    },
    location: {
      title: '場所',
      hint: ''
    },
    type: {
      title: 'できる / ほしい',
      hint: '',
      GIVE: 'できる',
      WANT: 'ほしい'
    },
  };
  // -

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      communityId: [-1, [Validators.required, Validators.min(0)]],
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required ]],
      points: ['', [Validators.required, Validators.pattern(/[+-]?\d+(?:\.\d+)?/)]],
      location: ['', [Validators.required]],
      type: ['WANT', [Validators.required]],
    });
  }

  resetData() {
    this.sendForm.reset();
  }
}
