// shop.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { CATEGORIES, Category } from '../../mock-data/categories.mock';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class ShopComponent implements OnInit {
  categories: Category[] = CATEGORIES;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory = 'All';
  sortBy = 'none';
  searchTerm = '';

  expanded: boolean[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.expanded = this.products.map(() => false);

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['category'] && this.categories.find(c => c.name === params['category'])) {
        this.selectedCategory = params['category'];
      } else {
        this.selectedCategory = 'All';
      }
      this.applyFilters();
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
    this.router.navigate([], {
      queryParams: { category: cat === 'All' ? null : cat },
      queryParamsHandling: 'merge',
    });
  }

  applyFilters() {
    let filtered = [...this.products];

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(
        p => p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    if (this.sortBy === 'priceLowHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'priceHighLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = filtered;
    // Reset expanded states accordingly, preserving array length with false values
    this.expanded = new Array(filtered.length).fill(false);
  }

  openProductDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  toggleDescription(index: number) {
    this.expanded[index] = !this.expanded[index];
  }

  isDescriptionLong(desc: string): boolean {
    if (!desc) return false;
    const approxCharsForTwoLines = 100; // Adjust based on font and container width
    return desc.length > approxCharsForTwoLines;
  }
}
