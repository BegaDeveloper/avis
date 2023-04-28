import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { map, Observable } from 'rxjs';
import { User, UserPost } from '../models/user.model';
import { SearchConnector } from './search.connector';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { Station } from '../models/stations.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

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
  ): Observable<IPage<User>> {
    return this.connector.search<User>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.USERS,
    );
  }

  getUserInfo() {
    return this.http.get('users/authenticated-user');
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>('users/' + id);
  }

  //edit user
  edit(data: any, id: number) {
    return this.http.put('users/' + id, data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //post user
  post(data: any) {
    return this.http.post<UserPost>('users', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  postRoles(data: any, id: any) {
    return this.http.post<any>('users/' + id + '/roles', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  deleteUserStation(id: number) {
    return this.http.delete('users/stations/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  postUserStation(id: number, data: any) {
    return this.http.post<any>('users/' + id + '/stations', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  getAuthUserStations(): Observable<Station[]> {
    return this.http.get<Station[]>('users/authenticated-user-stations');
  }
}
