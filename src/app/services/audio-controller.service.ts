import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IPage } from '../models/shared.model';
import { AudioController, AudioControllerData } from '../models/audio-controller';

@Injectable({
  providedIn: 'root',
})
export class AudioControllerService {
  constructor(private http: HttpClient) {}

  search(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    search?: string,
  ): Observable<IPage<AudioController>> {
    let paramsObject: { [k: string]: any } = {
      pageNumber,
      pageSize,
    };
    if (sortBy && sortDirection) {
      paramsObject['sortBy'] = sortBy;
      paramsObject['sortDirection'] = sortDirection.toUpperCase();
    }
    if (search) {
      paramsObject['search'] = search;
    }
    const params = new HttpParams({
      fromObject: paramsObject,
    });
    return this.http.get<IPage<AudioController>>('audio-controllers/search', { params });
  }

  update(id: number, value: AudioControllerData): Observable<AudioController> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<AudioController>(`audio-controllers/${id}`, JSON.stringify(value), { headers });
  }
}
