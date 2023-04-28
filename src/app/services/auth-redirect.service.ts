import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthRedirectStorageService } from './auth-redirect-storage.service';
import { UrlParsingService } from './url-parsing.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectService {
  protected _authFlowPaths = ['/login'];

  constructor(
    protected router: Router,
    protected authRedirectStorageService: AuthRedirectStorageService,
    protected urlParsingService: UrlParsingService,
  ) {}

  redirect() {
    this.authRedirectStorageService
      .getRedirectUrl()
      .pipe(take(1))
      .subscribe((redirectUrl: string | undefined) => {
        if (redirectUrl === undefined) {
          this.router.navigate(['/main']);
        } else {
          this.router.navigateByUrl(redirectUrl);
        }
        this.clearRedirectUrl();
      });
  }

  saveCurrentNavigationUrl(): void {
    const navigation = this.router.getCurrentNavigation();
    if (!navigation?.finalUrl) {
      return;
    }

    const url = this.router.serializeUrl(navigation.finalUrl);
    this.setRedirectUrl(url);
  }

  setRedirectUrl(url: string): void {
    if (!this.isAuthFlow(url)) {
      this.authRedirectStorageService.setRedirectUrl(url);
    }
  }

  isAuthFlow(url: string) {
    return this._authFlowPaths.some((path) =>
      this.urlParsingService.matchPath(url, path)
    );
  }

  protected clearRedirectUrl(): void {
    this.authRedirectStorageService.setRedirectUrl(undefined);
  }
}
