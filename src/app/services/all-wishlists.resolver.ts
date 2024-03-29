import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Product } from "../models/product.model";
import { AdminService, wishlist } from "./admin.service";
import { ProductDataService } from "./product-data.service";
import { exhaustMap } from "rxjs/operators";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: "root",
})
export class AllWishlistsResolver
  implements Resolve<{ products: Product[]; wishlisted: number[] }>
{
  constructor(
    private adminService: AdminService,
    private productService: ProductDataService,
    private l: LoadingService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ products: Product[]; wishlisted: number[] }> {
    let Products = [];
    let wishlisted = [];
    this.l.isLoading.next(true);

    return this.productService.getProducts().pipe(
      exhaustMap((products) =>
        this.adminService.getAllWishlisted().pipe(
          exhaustMap((res: wishlist[]) => {
            wishlisted = [];
            products.forEach((p) => {
              wishlisted.push(0);
            });
            res.forEach((r) => {
              r.products.forEach((listp) => {
                let index = products.findIndex(
                  (p) => p.productId === listp.productId
                );
                if (index !== -1) {
                  wishlisted[index]++;
                }
              });
            });
            Products = products;
            Products.sort((p1, p2) => {
              let index1 = products.findIndex(
                (p) => p.productId === p1.productId
              );
              let index2 = products.findIndex(
                (p) => p.productId === p2.productId
              );
              return wishlisted[index2] - wishlisted[index1];
            });
            wishlisted.sort((lt1, lt2) => {
              return lt2 - lt1;
            });
            console.log(res);
            this.l.isLoading.next(false);
            return of({ products: Products, wishlisted: wishlisted });
          })
        )
      )
    );
  }
}
