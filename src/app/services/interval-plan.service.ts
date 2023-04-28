import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IntervalPlanInterface } from '../models/interval-plan.model';
import { PlanInterval } from '../models/plans.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';
import { IPage } from '../models/shared.model';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class IntervalPlanService {
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
  ): Observable<IPage<PlanInterval>> {
    return this.connector.search<PlanInterval>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.INTERVAL_PLAN,
    );
  }

  //Post new interval plan
  post(data: any) {
    return this.http.post<IntervalPlanInterface>('plan-intervals', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get interval plan by id
  getById(id: number): Observable<PlanInterval> {
    return this.http.get<PlanInterval>('plan-intervals/' + id);
  }

  update(data: any, id: number) {
    return this.http.put<IntervalPlanInterface>('plan-intervals/' + id, data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  delete(id: number) {
    return this.http.delete('plan-intervals/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  get(): Observable<PlanInterval[]> {
    return this.http.get<PlanInterval[]>('plan-intervals');
  }

  getFuture() {
    return this.http.get('plan-intervals/future').pipe(
      map(res => {
        return res;
      }),
    );
  }
}
