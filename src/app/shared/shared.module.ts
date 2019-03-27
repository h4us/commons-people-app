import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {
//   // componentDeclarations,
//   providerDeclarations,
//   // routes,
// } from './shared.common';
import { NavfooterComponent } from './navfooter/navfooter.component';
import { CustomActionBarComponent } from './custom-action-bar/custom-action-bar.component';
import { SnackbarLikeComponent } from './snackbar-like/snackbar-like.component';

@NgModule({
  declarations: [NavfooterComponent, CustomActionBarComponent, SnackbarLikeComponent],
  providers: [
    // ...providerDeclarations
  ],
  imports: [
    CommonModule
  ],
  exports: [NavfooterComponent, CustomActionBarComponent, SnackbarLikeComponent]
})
export class SharedModule { }
