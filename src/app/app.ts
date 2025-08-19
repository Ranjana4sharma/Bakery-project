import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './footer/footer';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showBackButton = true;

  constructor(private location: Location, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showBackButton = event.urlAfterRedirects !== '/'; // Hide on home page
    });
  }

  goBack() {
    this.location.back();
  }
}
