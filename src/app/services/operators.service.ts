import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operator } from '../models/operators.model';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService {
  constructor(private http: HttpClient) {}

  //GET ALL OPERATORS
  get(): Observable<Operator[]> {
    return this.http.get<Operator[]>('operators');
  }

  getLogo(id: number) {
    return this.http.get(`operators/${id}/logo`, { responseType: 'blob' });
  }

  post(name: string, formData: FormData) {
    return this.http.post(`operators?name=${name}`, formData);
  }
}
