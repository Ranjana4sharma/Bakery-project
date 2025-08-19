import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  loginType: 'admin' | 'user' = 'user';  // Default to 'user'
  username: string = '';
  password: string = '';
  phone: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loginType === 'admin') {
      if (this.authService.login(this.username, this.password)) {
        alert('Admin login successful!');
        this.router.navigate(['/admin']);
      } else {
        alert('Invalid admin credentials');
      }
    } else if (this.loginType === 'user') {
      if (this.username && this.phone.length >= 4) {
        const success = this.authService.login(this.username, 'dummy'); // Password unused for user
        if (success) {
          alert('User login successful!');
          this.router.navigate(['/profile']);
        } else {
          alert('User login failed');
        }
      } else {
        alert('Please enter a valid name and phone number (min 4 digits)');
      }
    }
  }
}
