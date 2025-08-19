import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-product-manager',
  templateUrl: './product-manager.html',
  styleUrls: ['./product-manager.css'],
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None // remove later if you want scoped CSS
})
export class ProductManagerComponent implements OnInit {
  products: Product[] = [];
  editedProduct: Product | null = null;

  name = '';
  category = '';
  price: number | null = null;
  description = '';
  imageUrl = '';
  signature = false;
  todaysSpecial = false;
  visible = true;

  categories = ['Cupcakes', 'Pastries', 'Cakes', 'Buns', 'Waffles', 'Pies'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log('ProductManagerComponent loaded');
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
  }

  startEdit(product: Product) {
    this.editedProduct = { ...product };
    this.name = product.name;
    this.category = product.category;
    this.price = product.price;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.signature = !!product.signature;
    this.todaysSpecial = !!product.todaysSpecial;
    this.visible = product.visible !== false;
  }

  cancelEdit() {
    if (
      this.name.trim() !== '' ||
      this.category !== '' ||
      this.price !== null ||
      this.description.trim() !== '' ||
      this.imageUrl.trim() !== '' ||
      this.signature ||
      this.todaysSpecial ||
      !this.visible
    ) {
      if (!confirm('Discard changes?')) return;
    }
    this.editedProduct = null;
    this.resetForm();
  }

  resetForm() {
    this.name = '';
    this.category = '';
    this.price = null;
    this.description = '';
    this.imageUrl = '';
    this.signature = false;
    this.todaysSpecial = false;
    this.visible = true;
  }

  saveProduct() {
    if (
      !this.name.trim() ||
      !this.category ||
      this.price === null ||
      !this.description.trim() ||
      !this.imageUrl.trim()
    ) {
      alert('Please fill all fields');
      return;
    }

    if (!this.isValidUrl(this.imageUrl)) {
      alert('Please enter a valid image URL.');
      return;
    }

    const productData: Product = {
      id: this.editedProduct?.id || Date.now(),
      name: this.name.trim(),
      category: this.category,
      price: this.price,
      description: this.description.trim(),
      imageUrl: this.imageUrl.trim(),
      signature: this.signature,
      todaysSpecial: this.todaysSpecial,
      visible: this.visible,
    };

    if (this.editedProduct) {
      this.productService.updateProduct(productData);
      alert(`Product "${this.name}" updated!`);
    } else {
      this.productService.addProduct(productData);
      alert(`Product "${this.name}" added!`);
    }

    this.loadProducts();
    this.cancelEdit();
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id);
      this.loadProducts();
    }
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
