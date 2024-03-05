import { Injectable } from "@angular/core";

import { User } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map } from "rxjs/operators";
import { Cart } from "../../models/cart.model";
import { Order } from "../../models/order.model";
import { of } from "rxjs";
import { CartPageService } from "../cart-page.service";
import { Product } from "src/app/models/product.model";
import { apiUrl } from "src/app/apiutility";

export interface OrderItem {
  orderItemId: number;
  product: Product;
  quantity: number;
}

export interface order {
  orderId: number;
  orderItems: OrderItem[];
  user: any;
  timestamp: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  users: User[] = [];

  api: string = `${apiUrl}/api/v1`;
  constructor(private http: HttpClient, private cservice: CartPageService) {}

  createOrder(cart: Cart[]) {
    let displayCart = this.cservice.displayCartGetter(cart);
    return this.http.post<order>(`${this.api}/user/createorder`, displayCart);
  }
  loadUserOrders() {
    return this.http.get<order[]>(`${this.api}/user/getorders`);
  }
}
