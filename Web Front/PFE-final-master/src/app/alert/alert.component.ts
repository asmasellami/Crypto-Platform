import { Component, OnInit } from '@angular/core';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { AuthService } from '../services/auth.service';
import { Alert } from '../model/alert.model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit {
  alerts: Alert[] = [];
  error: string | null = null;

  operatorMapping: { [key: string]: string } = {
    '>': 'greater than',
    '<': 'less than',
    '=': 'equal to',
    '!=': 'not equal to',
    '>=': 'greater than or equal to',
    '<=': 'less than or equal to'
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


  constructor(private alertService: AlertService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getCurrentUserAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (err) => {
        this.error = 'Error fetching alerts';
        console.error(err);
      }
    });
  }

  deleteAlert(alertId: number | undefined): void {
    if (alertId === undefined) {
      this.toastr.error('Unable to delete alert without an ID.');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#1DA2B4',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertService.deleteAlert(alertId).subscribe({
          next: () => {
            this.toastr.success('Alert deleted successfully.');
            this.loadAlerts();
          },
          error: (error) => {
            this.toastr.error('Failed to delete alert.');
            console.error('Error deleting alert:', error);
          }
        });
      }
    });
  }


  getFieldDisplayName(fieldName: string): string {
    return this.fieldDisplayNames[fieldName] || fieldName;
 }

 enableAlert(alertId: number): void {
  this.alertService.enableAlert(alertId).subscribe({
    next: () => {
      this.toastr.success('Alert enabled successfully.');
      this.loadAlerts();
    },
    error: (err) => {
      this.toastr.error('Error enabling alert.');
      console.error(err);
    }
  });
}

disableAlert(alertId: number): void {
  this.alertService.disableAlert(alertId).subscribe({
    next: () => {
      this.toastr.success('Alert disabled successfully.');
      this.loadAlerts();
    },
    error: (err) => {
      this.toastr.error('Error disabling alert.');
      console.error(err);
    }
  });
}


}
