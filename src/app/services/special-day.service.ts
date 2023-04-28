import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpecialDays } from '../models/special-days.model';
import { SortDirection } from '@angular/material/sort';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';

@Injectable({
  providedIn: 'root',
})
export class SpecialDayService {
  constructor(private http: HttpClient, private connector: SearchConnector) {}

  search(
    searchText: string,
    pageIndex: number,
    pageSize: number,
    active?: string,
    direction?: SortDirection,
  ): Observable<IPage<SpecialDays>> {
    return this.connector.search<SpecialDays>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.SPECIAL_DAY,
    );
  }

  //Post new special day
  post(data: any) {
    return this.http.post<SpecialDays>('special-days', data);
  }

  //Get special day by id
  getById(id: number): Observable<SpecialDays> {
    return this.http.get<SpecialDays>('special-days/' + id);
  }

  update(data: any, id: number) {
    return this.http.put('special-days/' + id, data);
  }

  delete(id: number) {
    return this.http.delete('special-days/' + id);
  }
}
