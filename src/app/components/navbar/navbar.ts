import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, AuthUser } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  currentUser: AuthUser = { username: '', role: null };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
