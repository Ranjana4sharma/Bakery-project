import { Injectable } from '@angular/core';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order interface defining the structure of an order
export interface Order {
  id: number;
  username: string;    // The user who placed the order
  items: any[];        // Array of ordered items (can be strictly typed as needed)
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;   // ISO date string representing order date
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'orders';

  constructor() {}

  // Get all orders from localStorage (returns empty array if none)
  getOrders(): Order[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  // Save the full orders array back to localStorage
  saveOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  // Add a new order (automatically assigns timestamp as ID and date)
  addOrder(order: Order): void {
    const orders = this.getOrders();
    order.id = Date.now();
    order.orderDate = new Date().toISOString();
    orders.push(order);
    this.saveOrders(orders);
  }

  // Update an entire order by matching its ID
  updateOrder(updatedOrder: Order): void {
    let orders = this.getOrders();
    orders = orders.map(order => order.id === updatedOrder.id ? { ...updatedOrder } : order);
    this.saveOrders(orders);
  }

  // Delete an order by ID
  deleteOrder(id: number): void {
    let orders = this.getOrders();
    orders = orders.filter(order => order.id !== id);
    this.saveOrders(orders);
  }

  // Get orders for a specific username
  getOrdersByUsername(username: string): Order[] {
    return this.getOrders().filter(order => order.username === username);
  }

  // Helper: Get total number of orders
  getTotalOrders(): number {
    return this.getOrders().length;
  }

  // Helper: Get count of orders with status 'pending'
  getNewOrdersCount(): number {
    return this.getOrders().filter(order => order.status === 'pending').length;
  }

  // Helper: Get most recent N orders sorted by date descending
  getRecentOrders(count: number): Order[] {
    return this.getOrders()
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, count);
  }

  // Update only the status of an order by ID
  updateOrderStatus(orderId: number, newStatus: OrderStatus): void {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      this.saveOrders(orders);
    }
  }

  // Optional: Get order by its ID
  getOrderById(orderId: number): Order | undefined {
    return this.getOrders().find(order => order.id === orderId);
  }
  
}
