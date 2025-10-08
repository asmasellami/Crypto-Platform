import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  constructor(private authService: AuthService, private toastr: ToastrService,private router: Router) {}

  onAddUser(form: NgForm) {
    if (!form.valid) {
      this.toastr.error('Please fill the form correctly!');
      return;
    }
    const newUser: User = new User();
    newUser.username = form.value.username;
    newUser.email = form.value.email;
    newUser.password = form.value.password;
    newUser.roles = form.value.roles;
    newUser.enabled = false;

    this.authService.addUser(newUser).subscribe({
      next: (response) => {
        this.toastr.success('User added successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errorMessage = err.error.message || 'Error while adding the new user';
        console.error('Error:', err);
        this.toastr.error(errorMessage);
      }
    });
  }
}
