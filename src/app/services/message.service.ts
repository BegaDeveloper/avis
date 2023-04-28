import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageDTO } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  post(data: any): Observable<MessageDTO> {
    return this.http.post<MessageDTO>('audio/audio-messages', data);
  }
}
