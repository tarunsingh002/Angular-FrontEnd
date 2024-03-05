import { Component, OnDestroy, OnInit } from "@angular/core";
import { Product } from "../../../models/product.model";
import { ProductService } from "../../../services/product.service";
import { ProductDataService } from "../../../services/product-data.service";
import { AuthService } from "../../../services/auth-services/auth.service";
import { Subscription } from "rxjs";
import { CartPageService } from "../../../services/cart-page.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";

import { WishlistService } from "src/app/services/wishlist.service";
import { map, mergeMap } from "rxjs/operators";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  wishListed: boolean[] = [];
  auth: boolean = false;
  sub: Subscription;
  webmaster: boolean = false;
  reactiveForm: FormGroup;
  constructor(
    private pservice: ProductService,
    private dservice: ProductDataService,
    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // this.products = this.pservice.getProducts();

    this.sub = this.pservice.searchedProductsChanged
      .pipe(
        mergeMap((products) =>
          this.authS.User.pipe(
            mergeMap((user) =>
              this.wlService.WishListChanged.pipe(
                map((res) => {
                  if (products) this.products = products;
                  this.auth = !!user;
                  if (user) this.webmaster = user.webmaster;
                  this.wishListed = [];
                  this.products.forEach(() => {
                    this.wishListed.push(false);
                  });
                  if (this.auth && !this.webmaster && res) {
                    res.forEach((r) => {
                      let index = this.products.findIndex(
                        (p) => p.productId === r.productId
                      );
                      this.wishListed[index] = true;
                    });
                  }
                  return;
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  onDelete(index: number) {
    console.log(this.products[index]);
    if (confirm("Are you sure you want to delete this product ?"))
      this.dservice
        .deleteProduct(this.products[index].productId)
        .subscribe((response) => {
          if (response === "Product Deleted")
            this.pservice.deleteProduct(index);
        });
  }

  addToCart(p: Product) {
    this.cservice.addToCart(p.productId, 1);
    this.router.navigate(["/buying/cart"]);
  }

  addToWishList(product: Product) {
    this.wlService.addToWishList(product).subscribe((res) => {
      if (res === "Product added to Wishlist") {
        this.wlService.getWishList();
      }
    });
  }

  removeFromWishList(product: Product) {
    this.wlService.removeFromWishList(product.productId).subscribe((res) => {
      if (res === "Product removed from wishlist") {
        this.wlService.getWishList();
      }
    });
  }
}
