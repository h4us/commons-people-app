import {
  HttpInterceptor, HttpHandler, HttpRequest,
  HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from "@angular/core"

import { Observable, of, } from "rxjs";
import { tap, catchError, delay } from "rxjs/operators";

import { getConnectionType, connectionType } from 'tns-core-modules/connectivity'

import { UserService } from './user.service';
import { SystemTrayService } from './system-tray.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  //
  // TODO:
  //

  constructor(
    private userService: UserService,
    private trayService: SystemTrayService,
  ) {
    //
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if(evt.body) {
            // console.log(
            //   '[success] process in interceptor', evt.body,
            //   this.userService.getCurrentUser()
            // );
          }
        }
      }),
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse) {
          // console.log('[error] process in interceptor', err);
          // 1. check error status?

          // 2. check network availability
          const cType = getConnectionType();

          if (cType == connectionType.none) {
            // console.log('[network not available] process in interceptor');
            // 3-a. show error message
            this.trayService.showError({ status: -1, statusText: 'network unavailable' });
          } else {
            // 3-b. show error message
            this.trayService.showError(err);
          }
        }
        return of(err);
      }));
  }

}
