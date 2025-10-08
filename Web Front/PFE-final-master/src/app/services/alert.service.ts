import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Alert } from '../model/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  apiURL: string = 'http://localhost:8081/users';
  token!: string;

  constructor(private router: Router, private http: HttpClient) {}


  // alertes
  checkAlertsForCurrentUser(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiURL}/checkAlertsForCurrentUser`);
  }

  getCurrentUserAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiURL}/currentUseralerts`);
  }

  getAlertById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiURL}/alertbyid/${id}`);
  }

  updateAlert(id: number, alert: Alert): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/updateAlert/${id}`, alert);
  }

  createAlert(alertData: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/alerts`, alertData);
  }

  getAllAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiURL}/alerts`);
  }

  getAlertsByUserId(userId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiURL}/alertByuser/${userId}`);
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/deleteAlert/${id}`);
  }
  enableAlert(alertId: number): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/enableAlert/${alertId}`, {});
  }

  disableAlert(alertId: number): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/disableAlert/${alertId}`, {});
  }
}
