import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { OfferService } from '../../services/offer';
import { Offer } from '../../models/offer.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signature-dishes',
  standalone: true,
  templateUrl: './signature-dishes.html',
  styleUrls: ['./signature-dishes.css'],
  imports: [CommonModule, FormsModule]
})
export class SignatureDishesComponent implements OnInit {
  signatureDishes: Product[] = [];
  filteredDishes: Product[] = [];
  sortBy = 'popularity';
  searchTerm = '';

  bakeryStory: string = `
    Our signature dishes are handcrafted with care, using cherished recipes and the finest ingredients.
    Each creation is a unique blend of tradition, taste, and artistry.
  `;

  specialDeals: string = `Special Combo Offer: Order any 3 signature dishes and get 10% OFF!`;

  allOffers: Offer[] = [];

  // For expired offer check
  today = new Date();

  constructor(
    private productService: ProductService,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSignatureDishes();
    this.applyFilters();
    this.allOffers = this.offerService.getOffers();
  }

  loadSignatureDishes() {
    const allProducts = this.productService.getProducts();
    this.signatureDishes = allProducts.filter(p => p.signature === true);
  }

  applyFilters() {
    let filtered = [...this.signatureDishes];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    if (this.sortBy === 'priceLowHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'priceHighLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'popularity') {
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    this.filteredDishes = filtered;
  }

  openProductDetails(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  // Check if an offer is expired
  isExpired(dateStr: string): boolean {
    const exp = new Date(dateStr);
    return exp.getTime() < this.today.getTime();
  }
}
