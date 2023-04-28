import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainCategory } from '../models/trains.modal';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  get(): Observable<TrainCategory[]> {
    return this.http.get<TrainCategory[]>('train-categories');
  }
}
