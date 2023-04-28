import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Premise, Station, SubsequentStation, Track } from '../models/stations.model';
import { SortDirection } from '@angular/material/sort';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';

@Injectable({
  providedIn: 'root',
})
export class StationService {

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
  ): Observable<IPage<Station>> {
    return this.connector.search<Station>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.STATION,
    );
  }

  //Post new station
  post(data: any) {
    return this.http.post<Station>('stations', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Delete data
  delete(id: number) {
    return this.http.delete('stations/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Edit station
  edit(data: any, id: number) {
    return this.http.put(`stations/${id}`, data);
  }

  postTracks(data: any, id: number): Observable<Station> {
    return this.http.post<Station>('stations/' + id + '/tracks', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get station by id
  getById(id: number): Observable<Station> {
    return this.http.get<Station>('stations/' + id);
  }

  //Get all stations
  get(): Observable<Station[]> {
    return this.http.get<Station[]>('stations');
  }

  //get all licensed stations
  getLicensed(): Observable<Station[]> {
    return this.http.get<Station[]>('stations/licensed');
  }

  //Get premises
  getStationPremises(id: number): Observable<Premise[]> {
    return this.http.get<Premise[]>(`stations/${id}/premises`).pipe(
      map(res => {
        return res;
      }),
    );
  }

  postStationPremises(id: number, data: any) {
    return this.http.post<Station>('stations/' + id + '/premises', data).pipe(
      map(res => {
        return res;
      }),
    );
  }

  deleteStationPremises(id: number) {
    return this.http.delete('stations/premises/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  //Get subsequent station
  getSubsequentStations(id: number): Observable<SubsequentStation[]> {
    return this.http.get<SubsequentStation[]>(`stations/${id}/subsequent-stations`);
  }

  postSubsequentStation(id: number, data: any): Observable<SubsequentStation> {
    return this.http.post<SubsequentStation>('stations/' + id + '/subsequent-stations', data);
  }

  deleteSubsequentStation(id: number): Observable<void> {
    return this.http.delete<void>('stations/subsequent-stations/' + id).pipe(
      map(res => {
        return res;
      }),
    );
  }

  getTrackById(id: number): Observable<Track[]> {
    return this.http.get<Track[]>(`stations/${id}/tracks`);
  }
}
