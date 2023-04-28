import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectStorageService {
  constructor() {}

  private redirectUrl$: Observable<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  getRedirectUrl(): Observable<string | undefined> {
    return this.redirectUrl$;
  }

  setRedirectUrl(redirectUrl: string | undefined): void {
    (this.redirectUrl$ as BehaviorSubject<string | undefined>).next(
      redirectUrl
    );
  }
}
