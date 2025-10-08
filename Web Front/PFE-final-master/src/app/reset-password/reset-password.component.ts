import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  loading: boolean = false;
  showVerificationFields: boolean = false;
  showButton: boolean = true;

  constructor(private authService: AuthService,private toastr: ToastrService,private router: Router,private spinner: NgxSpinnerService)
  {

  }

  ngOnInit(): void {}

  sendCode() {

    this.loading = true;
    this.spinner.show();

    this.authService.initiatePasswordReset({ email: this.email }).subscribe(
      response => {
        this.toastr.success('Code sent successfully', 'Check your email.',
        {
          positionClass: 'toast-top-center'
        });
        this.showVerificationFields = true;
        this.showButton = false;
      },
      error => {
        console.error('Error initiating password reset', 'Error');
        this.toastr.error('Your Account is not activated', 'Error',
        {
          positionClass: 'toast-top-center'
        });
      }
    ).add(() => {

      this.loading = false;
      this.spinner.hide();
    });
  }

  pwdOublie() {

    if(!this.newPassword)
    {
      this.toastr.error('Please provide a new password', '', {
        positionClass: 'toast-top-center'
      });
      return;
    }
    const data = { email: this.email, code: this.verificationCode, password: this.newPassword };

    this.authService.updatePassword(data).subscribe(
      response => {
        console.log('Response from backend:', response);
        this.toastr.success('Password updated successfully', '', {
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error updating password:', error);
        this.toastr.error('Error updating password', '', {
          positionClass: 'toast-top-center'
        });
      }
    );
  }

}
