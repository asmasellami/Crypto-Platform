import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  CurrentUser: User = new User();
  userId: number | null;
  constructor(private authService: AuthService,private router: Router, private activatedRoute: ActivatedRoute,) {
    this.userId = null;
   }

   ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId !== null) {
        this.authService.consulterUser(userId).subscribe({
          next: (user: User) => {
            this.CurrentUser = user;
          },
          error: (error) => {
            console.error('Failed to fetch user data', error);
          }
        });
      } else {
        console.error('No user ID available');
      }
    });

  }

}

