import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SessionService } from 'src/app/services/session';
import { SharedService } from '../../services/shared.service';
import { MESSAGE } from '../../utils/messages';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  @ViewChild('authForm') form: NgForm;

  constructor(
    private authService: AuthenticationService,
    private sessionStorage: SessionService,
    private router: Router,
    private sessionService: SessionService,
    private sharedService: SharedService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.sessionService.clearStorage();
  }

  onSubmit() {
    const username = this.form.value.username;
    const password = this.form.value.password;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        this.sessionStorage.setAccessToken(res.accessToken);
        this.sessionStorage.setRefreshToken(res.refreshToken);
        this.sessionStorage.setAccessTokenValidUntil(res.accessTokenValidUntil);
        this.sessionStorage.setRefreshTokenValidUntil(res.refreshTokenValidUntil);
        this.authService.setIsLoggedIn(true);
      },
      error: error => {
        error.appCode
          ? this.translateService.showMessage(error.appCode)
          : this.translateService.showMessage(MESSAGE.error_login);
      },
    });
  }
}
