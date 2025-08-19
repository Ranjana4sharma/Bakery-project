import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  bakeryName: string = 'Sweet Crust Bakery';

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
