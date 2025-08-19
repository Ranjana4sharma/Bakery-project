import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private storageKey = 'app_offers';
  private offers: Offer[] = [];
  private offersSubject = new BehaviorSubject<Offer[]>([]);

  offers$ = this.offersSubject.asObservable();

  constructor() {
    this.loadOffers();
  }

  /** Load offers from localStorage or default seed */
  private loadOffers() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.offers = JSON.parse(saved);
    } else {
      // default seed data
      this.offers = [
        {
          id: 1,
          code: 'WELCOME10',
          discountType: 'percentage',
          amount: 10,
          minOrderValue: 300,
          expiryDate: '2026-12-31'
        },
        {
          id: 2,
          code: 'CAKE50',
          discountType: 'fixed',
          amount: 50,
          minOrderValue: 500,
          expiryDate: '2025-12-31',
          applicableCategories: ['Cakes']
        }
      ];
      this.saveOffers();
    }
    this.offersSubject.next([...this.offers]);
  }

  private saveOffers() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.offers));
    this.offersSubject.next([...this.offers]);
  }

  /** Get current offers snapshot */
  getOffers(): Offer[] {
    return [...this.offers];
  }

  addOffer(offer: Offer) {
    offer.id = Date.now();
    this.offers.push(offer);
    this.saveOffers();
  }

  updateOffer(offer: Offer) {
    const idx = this.offers.findIndex(o => o.id === offer.id);
    if (idx > -1) {
      this.offers[idx] = { ...offer };
      this.saveOffers();
    }
  }

  deleteOffer(id: number) {
    this.offers = this.offers.filter(o => o.id !== id);
    this.saveOffers();
  }
}
