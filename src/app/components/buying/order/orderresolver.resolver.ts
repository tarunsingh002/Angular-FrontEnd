import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, concat, of } from "rxjs";
import { AuthService } from "../../../services/auth-services/auth.service";
import {
  OrderItem,
  UserService,
  order,
} from "../../../services/auth-services/user.service";
import { User } from "../../../models/user.model";
import { exhaustMap, tap } from "rxjs/operators";
import { LoadingService } from "../../../services/loading.service";
import { ProductDataService } from "../../../services/product-data.service";
import { OrderService } from "./order.service";
import { Cart } from "../../../models/cart.model";
import { CartPageService } from "../../../services/cart-page.service";
import { Product } from "src/app/models/product.model";

@Injectable({
  providedIn: "root",
})
export class OrderresolverResolver
  implements Resolve<{ user: User; res: string[] }>
{
  constructor(
    private aservice: AuthService,
    private uservice: UserService,
    private l: LoadingService,
    private dservice: ProductDataService,
    private oservice: OrderService,
    private cservice: CartPageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ user: User; res: string[] } | { user: User; res: string[] }> {
    this.l.isLoading.next(true);

    let displayCarts = [];
    let orderTotals = [];

    return this.dservice.getProducts().pipe(
      exhaustMap(() => {
        return this.aservice.User.pipe(
          exhaustMap((user) => {
            if (user) {
              return this.uservice.loadUserOrders().pipe(
                exhaustMap((res: order[]) => {
                  if (res) {
                    res.forEach((o) => {
                      let displayCart: {
                        timestamp: String;
                        orderItems: OrderItem[];
                      } = { timestamp: "", orderItems: [] };
                      let orderTotal = 0;
                      o.orderItems.forEach((i) => {
                        displayCart.orderItems = o.orderItems;
                        displayCart.timestamp = new Date(
                          o.timestamp
                        ).toDateString();
                        orderTotal = orderTotal + i.product.price * i.quantity;
                      });
                      orderTotals.push(orderTotal);
                      displayCarts.push(displayCart);
                    });
                    this.l.isLoading.next(false);
                    return of({
                      user: user,
                      res: displayCarts,
                      t: orderTotals,
                    });
                  } else {
                    this.l.isLoading.next(false);
                    return of({ user: user, res: [], t: [] });
                  }
                })
              );
            } else {
              this.l.isLoading.next(false);
              return of({ user: null, res: [], t: [] });
            }
          })
        );
      })
    );
  }
}
