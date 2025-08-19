import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { ShopComponent } from './components/shop/shop';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { WishlistComponent } from './components/wishlist/wishlist';
import { OrderHistoryComponent } from './components/order-history/order-history';
import { LoginComponent } from './components/login/login';
import { FeedbackComponent } from './components/feedback/feedback';
import { AboutComponent } from './components/about/about';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { SignatureDishesComponent } from './components/signature-dishes/signature-dishes';
import { ContactComponent } from './components/contact/contact';
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard';
// import { AdminProductListComponent } from './components/admin/products/admin-product-list';
import { AdminProductFormComponent } from './components/admin/product-form/product-form';
import { OffersComponent } from './components/admin/offers/offers';
import { UserManagerComponent } from './components/admin/user-manager/user-manager';
import { OrdersComponent } from './components/admin/orders/orders';
import { FooterComponent } from './footer/footer';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';
import { ProductManagerComponent } from './components/admin/product-manager/product-manager';

export const routes: Routes = [
  // Public/User routes
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'products/:category', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'categories', redirectTo: '/shop', pathMatch: 'full' },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'signature-dishes', component: SignatureDishesComponent },
  {path: 'contact', component: ContactComponent },


  // Admin dashboard route with child routes for all admin features
   // Admin main dashboard page
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },

  // Admin feature pages as top-level routes (not inside dashboard children)
  // {
  //   path: 'admin/products',
  //   component: AdminProductListComponent,
  //   canActivate: [AdminGuard]
  // },
  {
    path: 'admin/products',
    component: ProductManagerComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/products/add',
    component: AdminProductFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/products/edit/:id',
    component: AdminProductFormComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/offers',
    component: OffersComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/users',
    component: UserManagerComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/orders',
    component: OrdersComponent,
    canActivate: [AdminGuard]
  },

  // Wildcard route to redirect unknown paths
  { path: '**', redirectTo: '' },
];
