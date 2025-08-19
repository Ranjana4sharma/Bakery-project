import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKeyPrefix = 'app_cart_'; // cart is saved per user
  private cartByUser: { [username: string]: (Product & { quantity: number })[] } = {};
  private cartSubjects: { [username: string]: BehaviorSubject<(Product & { quantity: number })[]> } = {};

  constructor() {
    // Listen for changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith(this.storageKeyPrefix)) {
        const username = event.key.replace(this.storageKeyPrefix, '');
        this.loadCart(username);
      }
    });
  }

  /** Get BehaviorSubject for a user's cart */
  cart$(username: string) {
    if (!this.cartSubjects[username]) {
      this.loadCart(username);
      this.cartSubjects[username] = new BehaviorSubject<(Product & { quantity: number })[]>(this.cartByUser[username] || []);
    }
    return this.cartSubjects[username].asObservable();
  }

  /** Internal: load cart from localStorage */
  private loadCart(username: string) {
    const saved = localStorage.getItem(`${this.storageKeyPrefix}${username}`);
    this.cartByUser[username] = saved ? JSON.parse(saved) : [];
    if (this.cartSubjects[username]) {
      this.cartSubjects[username].next([...this.cartByUser[username]]);
    }
  }

  /** Save and broadcast */
  private saveCart(username: string) {
    localStorage.setItem(`${this.storageKeyPrefix}${username}`, JSON.stringify(this.cartByUser[username] || []));
    if (this.cartSubjects[username]) {
      this.cartSubjects[username].next([...this.cartByUser[username]]);
    }
  }

  /** Get cart items for a specific user */
  getCartItemsByUsername(username: string): (Product & { quantity: number })[] {
    if (!this.cartByUser[username]) {
      this.loadCart(username);
    }
    return [...(this.cartByUser[username] || [])];
  }

  /** Add an item to the user’s cart */
  addToCart(username: string, product: Product, quantity: number = 1) {
    if (!this.cartByUser[username]) {
      this.cartByUser[username] = [];
    }
    const existing = this.cartByUser[username].find(p => p.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cartByUser[username].push({ ...product, quantity });
    }
    this.saveCart(username);
  }

  /** Remove an item completely */
  removeFromCart(username: string, productId: number) {
    if (this.cartByUser[username]) {
      this.cartByUser[username] = this.cartByUser[username].filter(p => p.id !== productId);
      this.saveCart(username);
    }
  }

  /** Clear the cart */
  clearCart(username: string) {
    this.cartByUser[username] = [];
    this.saveCart(username);
  }

  /** Calculate subtotal for a user */
  getSubtotal(username: string): number {
    return (this.cartByUser[username] || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}
