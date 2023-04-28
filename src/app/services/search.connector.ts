import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Components } from '../utils/enums';
import { IPage } from '../models/shared.model';
import { catchError, Observable, of } from 'rxjs';
import { SortDirection } from '@angular/material/sort';


@Injectable({
  providedIn: 'root',
})
export class SearchConnector {
  constructor(
    private httpClient: HttpClient,
  ) {}

  search<T>(
    search: string,
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    component?: Components,
  ): Observable<IPage<T>> {
    let paramsObject: { [k: string]: any } = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: search || '',
    };
    if (sortBy && sortDirection) {
      paramsObject['sortBy'] = sortBy;
      paramsObject['sortDirection'] = sortDirection.toUpperCase();
    }
    const params = new HttpParams({ fromObject: paramsObject });
    let route = '';

    switch (component) {
      case Components.INTERVAL_PLAN:
        route = 'plan-intervals/search';
        break;
      case Components.ROUTES:
        route = 'routes/search';
        break;
      case Components.SPECIAL_DAY:
        route = 'special-days/search';
        break;
      case Components.STATION:
        route = 'stations/search';
        break;
      case Components.TRAINS:
        route = 'trains/search';
        break;
      case Components.USERS:
        route = 'users/search';
        break;
      case Components.WEEKLY_SCHEDULE:
        route = 'week-schedule/search';
        break;
      case Components.PLANS:
        route = 'plan/search';
    }

    return this.httpClient.get<IPage<T>>(route, {params}).pipe(catchError(() => of({} as IPage<T>)));
  }
}
