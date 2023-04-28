import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PlanInstance, StationArrivalDepartureRealization } from '../models/realization.model';
import { EventTypes } from '../utils/enums';
import { MESSAGE } from '../utils/messages';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(private http: HttpClient, private translateService: TranslateService) {}

  getData(planInstanceId: number, delay: number, type: EventTypes): Observable<any> {
    let params = new HttpParams();
    params = params.append('plan-instance-id', planInstanceId.toString());
    params = params.append('delay', delay.toString());

    let route;
    if (type === EventTypes.POSTPONE) {
      route = 'postpone';
    } else if (type === EventTypes.START) {
      route = 'start';
    }

    return this.http.get('actions/' + route, { params }).pipe(
      map(res => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        throw error;
      }),
    );
  }

  resetOrCancel(planInstanceId: number, actionType: EventTypes): Observable<any> {
    let params = new HttpParams();
    params = params.append('plan-instance-id', planInstanceId.toString());

    let url;
    if (actionType === EventTypes.RESET) {
      url = '/reset';
    } else if (actionType == EventTypes.CANCEL) {
      url = '/cancel';
    }

    return this.http.get('actions' + url, { params }).pipe(
      map(res => {
        return res;
      }),
    );
  }

  changeTrack(planInstanceId: number, stationId: number, track: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('plan-instance-id', planInstanceId.toString());
    params = params.append('station-id', stationId.toString());
    params = params.append('track', track.toString());

    return this.http.get<any>('actions/change-track', { params });
  }

  handleError(error: any) {
    let errorMessage = MESSAGE.error_start_action_post;
    if (error.appCode) {
      switch (error.appCode) {
        case 'ACTION_CANNOT_COMPLETE':
          errorMessage = MESSAGE.ACTION_CANNOT_COMPLETE;
          break;
      }
    }
    this.translateService.showMessage(errorMessage);
  }

  //Arrival departure
  getArrivalDepartureRealizations(stationId: number, infoTableType: string, resultSize: number) {
    let params = new HttpParams();
    params = params.append('station-id', stationId.toString());
    params = params.append('info-table-type', infoTableType);
    params = params.append('result-size', resultSize.toString());

    return this.http.get<StationArrivalDepartureRealization>('realizations/station-arrival-departure-realizations', {
      params,
    });
  }

  arriveDepart(type: EventTypes, stationId: number, planInstanceId: number, delay: number) {
    let route;

    switch (type) {
      case EventTypes.DEPARTURE:
        route = 'depart';
        break;
      case EventTypes.ARRIVAL:
        route = 'arrive';
        break;
      case EventTypes.CHANGE_DEPARTURE_DELAY:
        route = 'change-departure-delay';
        break;
      case EventTypes.CHANGE_ARRIVAL_DELAY:
        route = 'change-arrival-delay';
        break;
    }

    let params = new HttpParams()
      .set('station-id', stationId)
      .set('plan-instance-id', planInstanceId)
      .set('delay', delay);

    return this.http.get(`actions/${route}`, { params }).pipe(
      catchError((error: any) => {
        error?.errorMessages?.forEach((err: any) => {
          err
            ? this.translateService.showMessage(err)
            : this.translateService.showMessage(MESSAGE.error_get_realization);
        });
        throw new Error(error?.error);
      }),
    );
  }

  getPlanInstance(id: number): Observable<PlanInstance> {
    return this.http.get<PlanInstance>(`plan-instances/${id}`).pipe(
      catchError(error => {
        error.errorMessages.forEach((err: any) => {
          err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
        return of({} as PlanInstance);
      }),
    );
  }

  shortening(planInstanceId: number, firstStationId: number, lastStationId: number): Observable<any> {
    let params = new HttpParams()
      .set('plan-instance-id', planInstanceId)
      .set('first-station-id', firstStationId)
      .set('last-station-id', lastStationId);

    return this.http.get<any>('actions/shortening', { params }).pipe(
      catchError((error: any) => {
        error?.errorMessages?.forEach((err: any) => {
          err
            ? this.translateService.showMessage(err)
            : this.translateService.showMessage(MESSAGE.error_get_realization);
        });
        throw new Error(error?.error);
      }),
    );
  }
}
