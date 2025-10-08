import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Notification } from '../model/notification.model';

import { GlobalDataTableService } from '../services/global-data-table.service';
import { Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Alert } from '../model/alert.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  alerts: Alert[] = [];

  error: string | null = null;
  selectedNotification: Notification | null = null;
  detailedTickers: any = {};

  alertTypes = ['futures', 'options'];
  fieldOptions: { [key: string]: string[] } = {
    futures: ['price', 'change', 'open_interest', 'volume', 'yield', 'basis', 'open_interest_volume'],
    options: ['underlying_price', 'change', 'open_interest', 'volume', 'atm_vol', 'basis', '_25_delta_risk_reversal', '_25_delta_butterfly', 'open_interest_volume']
  };

  fieldDisplayNames: { [key: string]: string } = {
    price: 'Price',
    change: 'Chg%',
    open_interest: 'Open Interest',
    volume: '24h Volume',
    yield: 'APR',
    basis: 'Basis',
    open_interest_volume: 'Total OI',
    underlying_price: 'Underlying Price',
    atm_vol: 'ATM Vol',
    _25_delta_risk_reversal: '25Δ RR',
    _25_delta_butterfly: '25Δ BR'
  };

  operatorMapping: { [key: string]: string } = {
    '>': 'greater than',
    '<': 'less than',
    '=': 'equal to',
    '!=': 'not equal to',
    '>=': 'greater than or equal to',
    '<=': 'less than or equal to'
  };

  constructor(private notificationService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchNotifications();
    this.loadAlerts();
  }

  fetchNotifications(): void {
    this.notificationService.getNotificationsForCurrentUser().subscribe({
      next: (data: Notification[]) => {
        this.notifications = data.map(notification => ({
          ...notification,
          tickerDetails: this.safeParseJSON(notification.tickerDetails)
        }));
        console.log(this.notifications);
      },
      error: (err) => {
        this.error = 'Error fetching notifications';
        console.error(err);
      }
    });
  }

  loadAlerts(): void {
    this.notificationService.getCurrentUserAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (err) => {
        this.error = 'Error fetching alerts';
        console.error(err);
      }
    });
  }

  safeParseJSON(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return { error: 'Failed to parse JSON', details: jsonString };
    }
  }

  toggleDetails(notification: Notification): void {
    this.selectedNotification = this.selectedNotification === notification ? null : notification;
    this.detailedTickers = this.selectedNotification ? this.selectedNotification.tickerDetails : {};

    if (!notification.viewed) {
      this.markAsViewed(notification);
    }
  }

  markAsViewed(notification: Notification): void {
    this.notificationService.markNotificationsAsViewed(notification.id).subscribe(() => {
      notification.viewed = true;
    }, error => {
      console.error('Failed to mark notification as viewed', error);
    });
  }


  markAllAsRead(): void {
    if (this.notifications.length > 0) {
      const userId = this.notifications[0].userId;
      this.notificationService.markAllNotificationsAsViewed(userId).subscribe({
        next: () => {
          this.notifications.forEach(notification => notification.viewed = true);
          this.toastr.success('All notifications marked as read');
        },
        error: (err) => {
          this.toastr.error('Failed to mark all notifications as read');
          console.error(err);
        }
      });
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
      console.log('Notification deleted successfully');
      this.toastr.success('Notification deleted successfully.');
    }, error => {
      console.error('Failed to delete notification', error);
      this.toastr.error('Failed to delete the notification.');
    });
  }

  getFieldsForAlert(type: string): string[] {
    return this.fieldOptions[type] || [];
  }

  getDisplayName(field: string): string {
    return this.fieldDisplayNames[field] || field;
  }

  getFieldDisplayName(fieldName: string): string {
    return this.fieldDisplayNames[fieldName] || fieldName;
  }

  deleteAllNotifications(): void {
    this.notificationService.deleteAllNotifications().subscribe(() => {
      this.notifications = [];
      console.log('All notifications deleted successfully');
      this.toastr.success('All notifications deleted successfully.');
    }, error => {
      console.error('Failed to delete all notifications', error);
      this.toastr.error('Failed to delete all notifications.');
    });
  }
}
