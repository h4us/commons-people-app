import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {
//   // componentDeclarations,
//   providerDeclarations,
//   // routes,
// } from './shared.common';
import { NavfooterComponent } from './navfooter/navfooter.component';
import { CustomActionBarComponent } from './custom-action-bar/custom-action-bar.component';
import { CustomSearchBoxComponent } from './custom-search-box/custom-search-box.component';
import { CustomTextFieldComponent } from './custom-text-field/custom-text-field.component';
import { SnackbarLikeComponent } from './snackbar-like/snackbar-like.component';
import { SearchboxLikeComponent } from './searchbox-like/searchbox-like.component';

@NgModule({
  declarations: [NavfooterComponent, CustomActionBarComponent, CustomSearchBoxComponent, CustomTextFieldComponent, SnackbarLikeComponent, SearchboxLikeComponent],
  providers: [
    // ...providerDeclarations
  ],
  imports: [
    CommonModule
  ],
  exports: [NavfooterComponent, CustomActionBarComponent, CustomSearchBoxComponent, CustomTextFieldComponent, SnackbarLikeComponent, SearchboxLikeComponent]
})
export class SharedModule { }
