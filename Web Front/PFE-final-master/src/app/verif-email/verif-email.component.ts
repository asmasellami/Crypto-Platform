import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-verif-email',
  templateUrl: './verif-email.component.html',
  styleUrls: ['./verif-email.component.css']
})
export class VerifEmailComponent implements OnInit {
  code: string = "";
  user: User = new User();
  err = "";
  constructor(private route: ActivatedRoute, private authService: AuthService,private router: Router, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.user = this.authService.regitredUser;
  }

  onValidateEmail() {
    this.authService.validateEmail(this.code).subscribe({
      next: (res) => {
        this.toastr.success('Login successful', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });

        this.authService.login(this.user).subscribe({
          next: (data) => {
            let jwToken = data.headers.get('Authorization')!;
            this.authService.saveToken(jwToken);
            this.router.navigate(['/futures']);
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.toastr.error(err.error.message, 'Error', {
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

