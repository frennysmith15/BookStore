import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { tap } from 'rxjs';
import { Product } from './interface/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products!: Product[]; 

  constructor(private productSvc: ProductsService, private shoppingCartSvc: ShoppingCartService) { }
  
  ngOnInit(): void {
    this.productSvc.getProducts()
    .pipe(
      tap( res => this.products = res)
    )
    .subscribe();
  }
 // Creamos esta funcion con el objetivo de obtener el producto a través del evento
  addToCart(product: Product) : void {
    this.shoppingCartSvc.updateCart(product)
  }
}
