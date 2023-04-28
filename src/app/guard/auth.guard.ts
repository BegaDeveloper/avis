import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { exemptRoutes } from '../app-routing.module';
import { AuthenticationService } from '../services/authentication.service';
import { SessionService } from '../services/session';
import { AuthRedirectService } from '../services/auth-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private router: Router,
    protected authRedirectService: AuthRedirectService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isExempt = exemptRoutes.includes(state.url);
    if (!isExempt) {
      return this.authService.user.pipe(
        take(1),
        map(user => {
          if (this.sessionService.getAccessToken()) {
            return true;
          }
          this.authRedirectService.saveCurrentNavigationUrl();
          return this.router.createUrlTree(['/login']);
        }),
      );
    }
    return true;
  }
}
