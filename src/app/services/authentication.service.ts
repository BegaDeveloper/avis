import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthenticateResponse } from '../models/auth.model';
import { SessionService } from './session';
import { UserService } from './user.service';
import { AuthRedirectService } from './auth-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.sessionService.getAccessToken());
  loggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  user = new BehaviorSubject<AuthenticateResponse>(null!);

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router,
    private authRedirectService: AuthRedirectService,
  ) {}

  setIsLoggedIn(isLogged: boolean) {
    this.loggedIn.next(isLogged);
  }

  // Login method
  login(username: string, password: string) {
    return this.http
      .post<any>('authenticate', {
        username: username,
        password: password,
        grantType: 'ACCESS',
      })
      .pipe(
        tap(resData => {
          this.handleAuth(resData);
        }),
      );
  }

  private handleAuth(authenticateResponse: AuthenticateResponse) {
    const response = new AuthenticateResponse(
      authenticateResponse.accessToken,
      authenticateResponse.refreshToken,
      authenticateResponse.accessTokenValidUntil,
      authenticateResponse.refreshTokenValidUntil,
      authenticateResponse.user,
    );
    this.user.next(response);
    this.sessionService.setUser(authenticateResponse.user);
    this.authRedirectService.redirect();
  }

  // Refresh token
  refreshToken() {
    return this.http
      .post<AuthenticateResponse>('authenticate', {
        grantType: 'REFRESH',
        refreshToken: this.sessionService.getRefreshToken(),
      })
      .pipe(
        tap(resData => {
          this.handleAuth(resData);
        }),
      );
  }

  // Logout
  logout() {
    this.sessionService.clearStorage();
    this.user.next(null!);
    this.router.navigate(['/login']);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http
      .post<any>('users/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .pipe(
        tap(resData => {
          this.handleAuth(resData);
        }),
      );
  }
}
