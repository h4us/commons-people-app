import { Injectable } from '@angular/core';
// import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { UserpageModule } from './userpage.module';

@Injectable({
  providedIn: UserpageModule
})
export class CommunityValidatorService {

  draftCommunityIds: number[] = [];
  draftCommunities: any[] = [];

  addOnlyMode: boolean = false;

  constructor() { }
}
