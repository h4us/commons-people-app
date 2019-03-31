import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { NavfooterComponent } from './navfooter/navfooter.component';
import { CustomActionBarComponent } from './custom-action-bar/custom-action-bar.component';
import { SnackbarLikeComponent } from './snackbar-like/snackbar-like.component';

import { TrayService } from './tray.service';

@NgModule({
  declarations: [NavfooterComponent, CustomActionBarComponent, SnackbarLikeComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [TrayService],
  exports: [NavfooterComponent, CustomActionBarComponent, SnackbarLikeComponent]
})
export class SharedModule { }
