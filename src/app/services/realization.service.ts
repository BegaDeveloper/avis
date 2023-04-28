import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StationTrackRealizationResponse } from '../models/display-realization.model';
import {
  ActionHistory,
  RealizationDetails,
  StationRealizationsResponse,
  StationActionResponse,
} from '../models/realization.model';
import { Station } from '../models/stations.model';
import { EventTypes } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class RealizationService {
  constructor(private http: HttpClient) {}

  //Get search, pagination and sort
  search(stationId: number, allStatuses: boolean, pageNumber: number, pageSize: number, searchKey?: string) {
    let paramsObject: { [k: string]: any } = {
      stationId: stationId,
      allStatuses: allStatuses,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    if (searchKey) {
      paramsObject['searchKey'] = searchKey;
    }
    let params = new HttpParams({ fromObject: paramsObject });

    return this.http.get<StationRealizationsResponse>('realizations/station-realizations', {
      params,
    });
  }

  get(stationId: number, track: number): Observable<StationTrackRealizationResponse> {
    return this.http.get<StationTrackRealizationResponse>('realizations/station-track-realization', {
      params: { 'station-id': stationId, track },
    });
  }

  getRealizationDetails(realizationId: number): Observable<RealizationDetails> {
    let params = new HttpParams().set('realizationId', realizationId);
    return this.http.get<RealizationDetails>('realizations/details', { params });
  }

  getStationsForAction(realizationId: number, action: EventTypes): Observable<Station[]> {
    let params = new HttpParams();
    params = params.append('realization-id', realizationId.toString());
    params = params.append('action', action);

    return this.http.get<Station[]>('realizations/stations-for-action-old', { params });
  }

  stationsForAction(stationId: number, realizationId: number, action: EventTypes): Observable<StationActionResponse> {
    const params = new HttpParams()
      .set('stationId', stationId.toString())
      .set('realizationId', realizationId.toString())
      .set('action', action);

    return this.http.get<StationActionResponse>('realizations/stations-for-action', { params });
  }

  getActionHistory(id: number): Observable<ActionHistory[]> {
    let params = new HttpParams().set('realizationId', id);
    return this.http.get<ActionHistory[]>('realizations/action-history', { params });
  }
}
