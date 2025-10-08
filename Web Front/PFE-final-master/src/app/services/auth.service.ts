import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Alert } from '../model/alert.model';

import { Notification } from '../model/notification.model';
import { Channel } from '../model/channel.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedUser!: string;
  public isloggedIn: Boolean = false;
  public roles!: string[];

  private helper = new JwtHelperService();

  apiURL: string = 'http://localhost:8081/users';
  token!: string;

  constructor(private router: Router, private http: HttpClient) {}

  login(user: User) {
    return this.http.post<User>(this.apiURL + '/login', user, {
      observe: 'response',
    });
  }

  saveToken(jwt: string) {
    sessionStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  getToken(): string {
    return this.token;
  }

 loadToken() {
    this.token = sessionStorage.getItem('jwt')!;
    this.decodeJWT();
  }

  decodeJWT() {
    if (this.token == undefined) return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.roles = decodedToken.roles;
    this.loggedUser = decodedToken.sub;
  }

  isAdmin(): Boolean {
    if (!this.roles)
      //this.roles== undefiened
      return false;
    return this.roles.indexOf('ADMIN') > -1;
  }

  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token = undefined!;
    this.isloggedIn = false;
    sessionStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = !!login;
  }

  isTokenExpired(): Boolean {
    return this.helper.isTokenExpired(this.token);
  }

  registerUser(user: User) {
    return this.http.post<User>(this.apiURL + '/register', user, {
      observe: 'response',
    });
  }

  public regitredUser: User = new User();
  setRegistredUser(user: User) {
    this.regitredUser = user;
  }
  getRegistredUser() {
    return this.regitredUser;
  }

  validateEmail(code: string) {
    return this.http.get<User>(this.apiURL + '/verifyEmail/' + code);
  }


  initiatePasswordReset(data: { email: string }) {
    return this.http.post<any>(`${this.apiURL}/modifier_pwd`, data);
  }

  updatePassword(data: { email: string; code: string; password: string }) {
    return this.http.post<any>(`${this.apiURL}/nouveau_pwd`, data);
  }

  verifyUser(email: string): Observable<any> {
    const url = `${this.apiURL}/verify`;
    const requestBody = { email };
    return this.http.post<any>(url, requestBody);
  }

  /****Dashboard Admin****/
  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/count`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}/all`);
  }

  deleteUser(userId: number): Observable<void> {
    const url = `${this.apiURL}/delUser/${userId}`;
    return this.http.delete<void>(url);
  }

  getUserRegistration(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/registrations`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURL}/update`, user);
  }

  consulterUser(id: number): Observable<User> {
    const url = `${this.apiURL}/getbyid/${id}`;
    return this.http.get<User>(`${this.apiURL}/getbyid/${id}`);
  }

  /***update details*/
   modifierNomUtilisateur(userId: number, username: string) {
    const requestBody = { user_id: userId, username: username };
    return this.http.put<any>(`${this.apiURL}/update`, requestBody);
  }


  modifierMotDePasse(userId: number, new_password: string) {
    const requestBody = { user_id: userId, new_password: new_password };
    return this.http.put<any>(`${this.apiURL}/changePassword`, requestBody);
  }

  getCurrentUserId(): Observable<number | null> {
    return this.http.get<number>(`${this.apiURL}/userById`).pipe(
      catchError((error) => {
        console.error('Failed to fetch current user ID', error);
        return of(null);
      })
    );
  }

  getCurrentUsername(): Observable<string | null> {
    return this.http
      .get<{ username: string }>(`${this.apiURL}/userByUsername`)
      .pipe(
        map((response) => response.username),
        catchError((error) => {
          console.error('Failed to fetch current user name', error);
          return of(null);
        })
      );
  }


  addUser(user: User) {
    return this.http.post<User>(this.apiURL + '/addUser', user);
  }

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

  //Notification
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

  //channel
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
