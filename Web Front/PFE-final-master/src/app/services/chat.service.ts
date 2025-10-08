import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5000/api/chat';

  sendMessage(query: string): Observable<any> {
    return this.http.post('/api/chat', { query });
  }

  /* sendMessage(query: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { query: query };

    return this.http.post<any>(this.apiUrl, body, { headers: headers });
  } */

}
