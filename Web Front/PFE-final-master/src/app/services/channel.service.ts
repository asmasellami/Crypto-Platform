import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from '../model/channel.model';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  apiURL: string = 'http://localhost:8081/users';

  constructor(private router: Router, private http: HttpClient) {}

  getChannelsForCurrentUser(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiURL}/currentUserchannels`);
  }

  addChannel(channel: Channel): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiURL}/addChannel`, channel);
  }

  updateChannel(channelId: number, email: string): Observable<Channel> {
    return this.http.put<Channel>(`${this.apiURL}/updateChannel/${channelId}`, {
      email,
    });
  }

  deleteChannel(channelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/deleteChannel/${channelId}`);
  }
}
