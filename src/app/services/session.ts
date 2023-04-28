import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  _session: any;
  constructor(public datePipe: DatePipe) {}

  public get storage(): Storage {
    return sessionStorage;
  }

  setAccessToken(accessToken: string): void {
    this.storage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    return this.storage.getItem('accessToken');
  }

  setRefreshToken(refreshToken: string): void {
    this.storage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  setAccessTokenValidUntil(accessTokenValidUntil: Date): void {
    this.storage.setItem('accessTokenValidUntil', JSON.stringify(accessTokenValidUntil));
  }

  getAccessTokenValidUntil(): Date | null {
    return JSON.parse(this.storage.getItem('accessTokenValidUntil') || '');
  }

  getAccessTokenTime() {
    return this.storage.getItem('accessTokenValidUntil');
  }

  setRefreshTokenValidUntil(refreshTokenValidUntil: Date): void {
    this.storage.setItem('refreshTokenValidUntil', JSON.stringify(refreshTokenValidUntil));
  }

  getRefreshTokenValidUntil(): Date | null {
    return JSON.parse(this.storage.getItem('refreshTokenValidUntil') || '');
  }

  setUser(user: any) {
    this.storage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(this.storage.getItem('user') || '');
  }

  getUserData(): Observable<string[]> {
    return of(JSON.parse(this.storage.getItem('user') || ''));
  }

  clearStorage() {
    this.storage.clear();
  }
}
