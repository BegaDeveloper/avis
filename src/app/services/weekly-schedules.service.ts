import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WeeklySchedule } from '../models/weekly.model';
import { SearchConnector } from './search.connector';
import { SortDirection } from '@angular/material/sort';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class WeeklySchedulesService {
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
  ): Observable<IPage<WeeklySchedule>> {
    return this.connector.search<WeeklySchedule>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.WEEKLY_SCHEDULE,
    );
  }

  //Post new Schedule
  post(data: any): Observable<WeeklySchedule> {
    return this.http.post<WeeklySchedule>('week-schedule', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get Schedule by id
  getById(id: number): Observable<WeeklySchedule> {
    return this.http.get<WeeklySchedule>('week-schedule/' + id);
  }

  //Update Schedule
  update(data: any, id: number) {
    return this.http.put('week-schedule/' + id, data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Delete Schedule
  delete(id: number) {
    return this.http.delete('week-schedule/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get Schedule
  get(): Observable<WeeklySchedule[]> {
    return this.http.get<WeeklySchedule[]>('week-schedule');
  }
}
