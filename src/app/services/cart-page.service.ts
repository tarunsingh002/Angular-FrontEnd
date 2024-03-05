import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart } from "../models/cart.model";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: "root",
})
export class CartPageService {
  cartChanged = new BehaviorSubject<Cart[]>(null);
  cart: Cart[] = [];

  constructor(private pservice: ProductService) {}

  addToCart(id: number, q: number) {
    if (!this.cart.find((c) => c.id === id))
      this.cart.push({ id: id, quantity: q });
    else this.cart.find((c) => c.id === id).quantity++;
    this.cartChanged.next(this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  displayCartGetter(cart: Cart[]) {
    let allProducts = this.pservice.getProducts();
    let displayCart = cart.map((c) => {
      return {
        product: allProducts.find((p) => p.productId === c.id),
        quantity: c.quantity,
      };
    });

    return displayCart;
  }

  editCart(cart: Cart[]) {
    this.cart = cart;
    this.cartChanged.next(this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}
