import { Injectable } from '@angular/core';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  private stompClient: any;
  private baseUrl: string = 'http://localhost:8081/users/ws';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  connect(): Observable<any> {
    const socket = new SockJS(this.baseUrl);
    this.stompClient = Stomp.over(socket);
    return new Observable(observer => {
      this.stompClient.connect({ 'Authorization': null }, (frame: any) => {
        observer.next(frame);
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }



  connectWithToken(): Observable<any> {
    // Load the token from localStorage
    const token = this.authService.getToken()
    if (!token) {
      throw new Error('JWT token not found in localStorage');
    }
    const socket = new SockJS(`${this.baseUrl}?token=${token}`);
    this.stompClient = Stomp.over(socket);

    return new Observable(observer => {
      this.stompClient.connect({ 'authorization': `Bearer ${token}` }, (frame: any) => {
        observer.next(frame);
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }


  subscribe(topic: string): Observable<any> {
    return new Observable(observer => {
      if (!this.stompClient) {
        observer.error(new Error("STOMP client is not connected."));
        return;
      }
      const subscription = this.stompClient.subscribe(topic, (message: { body: string; }) => {
        observer.next(JSON.parse(message.body));
      }, { ack: 'auto' });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }

  // messagerie configuration

  private apiUrl = 'http://localhost:8082/chat/ws';
  private messageSubject = new Subject<Message>();
  private subscription!: StompSubscription;
  private isConnected: boolean = false;

  initializeWebSocketConnection(): void {
      if (this.isConnected) {
          return;
      }

      const socket = new SockJS(this.apiUrl);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, () => {
          this.isConnected = true;
          this.subscription = this.stompClient.subscribe('/topic/messages', (message: any) => {
              this.messageSubject.next(JSON.parse(message.body));
          });
      });
  }

  getMessagesForPast24Hours(): Observable<Message[]> {
      const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
      const url = `http://localhost:8082/chat/api/messages?timestamp=${twentyFourHoursAgo}`;
      return this.http.get<Message[]>(url);
  }

  sendMessage(message: Message): void {
      this.stompClient.send('/app/chat', {}, JSON.stringify(message));
  }

  getMessageUpdates(): Observable<Message> {
      return this.messageSubject.asObservable();
  }

  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
      if (this.stompClient) {
          this.stompClient.disconnect(() => {
              console.log('Disconnected from WebSocket');
          });
      }
      this.isConnected = false;
  }

  disconnectChat(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }



  /**ChatBot
  sendMessageChat(query: string): Observable<any> {
    return this.http.post('/api/chat', { query });
  }*/
}
