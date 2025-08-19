import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, User } from '../../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-manager.html',
  styleUrls: ['./user-manager.css'],
})
export class UserManagerComponent implements OnInit, OnDestroy {
  users: User[] = [];
  allUsers: User[] = [];
  searchTerm: string = '';
  private sub = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.sub.add(
      this.userService.users$.subscribe(users => {
        this.allUsers = users;
        this.users = users;
        if (this.searchTerm) {
          this.searchUsers();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.users = this.allUsers;
    } else {
      this.users = this.allUsers.filter(
        u => u.username.toLowerCase().includes(term) ||
             u.email.toLowerCase().includes(term)
      );
    }
  }

  toggleActive(user: User) {
    user.active = !user.active;
    this.userService.updateUser(user);
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.userService.deleteUser(user.id);
    }
  }
}
