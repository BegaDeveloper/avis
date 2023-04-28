import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { map, Observable } from 'rxjs';
import { Train } from '../models/trains.modal';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  constructor(
    private http: HttpClient,
    private connector: SearchConnector
  ) {}

  search(
    searchText: string,
    pageIndex: number,
    pageSize: number,
    active?: string,
    direction?: SortDirection
  ): Observable<IPage<Train>> {
    return this.connector.search<Train>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.TRAINS,
    );
  }

  //Post new train
  post(data: any): Observable<Train> {
    return this.http.post<Train>('trains', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get train by id
  getById(id: number): Observable<Train> {
    return this.http.get<Train>('trains/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  update(data: any, id: number): Observable<Train> {
    return this.http.put<Train>('trains/' + id, data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>('trains/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  get(): Observable<Train[]> {
    return this.http.get<Train[]>('trains/trains');
  }
}
