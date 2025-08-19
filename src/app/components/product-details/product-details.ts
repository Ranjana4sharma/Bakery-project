import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { WishlistService } from '../../services/wishlist';
import { OrderService } from '../../services/order';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(productId);
  }

  addToWishlist() {
    const user = this.authService.getCurrentUser();
    if (!this.authService.isLoggedIn() || !user) {
      alert('Please login to add items to your wishlist.');
      this.router.navigate(['/login']);
      return;
    }
    if (this.product) {
      this.wishlistService.addToWishlist(user.username, this.product);
      alert('Added to wishlist!');
    }
  }

  /** ✅ Updated Order Now flow with ?checkout=true param */
  orderProduct() {
    const user = this.authService.getCurrentUser();
    if (!this.authService.isLoggedIn() || !user) {
      alert('Please login to proceed.');
      this.router.navigate(['/login']);
      return;
    }
    if (this.product) {
      // 1. Add to cart
      this.cartService.addToCart(user.username, this.product, 1);
      // 2. Notify user
      alert('Product added to cart. You can now apply offers before checking out.');
      // 3. Redirect to profile with checkout flag
      this.router.navigate(['/profile'], { queryParams: { checkout: 'true' } });
    }
  }

  addToCart() {
    const user = this.authService.getCurrentUser();
    if (!this.authService.isLoggedIn() || !user) {
      alert('Please login to add to cart.');
      this.router.navigate(['/login']);
      return;
    }
    if (this.product) {
      this.cartService.addToCart(user.username, this.product, 1);
      alert('Item added to cart!');
    }
  }
}
