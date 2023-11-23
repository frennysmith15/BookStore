import { Component } from '@angular/core';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  total$;
  cart$;

  constructor(private shoppingCartService: ShoppingCartService) {
    this.total$ = this.shoppingCartService.totalAction$;
    this.cart$ = this.shoppingCartService.cartAction$;
  }
}
