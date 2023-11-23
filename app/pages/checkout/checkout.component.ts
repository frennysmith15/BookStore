import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { delay, switchMap, tap } from 'rxjs';
import { Details, Order } from 'src/app/shared/interface/order.interface';
import { Store } from 'src/app/shared/interface/stores.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { Product } from '../products/interface/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{
  onPickUp(value: boolean): void {
    this.isDelivery = value;
  }
  ngOnInit(): void{
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onSubmit({value: formData}: NgForm): void {
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery

    }
    this.dataService.saveOrder(data)
    .pipe(
      tap( res => console.log( res)),
      switchMap(({id: orderId}) => {
        const details = this.prepareDetails();
        return this.dataService.saveDetailsOrder({details, orderId});
      }),
      tap( () => this.router.navigate(['/checkout/thank-you-page'])),
      delay(2000),
      tap(() => this.shoppingCartService.resetShoppingCart())
    )
    .subscribe()
  }

  model= {
    name: "",
    store: "",
    shippingAdress: "",
    city: ""
  };
  isDelivery = true;
  cart: Product[] = []
  stores : Store[] = []
  constructor(private dataService: DataService, private shoppingCartService: ShoppingCartService, private router: Router) { }

  private getStores(): void {
    this.dataService.getStores()
    .pipe(
      tap(res=> this.stores = res)
    )
    .subscribe()
  } 

  private getCurrentDay(): string{
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach( (product: Product) => {
      const {id: productId, name: productName, quantity, stock} = product;
      details.push({productId, productName, quantity})
      
    })
    return details;
  }

  private getDataCart(): void{
    this.shoppingCartService.cartAction$
    .pipe(
      tap((products: Product[])=> this.cart = products)
    )
    .subscribe()

  }
}
