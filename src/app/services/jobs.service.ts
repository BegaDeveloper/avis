import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../models/jobs.model';
import { IPage } from '../models/shared.model';
import { SortDirection } from '@angular/material/sort';

@Injectable()
export class JobsService {
  constructor(private http: HttpClient) {}

  //Get search, pagination and sort
  search(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: SortDirection
  ): Observable<IPage<Job>> {
    let paramsObject: { [k: string]: number| string | SortDirection } = {
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    if (sortBy && sortDirection) {
      paramsObject['sortBy'] = sortBy;
      paramsObject['sortDirection'] = sortDirection.toUpperCase();
    }
    const params = new HttpParams({ fromObject: paramsObject });

    return this.http.get<IPage<Job>>('jobs', {params,});
  }
}
