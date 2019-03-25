import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    // private router: RouterExtensions,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const lg: boolean = this.userService.isLoggedIn;

    // TODO:
    // if (lg) {
    //   this.router.navigate(['community']), {
    //     clearHistory: true
    //   };
    // }
    // --

    return !lg;
  }
}
