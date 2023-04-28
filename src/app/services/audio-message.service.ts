import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioMessageData } from '../models/audio-message.model';
import { IPage } from '../models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class AudioMessageService {
  constructor(private http: HttpClient) {}

  get(
    stationId: number,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
  ): Observable<IPage<AudioMessageData>> {
    const params = new HttpParams()
      .set('stationId', stationId.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<IPage<AudioMessageData>>(`audio/search`, { params });
  }
}
