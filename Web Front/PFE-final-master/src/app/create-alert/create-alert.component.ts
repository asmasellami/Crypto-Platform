import { Alert } from './../model/alert.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { User } from '../model/user.model';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css']
})

export class CreateAlertComponent implements OnInit {

  userId: number | null = null;
  selectedType: string = '';
  availableMetrics: string[] = [];
  futuresMetrics = ['price', 'change', 'open_interest', 'volume', 'yield', 'basis', 'open_interest_volume'];
  optionsMetrics = ['underlying_price', 'change', 'open_interest', 'volume', 'atm_vol', 'basis', '_25_delta_risk_reversal', '_25_delta_butterfly', 'open_interest_volume'];
  alertTypes = ['futures', 'options'];

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

  availableEmails: string[] = [];
  showEmailSelector: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,private alertService: AlertService, ) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe(userId => {
      this.userId = userId;
      //this.loadEmails();
    });
  }

  onAddAlert(form: NgForm) {
    if (!form.valid) {
      this.toastr.error('Please fill the form correctly!');
      return;
    }
    if (this.userId === null) {
      this.toastr.error('Failed to get user ID');
      return;
    }
    const newAlert: Alert = {
      userId: this.userId,
      name: form.value.name,
      fieldName: form.value.fieldName,
      operator: form.value.operator,
      threshold: form.value.threshold,
      triggerFrequency: form.value.triggerFrequency,
      emailNotification: form.value.emailNotification === 'true',
      type: this.selectedType,
      active: true

    };
    this.alertService.createAlert(newAlert).subscribe({
      next: (response) => {
        this.toastr.success('Alert added successfully');
        form.resetForm();
        this.router.navigate(['/alert']);
      },
      error: (err) => {
        const errorMessage = err.error.message || 'Error while adding the Alert';
        this.toastr.error(errorMessage);
      }
    });
  }

  updateMetrics() {
    this.availableMetrics = this.selectedType === 'futures' ? this.futuresMetrics : this.optionsMetrics;
  }

  getDisplayName(field: string): string {
    return this.fieldDisplayNames[field] || field;
  }


  getOperatorText(operator: string): string {
    const operatorText: { [key: string]: string } = {
      '>': 'greater than',
      '<': 'less than',
      '=': 'equal to',
      '!=': 'not equal to',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to'
    };
    return operatorText[operator] || operator;
  }

  getFrequencyText(frequency: string): string {
    const frequencyText: { [key: string]: string } = {
      '1min': '1 Minute',
      '5min': '5 Minutes',
      '24h': '24 Hours'
    };
    return frequencyText[frequency] || frequency;
  }


  /*loadEmails() {
    this.authService.getChannelsForCurrentUser().subscribe(emails => {
      this.availableEmails = emails.map(channel => channel.email);
    });
  }
  onEmailNotificationChange(event: any) {
    this.showEmailSelector = event.target.value === 'true';
  }*/
}
