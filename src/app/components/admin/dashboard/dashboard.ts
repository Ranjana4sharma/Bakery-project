import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order';
import { UserService, User } from '../../../services/user';
import { ProductService } from '../../../services/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

interface UserMessage {
  id: number;
  userId: string;
  name: string;
  type: 'feedback' | 'contact' | 'complaint';
  rating?: number;
  message: string;
  adminReply?: string;
  visibleOnHome: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  totalOrders = 0;
  newOrders = 0;
  totalUsers = 0;
  totalProducts = 0;

  recentOrders: any[] = [];
  recentUsers: User[] = [];

  // New messaging system vars
  messages: UserMessage[] = [];
  filterType: 'all' | 'feedback' | 'contact' | 'complaint' = 'all';

  private subscriptions = new Subscription();

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadMessages();

    // Orders subscription
    if ((this.orderService as any).orders$) {
      this.subscriptions.add(
        (this.orderService as any).orders$.subscribe(() => {
          this.recentOrders = this.orderService.getRecentOrders(5);
        })
      );
    } else {
      this.recentOrders = this.orderService.getRecentOrders(5);
    }

    // Users subscription
    this.subscriptions.add(
      this.userService.users$.subscribe(users => {
        this.totalUsers = users.length;
        this.recentUsers = users.slice().reverse().slice(0, 5);
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadStats() {
    this.totalOrders = this.orderService.getTotalOrders();
    this.newOrders = this.orderService.getNewOrdersCount();
    this.totalUsers = this.userService.getTotalUsers();
    this.totalProducts = this.productService.getTotalProducts();
  }

  getUserName(username: string): string {
    const user = this.userService.getUserByUsername(username);
    return user ? user.name : username;
  }

  gotoOrders()   { this.router.navigate(['/admin/orders']); }
  gotoUsers()    { this.router.navigate(['/admin/users']); }
  gotoProducts() { this.router.navigate(['/admin/products']); }
  gotoOffers()   { this.router.navigate(['/admin/offers']); }

  // ===== Messaging System Methods =====
  loadMessages() {
    const stored = localStorage.getItem('messages');
    this.messages = stored ? JSON.parse(stored) : [];
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  filteredMessages() {
    if (this.filterType === 'all') return this.messages;
    return this.messages.filter(m => m.type === this.filterType);
  }

  replyTo(msg: UserMessage) {
    this.saveMessages();
    alert('Reply saved and will be visible in the user profile.');
  }

  toggleVisible(msg: UserMessage) {
    msg.visibleOnHome = !msg.visibleOnHome;
    this.saveMessages();
  }
}
