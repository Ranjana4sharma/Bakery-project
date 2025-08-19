import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private localStorageKey = 'bakery-wishlist';

  getWishlistByUsername(username: string): Product[] {
    const data = localStorage.getItem(this.localStorageKey);
    if (!data) return [];
    const allWishlist = JSON.parse(data);
    return allWishlist[username] || [];
  }

  addToWishlist(username: string, product: Product) {
    let allWishlist = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
    if (!allWishlist[username]) {
      allWishlist[username] = [];
    }
    // prevent duplicates
    if (!allWishlist[username].find((p: Product) => p.id === product.id)) {
      allWishlist[username].push(product);
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(allWishlist));
  }

  removeFromWishlist(username: string, productId: number) {
    let allWishlist = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
    if (allWishlist[username]) {
      allWishlist[username] = allWishlist[username].filter((p: Product) => p.id !== productId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(allWishlist));
    }
  }
}
