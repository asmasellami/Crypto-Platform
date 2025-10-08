import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiURL: string = 'http://localhost:8081/users';
  token!: string;

  constructor(private router: Router, private http: HttpClient) {}

  getNotificationsForCurrentUser(): Observable<Notification[]> {
    const url = `${this.apiURL}/notifications`;
    return this.http.get<Notification[]>(url);
  }

  markNotificationsAsViewed(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/viewed/${userId}`, {});
  }

  getNotificationTickerDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/ticker-details/${id}`);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/notification/${id}`);
  }

  deleteAllNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/deleteAllNotif`);
  }

  markAllNotificationsAsViewed(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/markAllAsViewed/${userId}`, {});
  }

}
