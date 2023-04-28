import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';

import { SessionService } from './session';
import { AuthenticationService } from './authentication.service';
import { AuthenticateResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from './translate.service';
import { MESSAGE } from '../utils/messages';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private timeIntervalInSec: number = 60;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private router: Router,
    private translateService: TranslateService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.sessionService.getAccessToken();
    let accessTokenTimeString = this.sessionService.getAccessTokenTime();

    // Allow the /display-track route to be accessed without requiring authentication
    if (req.url.startsWith('/display-track') && req.url.includes('?')) {
      const apiReq = req.clone({
        url: `${environment.baseUrl}/${req.url}`,
      });
      return next.handle(apiReq).pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        }),
      );
    }

    if (!req.url.startsWith('authenticate') && accessToken) {
      if (accessTokenTimeString !== null) {
        let accessTime = JSON.parse(accessTokenTimeString);
        let accessTokenTimeDate = new Date(accessTime);
        let currentTime = new Date(Date.now());
        //Setting access token time 30 seconds earlier:
        accessTokenTimeDate.setSeconds(accessTokenTimeDate.getSeconds() - this.timeIntervalInSec);
        if (currentTime.getTime() >= accessTokenTimeDate.getTime()) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
            url: `${environment.baseUrl}/${req.url}`,
          });
          return this.authService.refreshToken().pipe(
            switchMap((res: AuthenticateResponse) => {
              this.isRefreshing = false;
              this.sessionService.setAccessToken(res.accessToken);
              this.sessionService.setAccessTokenValidUntil(res.accessTokenValidUntil);
              this.sessionService.setRefreshToken(res.refreshToken);
              this.sessionService.setRefreshTokenValidUntil(res.refreshTokenValidUntil);
              this.refreshTokenSubject$.next(res.accessToken);
              return next.handle(this.addToken(cloned, res.accessToken));
            }),
          );
        }
      }
    }

    const apiReq = req.clone({
      url: `${environment.baseUrl}/${req.url}`,
    });
    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        url: `${environment.baseUrl}/${req.url}`,
      });
      return next.handle(cloned).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status == 0) {
            // Handle no-connection error
            return throwError(() => this.translateService.showMessage(MESSAGE.NO_CONNECTION));
          }
          if (err.status == 401) {
            this.router.navigate(['/login']);
            return throwError(() => this.translateService.showMessage(MESSAGE.SESSION_EXPIRED));
          } else {
            return throwError(() => err.error);
          }
        }),
      );
    } else {
      return next.handle(apiReq).pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        }),
      );
    }
  }

  private addToken(request: HttpRequest<any>, accessToken: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
