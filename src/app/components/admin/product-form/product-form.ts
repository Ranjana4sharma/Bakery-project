import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],

  imports: [CommonModule, FormsModule]
})
export class AdminProductFormComponent implements OnInit {
  product: Product = { id: 0, name: '', description: '', price: 0, category: '', imageUrl: '' };
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const existingProduct = this.productService.getProductById(id);
      if (existingProduct) {
        this.product = { ...existingProduct };
        this.editMode = true;
      }
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return; // prevent submit if form invalid
    }
    if (this.editMode) {
      this.productService.updateProduct(this.product);
    } else {
      this.product.id = Date.now();
      this.productService.addProduct(this.product);
    }
    this.router.navigate(['/admin/products']);
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }
}
