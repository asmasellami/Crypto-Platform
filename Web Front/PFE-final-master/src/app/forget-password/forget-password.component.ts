import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  email: string = '';
  code: string = '';
  userEmail: string = '';
  err = '';
  showVerificationFields: boolean = false;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void { }

  verifyUserByEmail() {
    if (!this.userEmail) {
      console.error('Please enter an email.');
      this.toastr.error('Please enter an Email', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    this.authService.verifyUser(this.userEmail).subscribe(
      response => {
        console.log('Verification successful:', response);
        this.toastr.success('Verification email sent successfully');
        this.showVerificationFields = true;
      },
      error => {
        console.error('Verification failed:', error);

        if (error.status === 404) {
          this.toastr.error('Email not found!', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        } else if (error.status === 409) {
          console.error('Email is already verified.');
          this.toastr.error('Email is already verified', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        } else {
          console.error('Unexpected error during verification:', error);
          this.toastr.error('Unexpected error during verification.');
        }
      }
    );
  }

  onValidateCode() {
    this.authService.validateEmail(this.code).subscribe({
      next: (res) => {
        this.toastr.success('Your account is successfully verified', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        }),
        this.showVerificationFields = false;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.status === 500) {
          this.toastr.error('Invalid code', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        } else {
          this.toastr.error('An error occurred', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
        console.log(err.errorCode);
      }
    });
  }

  }


