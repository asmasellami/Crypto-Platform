import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Alert } from '../model/alert.model';
import { AuthService } from '../services/auth.service';
import { GlobalDataTableService } from '../services/global-data-table.service';

@Component({
  selector: 'app-update-alert',
  templateUrl: './update-alert.component.html',
  styleUrls: ['./update-alert.component.css']
})
export class UpdateAlertComponent implements OnInit {
  alert: Alert | undefined;
  alertId: number | null = null;
  availableMetrics: string[] = [];
  futuresMetrics = ['price', 'change', 'open_interest', 'volume', 'yield', 'basis', 'open_interest_volume'];
  optionsMetrics = ['underlying_price', 'change', 'open_interest', 'volume', 'atm_vol', 'basis', '_25_delta_risk_reversal', '_25_delta_butterfly', 'open_interest_volume'];

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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private globalService: GlobalDataTableService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const alertIdParam = this.route.snapshot.paramMap.get('id');
    if (alertIdParam) {
      this.alertId = +alertIdParam;
      this.loadAlert();
    }
  }

  loadAlert(): void {
    if (this.alertId !== null) {
      this.authService.getAlertById(this.alertId).subscribe({
        next: (data: Alert) => {
          this.alert = data;
          this.updateMetrics(); // Update metrics based on alert type
        },
        error: (err) => {
          this.toastr.error('Error fetching alert details');
          console.error(err);
        }
      });
    }
  }

  onUpdateAlert(): void {
    if (this.alert) {
      this.authService.updateAlert(this.alert.id!, this.alert).subscribe({
        next: () => {
          this.toastr.success('Alert updated successfully');
          this.router.navigate(['/alert']);
        },
        error: (err) => {
          const errorMessage = err.error.message || 'Error while updating the Alert';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  updateMetrics(): void {
    this.availableMetrics = this.alert?.type === 'futures' ? this.futuresMetrics : this.optionsMetrics;
  }

  getDisplayName(field: string): string {
    return this.fieldDisplayNames[field] || field;
  }
}
