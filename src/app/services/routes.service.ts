import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Route } from '../models/routes.model';
import { SortDirection } from '@angular/material/sort';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(
    private http: HttpClient,
    private connector: SearchConnector,
  ) {}

  search(
    searchText: string,
    pageIndex: number,
    pageSize: number,
    active?: string,
    direction?: SortDirection
  ): Observable<IPage<Route>> {
    return this.connector.search<Route>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.ROUTES,
    );
  }

  //Delete route
  delete(id: number) {
    return this.http.delete(`routes/${id}`);
  }

  //Get by id
  getById(id: number): Observable<Route> {
    return this.http.get<Route>(`routes/${id}`);
  }

  //Post route
  post(data: any) {
    return this.http.post('routes', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //GET
  get(): Observable<Route[]> {
    return this.http.get<Route[]>('routes');
  }

  //edit/put route
  put(data: any, id: number) {
    return this.http.put(`routes/${id}`, data);
  }
}
