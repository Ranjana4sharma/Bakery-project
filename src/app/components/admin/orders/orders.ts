import { Component, OnInit } from '@angular/core';
import { OrderService, OrderStatus } from '../../../services/order';
import { UserService } from '../../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm = '';
  statusFilter: string = 'all';

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit() {
    this.orders = this.orderService.getOrders();
    this.filteredOrders = [...this.orders];
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch =
        order.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.id.toString().includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  updateStatus(order: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as OrderStatus;
    order.status = newStatus;
    this.orderService.updateOrderStatus(order.id, newStatus);
    this.filterOrders();
  }

  getCustomerName(username: string): string {
    const user = this.userService.getUsers().find(u => u.username === username);
    return user ? user.name : username;
  }

  goBack() {
    this.location.back();
  }

  deleteOrder(orderId: number) {
  if (confirm('Are you sure you want to delete this order?')) {
    // Remove from local arrays (to update UI instantly)
    this.orders = this.orders.filter(order => order.id !== orderId);
    this.filteredOrders = this.filteredOrders.filter(order => order.id !== orderId);

    // Remove from localStorage via service
    this.orderService.deleteOrder(orderId);
  }
}

    }
  
