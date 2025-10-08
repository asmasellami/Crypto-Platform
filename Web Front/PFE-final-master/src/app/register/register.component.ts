import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user = new User();
  confirmPassword?: string;
  myForm!: FormGroup;
  err!: any;
loading: any;
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router , private toastr: ToastrService) { }
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }


/*onRegister() {

  this.loading = true;

  this.authService.registerUser(this.user).subscribe({
    next: (res: any) => {
      this.authService.setRegistredUser(this.user);
      this.toastr.success('Please confirm your email', 'Confirmation', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      this.router.navigate(["/verifEmail"]);
    },
    error: (err: any) => {
      if (err.error.message === 'Email already exists!') {
        this.toastr.error('Email already exists!', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
    },
    complete: () => {

      this.loading = false;
    }
  });
}*/


onRegister() {
  this.loading = true;

  this.authService.registerUser(this.user).subscribe({
    next: (res: any) => {
      this.authService.setRegistredUser(this.user);
      this.toastr.success('Please confirm your email', 'Confirmation', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      this.router.navigate(['/verifEmail']);
    },
    error: (err: any) => {
      if (err.error.message === 'email déjà existant!') {
        this.toastr.error('Email already exists!', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      } else {
        this.toastr.error('An error occurred during registration.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}

}
