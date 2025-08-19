import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService, AuthUser } from '../../services/auth';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user';
import { Subscription } from 'rxjs';
import { WishlistComponent } from '../wishlist/wishlist';
import { OrderHistoryComponent } from '../order-history/order-history';
import { OfferService } from '../../services/offer';
import { CartService } from '../../services/cart';
import { Offer } from '../../models/offer.model';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order';
import { TODAY_SPECIAL_IDS } from '../../mock-data/products.mock';
import { WishlistService } from '../../services/wishlist';

interface UserMessage {
  id: number;
  userId: string;
  name: string;
  type: 'feedback' | 'contact' | 'complaint';
  rating?: number;
  message: string;
  adminReply?: string;
  visibleOnHome: boolean;
  timestamp: string;
}

@Component({
  standalone: true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
  imports: [CommonModule, RouterLink, WishlistComponent, OrderHistoryComponent, FormsModule]
})
export class UserProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser: AuthUser | null = null;
  private sub = new Subscription();

  offers: Offer[] = [];
  eligibleOffers: Offer[] = [];
  cartItems: any[] = [];
  subtotal = 0;
  selectedCode = '';
  appliedOffer: Offer | null = null;
  discountAmount = 0;
  finalTotal = 0;
  message = '';
  private scrollToCheckout = false;

  userMessages: UserMessage[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private offerService: OfferService,
    private cartService: CartService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.route.queryParams.subscribe(params => {
      if (params['checkout'] === 'true') {
        this.scrollToCheckout = true;
      }
    });

    if (this.currentUser?.username) {
      this.sub.add(
        this.userService.users$.subscribe(users => {
          const user = users.find(u => u.username === this.currentUser?.username);
          if (!user || user.active === false) {
            this.authService.logout();
            alert('Your account has been suspended or deleted by admin.');
            this.router.navigate(['/login']);
          }
        })
      );

      this.offers = this.offerService.getOffers();
      this.cartItems = this.cartService.getCartItemsByUsername(this.currentUser.username) || [];
      this.calculateSubtotal();
      this.filterEligibleOffers();
      this.loadUserMessages();
    }
  }

  ngAfterViewInit() {
    if (this.scrollToCheckout) {
      setTimeout(() => {
        const cartSection = document.querySelector('.cart-section');
        if (cartSection) {
          cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          cartSection.classList.add('highlight-flash');
          setTimeout(() => {
            cartSection.classList.remove('highlight-flash');
          }, 2500);
        }
      }, 300);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.location.back();
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    this.finalTotal = this.subtotal;
  }

  filterEligibleOffers() {
    const now = new Date();
    const cartCategories = new Set(this.cartItems.map(i => i.category).filter(Boolean));
    const cartIds = new Set(this.cartItems.map(i => i.id));

    this.eligibleOffers = this.offers.filter(o => {
      if (o.expiryDate && new Date(o.expiryDate) < now) return false;
      if (o.minOrderValue && this.subtotal < o.minOrderValue) return false;

      if (o.applicableCategories?.length) {
        const hasMatch = o.applicableCategories.some(cat => cartCategories.has(cat));
        const hasTodaySpecial = [...cartIds].some(id => TODAY_SPECIAL_IDS.includes(id));
        if (!hasMatch && !hasTodaySpecial) return false;
      }
      return true;
    });
  }

  applyOfferFromList(offer: Offer) {
    this.selectedCode = offer.code;
    this.applyOffer();
  }

  applyOffer() {
    this.appliedOffer = null;
    this.discountAmount = 0;
    this.finalTotal = this.subtotal;
    this.message = '';

    const offer = this.offers.find(o => o.code.toLowerCase() === this.selectedCode.toLowerCase());
    if (!offer) {
      this.message = 'Invalid offer code.';
      return;
    }
    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      this.message = 'This offer has expired.';
      return;
    }
    if (offer.minOrderValue && this.subtotal < offer.minOrderValue) {
      this.message = `Minimum order value for this offer is ₹${offer.minOrderValue}.`;
      return;
    }
    if (offer.discountType === 'percentage') {
      this.discountAmount = (this.subtotal * offer.amount) / 100;
    } else {
      this.discountAmount = offer.amount;
    }
    this.finalTotal = Math.max(this.subtotal - this.discountAmount, 0);
    this.appliedOffer = offer;
    this.message = 'Offer applied successfully!';
  }

  removeFromCart(productId: number) {
    if (!this.currentUser) return;
    this.cartService.removeFromCart(this.currentUser.username, productId);
    this.cartItems = this.cartService.getCartItemsByUsername(this.currentUser.username);
    this.calculateSubtotal();
    this.filterEligibleOffers();
  }

  moveToWishlist(product: any) {
    if (!this.currentUser) return;
    this.cartService.removeFromCart(this.currentUser.username, product.id);
    this.wishlistService.addToWishlist(this.currentUser.username, product);
    this.cartItems = this.cartService.getCartItemsByUsername(this.currentUser.username);
    this.calculateSubtotal();
    this.filterEligibleOffers();
  }

  placeCartOrder() {
    if (!this.currentUser) return;
    if (this.cartItems.length === 0) return;

    const orderItems = this.cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const order = {
      id: Date.now(),
      username: this.currentUser.username,
      items: orderItems,
      totalAmount: this.finalTotal,
      offerCode: this.appliedOffer?.code || null,
      status: 'pending' as const,
      orderDate: new Date().toISOString()
    };

    this.orderService.addOrder(order);
    alert('Order placed successfully!');
    this.cartService.clearCart(this.currentUser.username);
    this.cartItems = [];
    this.calculateSubtotal();
    this.filterEligibleOffers();
    this.selectedCode = '';
    this.appliedOffer = null;
    this.discountAmount = 0;
    this.finalTotal = 0;
    this.message = '';
    this.router.navigate(['/order-history']);
  }

  loadUserMessages() {
    const stored = localStorage.getItem('messages');
    const allMsgs: UserMessage[] = stored ? JSON.parse(stored) : [];
    if (this.currentUser) {
      this.userMessages = allMsgs.filter(m => m.userId === this.currentUser!.username);
    }
  }
}
