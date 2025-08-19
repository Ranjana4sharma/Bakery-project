import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  templateUrl: './admin-product-list.html',
  imports: [CommonModule], 
})
export class AdminProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
      this.loadProducts();
    }
  }

  addProduct() {
    this.router.navigate(['/admin/products/add']);
  }
}
