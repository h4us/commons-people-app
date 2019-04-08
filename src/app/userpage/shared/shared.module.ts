import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchboxLikeComponent } from './searchbox-like/searchbox-like.component';
import { CustomSearchboxComponent } from './custom-searchbox/custom-searchbox.component';

@NgModule({
  declarations: [
    SearchboxLikeComponent,
    CustomSearchboxComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    SearchboxLikeComponent,
    CustomSearchboxComponent,
  ]
})
export class SharedModule { }
