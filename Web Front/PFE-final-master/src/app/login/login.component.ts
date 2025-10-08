import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/*
export class LoginComponent implements OnInit {

  user = new User();
  erreur=0;
  err:number = 0;
  message : string = "login ou mot de passe erronés..";

  constructor(private authService : AuthService,private router: Router,private toastr: ToastrService) {}
  ngOnInit(): void {}

    onLoggedin() {
      if (!this.user.username || !this.user.password) {
        this.toastr.error('Please fill in all fields.');
        return;
      }

      this.authService.login(this.user).subscribe({
        next: (response) => {
          let jwToken = response.headers.get('Authorization')!;
          this.authService.saveToken(jwToken);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.log('Error during login:', err);

          if (err.error && err.error.errorCause === 'disabled') {
            this.toastr.error("User disabled");
          } else if (err.status === 403) {
            this.toastr.error("Invalid username or password");
          }
          else if (err.status === 401) {
            this.toastr.error("Invalid username or password");
          }
          else {
            console.error('An unexpected error occurred during login:', err);
           this.toastr.error('An unexpected error occurred. Please try again.');
          }
        }
      });
    }


  }
 */



  export class LoginComponent implements OnInit {

    user = new User();
    erreur=0;
    err:number = 0;
    message : string = "login ou mot de passe erronés..";

    constructor(private authService : AuthService,private router: Router,private toastr: ToastrService) {}
    ngOnInit(): void {}

      onLoggedin() {
        if (!this.user.username || !this.user.password) {
          this.toastr.error('Please fill in all fields.');
          return;
        }


       // torage.setItem('userPassword', this.user.password);
        sessionStorage.setItem('userPassword', this.user.password);

        this.authService.login(this.user).subscribe({
          next: (response) => {
            let jwToken = response.headers.get('Authorization')!;
            this.authService.saveToken(jwToken);

            if (this.authService.isAdmin()) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            console.log('Error during login:', err);

            if (err.error && err.error.errorCause === 'disabled') {
              this.toastr.error("User disabled");
            } else if (err.status === 403) {
              this.toastr.error("Invalid username or password");
            }
            else if (err.status === 401) {
              this.toastr.error("Invalid username or password");
            }
            else {
              console.error('An unexpected error occurred during login:', err);
             this.toastr.error('An unexpected error occurred. Please try again.');
            }
          }
        });
      }


    }







