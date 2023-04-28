import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppParamValue, ParamValue } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  get(): Observable<AppParamValue[]> {
    return this.http.get<AppParamValue[]>('app-params');
  }

  getById(id: number): Observable<string> {
    return this.http.get<string>(`app-params/${id}`);
  }

  update(code: string, value: ParamValue): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<void>(`app-params/${code}`, JSON.stringify(value), { headers });
  }
}
