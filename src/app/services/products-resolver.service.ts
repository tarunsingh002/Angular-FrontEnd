import { Injectable } from "@angular/core";
import { ProductDataService } from "./product-data.service";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";
import { ProductService } from "./product.service";
import { exhaustMap, tap } from "rxjs/operators";
import { LoadingService } from "./loading.service";
import { WishlistService } from "./wishlist.service";

@Injectable({
  providedIn: "root",
})
export class ProductsResolverService implements Resolve<Product[]> {
  constructor(
    private dservice: ProductDataService,
    private pservice: ProductService,
    private l: LoadingService,
    private wlService: WishlistService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Product[] | Observable<Product[]> | Promise<Product[]> {
    this.l.isLoading.next(true);
    return this.wlService.getWishListData().pipe(
      exhaustMap((res) => {
        this.wlService.WishListChanged.next(res);
        return this.dservice.getProducts().pipe(
          tap(() => {
            this.l.isLoading.next(false);
          })
        );
      })
    );
  }
}
