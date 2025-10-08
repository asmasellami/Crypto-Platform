import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  btcPrice!: number;
  ethPrice!: number;
  currentTime: string = '';
  unreadCount: number = 0;
  private intervalId: any

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private router: Router,
    private globalDataTableService: GlobalDataTableService
  ) {}

  ngOnInit() {

    //this.fetchUnreadCount();
    this.startFetchingUnreadCount();

    this.authService.loadToken();
    if (
      this.authService.getToken() == null ||
      this.authService.isTokenExpired()
    )
      this.router.navigate(['/login']);

    this.fetchPrices();
    let i = 0;
    setInterval(() => {
      i++;
      if (i % 10 === 0) {
        this.fetchPrices();
      }
      this.updateTime();
    }, 1000);
  }


  // notification icon
  fetchUnreadCount(): void {
    if(this.authService.isloggedIn)
      {
    this.authService.getNotificationsForCurrentUser().subscribe({
      next: (notifications) => {
        this.unreadCount = notifications.filter(notification => !notification.viewed).length;
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
      }
    });
  }
}
  markAsViewed(): void {
    this.authService.getCurrentUserId().subscribe({
      next: (userId) => {
        if (userId !== null) {
          this.authService.markNotificationsAsViewed(userId).subscribe({
            next: () => {
              this.unreadCount = 0;
            },
            error: (err) => {
              console.error('Error marking notifications as viewed', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user ID', err);
      }
    });
  }

  startFetchingUnreadCount(): void {
    this.intervalId = setInterval(() => {
      this.fetchUnreadCount();
    }, 30000);
  }

  fetchPrices() {
    this.globalDataTableService.getBitcoinPrice().subscribe(
      (response) => {
        this.btcPrice = parseFloat(response.data.amount);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération du prix de Bitcoin:',
          error
        );
      }
    );
    this.globalDataTableService.getEthereumPrice().subscribe(
      (response) => {
        this.ethPrice = parseFloat(response.data.amount);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération du prix d Ethereum:',
          error
        );
      }
    );
  }

  updateTime() {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds} (UTC +0:00)`;
  }

  onLogout() {
    this.authService.logout();
  }

  isDashboardActive(): boolean {
    return this.router.url === '/dashboard';
  }


}
