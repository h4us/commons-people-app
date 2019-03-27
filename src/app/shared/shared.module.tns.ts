import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NavfooterComponent } from './navfooter/navfooter.component';
import { CustomActionBarComponent } from './custom-action-bar/custom-action-bar.component';
import { CustomSearchBoxComponent } from './custom-search-box/custom-search-box.component';
import { CustomTextFieldComponent } from './custom-text-field/custom-text-field.component';
import { SnackbarLikeComponent } from './snackbar-like/snackbar-like.component';
import { SearchboxLikeComponent } from './searchbox-like/searchbox-like.component';

@NgModule({
  declarations: [NavfooterComponent, CustomActionBarComponent, CustomSearchBoxComponent, CustomTextFieldComponent, SnackbarLikeComponent, SearchboxLikeComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [NavfooterComponent, CustomActionBarComponent, CustomSearchBoxComponent, CustomTextFieldComponent, SnackbarLikeComponent, SearchboxLikeComponent]
})
export class SharedModule { }
