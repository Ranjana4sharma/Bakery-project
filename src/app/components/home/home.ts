import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PRODUCTS_MOCK, TODAY_SPECIAL_IDS } from '../../mock-data/products.mock';
import { CATEGORIES, Category } from '../../mock-data/categories.mock';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { WishlistService } from '../../services/wishlist';
import { OrderService } from '../../services/order';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../services/offer';
import { Offer } from '../../models/offer.model';
import { CartService } from '../../services/cart';

interface UserMessage {
  id: number;
  userId: string;
  name: string;
  type: 'feedback' | 'contact' | 'complaint';
  rating?: number;
  message: string;
  visibleOnHome: boolean;
  timestamp: string;
}

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterLink, FormsModule]
})
export class HomeComponent implements OnInit {
  heroImages: string[] = [
    'https://images.pexels.com/photos/18296425/pexels-photo-18296425.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/30624522/pexels-photo-30624522.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/29639675/pexels-photo-29639675.jpeg?auto=compress&w=800'
  ];
  bakeryName = 'Sweet Crust Bakery';

  currentHeroIndex = 0;
  categories: (Category & { count: number })[] = [];
  todaysSpecial: Product[] = [];
  showProductModal = false;
  selectedProduct: Product | null = null;

  galleryImages: string[] = [
    'https://www.shutterstock.com/image-photo/bakery-shop-assortment-bread-on-600nw-2498875445.jpg',
    'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=600',
    'https://images.pexels.com/photos/17721684/pexels-photo-17721684.jpeg',
  ];

  allOffers: Offer[] = [];
  approvedFeedback: UserMessage[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private offerService: OfferService,
    private cartService: CartService
  ) {
    this.setCategoriesWithCount();
    this.todaysSpecial = PRODUCTS_MOCK.filter(p => TODAY_SPECIAL_IDS.includes(p.id));
    this.startHeroSlideshow();
  }

  ngOnInit() {
    this.offerService.offers$.subscribe(offers => {
      this.allOffers = offers;
    });
    this.loadApprovedFeedback();
  }

  private setCategoriesWithCount() {
    this.categories = CATEGORIES.map(cat => ({
      ...cat,
      count: PRODUCTS_MOCK.filter(p => p.category === cat.name).length
    }));
  }

  startHeroSlideshow() {
    setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
    }, 5000);
  }

  goToCategory(category: Category) {
    this.router.navigate(['/shop'], { queryParams: { category: category.name } });
  }

  openProductModal(product: Product) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  addToWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to add items to your wishlist.');
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getCurrentUser();
    this.wishlistService.addToWishlist(user!.username, product);
    alert('Added to wishlist!');
  }

  // ✅ Updated flow: Add to cart & go to checkout page instead of direct order
  orderProduct(product: Product) {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to place orders.');
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('User data not found, please login again.');
      this.router.navigate(['/login']);
      return;
    }

    // Add product to user's cart (Product now supports quantity)
    this.cartService.addToCart(user.username, { ...product, quantity: 1 });

    // Navigate to cart section in profile with checkout highlight
    this.router.navigate(['/profile'], { queryParams: { checkout: 'true' } });
  }

  // Load feedback approved by admin for home display
  loadApprovedFeedback() {
    const stored = localStorage.getItem('messages');
    const allMsgs: UserMessage[] = stored ? JSON.parse(stored) : [];
    this.approvedFeedback = allMsgs.filter(
      m => m.type === 'feedback' && m.visibleOnHome
    );
  }
}
