import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminManagementService {
  constructor(private http: HttpClient) {}

  clearCache() {
    return this.http.delete('cache/clear').pipe(
      map(res => {
        return res;
      }),
    );
  }
}
