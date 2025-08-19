import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product';
import { UserService } from '../../../services/user';
import { OrderService } from '../../../services/order';
import { OfferService } from '../../../services/offer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.html',
  styleUrls: ['./offers.css']
})
export class OffersComponent implements OnInit {
  offers: any[] = [];
  editingOffer: any = null;
  showModal = false;

  constructor(private offerService: OfferService) {}

  ngOnInit() {
    this.offers = this.offerService.getOffers();
  }

  openAddModal() {
    this.editingOffer = this.getEmptyOffer();
    this.showModal = true;
  }

  openEditModal(offer: any) {
    this.editingOffer = { ...offer };
    this.showModal = true;
  }

  saveOffer() {
    if (!this.editingOffer) return;

    if (this.editingOffer.id) {
      this.offerService.updateOffer(this.editingOffer);
    } else {
      this.offerService.addOffer(this.editingOffer);
    }
    this.offers = this.offerService.getOffers();
    this.showModal = false;
  }

  deleteOffer(id: number) {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offerService.deleteOffer(id);
      this.offers = this.offerService.getOffers();
    }
  }

  closeModal() { this.showModal = false; }

  private getEmptyOffer() {
    return {
      id: 0,
      code: '',
      discountType: 'percentage',
      amount: 0,
      minOrderValue: 0,
      expiryDate: '',
      applicableCategories: []
    };
  }
}
