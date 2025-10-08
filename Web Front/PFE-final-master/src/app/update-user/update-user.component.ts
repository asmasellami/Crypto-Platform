import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  userToUpdate: User = new User();

  constructor(private authService: AuthService,private activatedRoute: ActivatedRoute,private router: Router,private toastr: ToastrService) {

   }

  ngOnInit(): void {
    this.authService.consulterUser(this.activatedRoute.snapshot.params['id']).subscribe((user) => {
        this.userToUpdate = user;

      });
  }

  updateUser() {
    this.authService.updateUser(this.userToUpdate).subscribe((user) => {
          this.router.navigate(['/dashboard']);
      });
  }

}

