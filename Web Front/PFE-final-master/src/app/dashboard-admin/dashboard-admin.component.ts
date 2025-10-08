import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'chartjs-adapter-moment';
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  users: User[] = [];
  public chart: any;
  usersCount: number = 0;
  disabledUsersCount: number = 0;
  enabledUsersCount: number = 0;
  pageSize = 5;
  currentPage = 1;

  registrationChartData: any = {};
  public registrationChart:any;
  constructor(private authService: AuthService,private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.fetchUsersCount();
    this.fetchUsers();
    this.createChart();
    this.fetchRegistrationTrend();
  }

  fetchUsersCount(): void {
    this.authService.getUsersCount().subscribe(
      (count) => {
        this.usersCount = count;
      },
      (error) => {
        console.error('Error fetching users count:', error);
      }
    );
  }

  fetchUsers(): void {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.disabledUsersCount = users.filter((user) => !user.enabled).length;
        this.enabledUsersCount = users.filter((user) => user.enabled).length;

        this.createChart();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('MyChart', {
      type: 'pie',
      data: {
        labels: ['Disabled', 'Enabled', 'Total'],
        datasets: [
          {
            label: 'User ',
            data: [
              this.disabledUsersCount,
              this.enabledUsersCount,
              this.usersCount,
            ],
            backgroundColor: ['#f45841', '#36a2eb', '#cc65fe'],
            borderColor: ['#fff', '#fff', '#fff'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  deleteUser(userId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",

      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#1DA2B4',
      confirmButtonText: ' delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(userId).subscribe(
          () => {
            console.log(`User with ID ${userId} deleted`);
            this.fetchUsers();
            this.fetchUsersCount();
            this.toastr.success('User deleted successfully');
          },
          (error) => {
            console.error(`Error deleting user with ID ${userId}`, error);
          }
        );
      }
    });
  }


  fetchRegistrationTrend(): void {
    this.authService.getUserRegistration().subscribe(
      (data) => {

        const labels = data.labels;
        const registrations = data.registrations;

        this.registrationChartData = {
          labels: labels,
          datasets: [
            {
              label: 'User Registrations',
              data: registrations,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };
        this.createRegistrationChart();
      },
      (error) => {
        console.error('Error fetching registration trend:', error);
      }
    );
  }



  createRegistrationChart() {

    this.registrationChartData = new Chart('registrationChart', {
      type: 'line',
      data: this.registrationChartData,
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
          y: {
            /* ticks: {

              precision: 0,
            } */
          },
        },
      },
    });
  }


  pageChanged(event: any) {
    this.currentPage = event;
  }
  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.usersCount);
  }


  goToUpdateForm(userId: number) {
    this.router.navigate(['/updateUser', userId]);
  }

}
