import { Component, OnInit} from '@angular/core';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth';
import { Product } from '../../models/product.model';
import { CommonModule, Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
  imports: [CommonModule]
})
export class WishlistComponent implements OnInit {
  wishlistItems: (Product & { icon: string })[] = [];

  private bakeryIcons = [
    'https://www.svgrepo.com/show/396245/cupcake.svg',
    'https://www.svgrepo.com/show/396232/croissant.svg',
    'https://www.svgrepo.com/show/395588/donut.svg',]

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private location: Location
  ) {}
goBack() {
    this.location.back();
  }
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      const items = this.wishlistService.getWishlistByUsername(user.username);

      // Assign random icon to each item every time it loads
      this.wishlistItems = items.map(product => ({
        ...product,
        icon: this.bakeryIcons[Math.floor(Math.random() * this.bakeryIcons.length)]
      }));
    }
  }

  removeFromWishlist(productId: number) {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      this.wishlistService.removeFromWishlist(user.username, productId);
      this.ngOnInit(); // reload to refresh icons as well
    }
  }
}
