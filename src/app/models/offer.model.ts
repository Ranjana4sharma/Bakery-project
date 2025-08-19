// src/app/models/offer.model.ts

export interface Offer {
  id: number;                           // Unique offer ID
  code: string;                         // Coupon/promo code
  discountType: 'percentage' | 'fixed'; // Type of discount (e.g., 10% off or Rs.50 off)
  amount: number;                       // Discount value
  minOrderValue?: number;                // Minimum order value to apply offer
  expiryDate?: string;                   // Expiry as ISO date string (optional)
  applicableCategories?: string[];       // Array of category names if category-specific
}
