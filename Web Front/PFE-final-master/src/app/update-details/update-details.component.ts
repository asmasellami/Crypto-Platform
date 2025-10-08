import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-details',
  templateUrl: './update-details.component.html',
  styleUrls: ['./update-details.component.css']
})
/*export class UpdateDetailsComponent implements OnInit {
  userId: number | null;
  username: string;
  new_password:string;
  user: User | undefined;


  constructor(private authService: AuthService,private toastr: ToastrService,private activatedRoute: ActivatedRoute,private router: Router) {
    this.userId = null;
    this.username = '';
    this.new_password = ''
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe(
      userId => {
        this.userId = userId;
        console.log('User ID:', this.userId);
      },
      error => {
        console.error('Failed to fetch current user ID', error);
      }
    );
  }



 updateUsername(): void {
    if (this.userId === null) {
      console.error('User ID not available.');
      return;
    }
    if (!this.username) {
      this.toastr.error('New Username cannot be empty.');
      return;
    }
    this.authService.modifierNomUtilisateur(this.userId, this.username).subscribe(
      response => {
        console.log('Username updated successfully');
        this.toastr.success('Username updated successfully');
      },
      error => {
        console.error('Failed to update username', error);
        this.toastr.error('Failed to update username');

      }
    );
  }

  updatePassword(): void {
    if (this.userId === null) {
      console.error('User ID not available.');
      return;
    }
    if (!this.new_password) {
      this.toastr.error('New Password cannot be empty.');
      return;
    }
    this.authService.modifierMotDePasse(this.userId, this.new_password).subscribe(
      response => {
        console.log('password updated successfully');
        this.toastr.success('password updated successfully');
      },
      error => {
        console.error('Failed to update password', error);
        this.toastr.error('Failed to update password');
      }
    );
  }
}*/

export class UpdateDetailsComponent implements OnInit {
  userId: number | null;
  username: string;
  new_password: string;
  user: User | undefined;
  currentPassword: string | null;

  constructor(private authService: AuthService, private toastr: ToastrService) {
    this.userId = null;
    this.username = '';
    this.new_password = '';
    this.currentPassword = null;
  }

  ngOnInit(): void {
    const storedPassword = sessionStorage.getItem('userPassword');
    console.log(storedPassword)
    this.authService.getCurrentUserId().subscribe(
      userId => {
        this.userId = userId;
        console.log('User ID:', this.userId);
      },
      error => {
        console.error('Failed to fetch current user ID', error);
      }
    );

    this.authService.getCurrentUsername().subscribe(
      currentUsername => {
        this.username = currentUsername || '';
        console.log('Current username:', this.username);
      },
      usernameError => {
        console.error('Failed to fetch current username', usernameError);
      }
    );
  }

  updateUsername(): void {
    if (this.userId === null) {
      console.error('User ID not available.');
      return;
    }
    if (!this.username) {
      this.toastr.error('New Username cannot be empty.');
      return;
    }

    const storedPassword = sessionStorage.getItem('userPassword');
    if (!storedPassword) {
      console.error('Stored password not found.');
      this.toastr.error('Stored password not found.');
      return;
    }

    this.authService.modifierNomUtilisateur(this.userId!, this.username).subscribe(
      response => {
        console.log('Username updated successfully');
        this.toastr.success('Username updated successfully');
        const updatedUser = new User();
        updatedUser.username = this.username;
        updatedUser.password = storedPassword;

        this.authService.login(updatedUser).subscribe(
          loginResponse => {
            console.log('Login successful:', loginResponse);
            const jwtToken = loginResponse.headers.get('Authorization');
            if (jwtToken) {
              this.authService.saveToken(jwtToken);
            } else {
              console.error('No JWT token found in login response headers.');
              this.toastr.error('No JWT token found in login response headers.');
            }
          },
          loginError => {
            console.error('Failed to login with updated username', loginError);
            this.toastr.error('Failed to login with updated username');
          }
        );
      },
      error => {
        console.error('Failed to update username', error);
        this.toastr.error('Failed to update username');
      }
    );
  }

  updatePassword(): void {
    if (this.userId === null) {
      console.error('User ID not available.');
      return;
    }
    if (!this.new_password) {
      this.toastr.error('New Password cannot be empty.');
      return;
    }
    this.authService.modifierMotDePasse(this.userId, this.new_password).subscribe(
      response => {
        console.log('Password updated successfully');
        this.toastr.success('Password updated successfully');
      },
      error => {
        console.error('Failed to update password', error);
        this.toastr.error('Failed to update password');
      }
    );
  }
}
