import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS_MOCK } from '../mock-data/products.mock';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private localStorageKey = 'bakery-products';

  constructor() {
    this.initializeProducts();
  }

  private initializeProducts() {
    const data = localStorage.getItem(this.localStorageKey);
    // Seed localStorage if empty or data invalid
    if (!data || this.isDataInvalid(data)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(PRODUCTS_MOCK));
    }
  }

  private isDataInvalid(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      return !Array.isArray(parsed);
    } catch {
      return true;
    }
  }

  getProducts(): Product[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  getProductById(id: number): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product: Product) {
    const products = this.getProducts();
    products.push(product);
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }

  updateProduct(updatedProduct: Product) {
    let products = this.getProducts();
    products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }

  deleteProduct(id: number) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }
  getTotalProducts(): number {
  return this.getProducts().length;
}

}
