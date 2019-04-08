import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { registerElement } from 'nativescript-angular';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

//
registerElement('PreviousNextView', () => require('nativescript-iqkeyboardmanager').PreviousNextView);
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);
import { LottieView } from 'nativescript-lottie';
registerElement('LottieView', () => LottieView);
// registerElement('WebImage', () => require('nativescript-web-image-cache').WebImage);

//
import { AppRoutingModule } from './app-routing.module';
import { RegisterModule } from './register/register.module';
import { SigninModule } from './signin/signin.module';
import { UserpageModule } from './userpage/userpage.module';
import { SharedModule } from './shared/shared.module';

//
import { UserService } from './user.service';
import { SystemTrayService } from './system-tray.service';
import { AppHttpInterceptor } from './http.interceptor';

//
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

//
import { DemoModule } from './demo/demo.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    //
    AppRoutingModule,
    //
    RegisterModule,
    SigninModule,
    UserpageModule,
    //
    SharedModule,
    //
    DemoModule,
  ],
  providers: [
    UserService,
    SystemTrayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      deps: [ UserService, SystemTrayService ],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
