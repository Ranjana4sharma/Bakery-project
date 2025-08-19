import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { OrderService, Order } from '../../services/order';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order-history',
   templateUrl: './order-history.html',
  styleUrls: ['./order-history.css'],
  imports: [CommonModule]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(private authService: AuthService, private orderService: OrderService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.username) {
      this.orders = this.orderService.getOrdersByUsername(user.username);
    }
  }
}
