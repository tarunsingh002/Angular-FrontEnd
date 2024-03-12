import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../../models/product.model";
import { ProductService } from "../../../services/product.service";
import { AuthService } from "../../../services/auth-services/auth.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { CartPageService } from "../../../services/cart-page.service";
import { map, mergeMap } from "rxjs/operators";
import { WishlistService } from "src/app/services/wishlist.service";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  webmaster = false;
  auth = false;
  sub: Subscription;
  q = 1;
  wishlisted: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private pservice: ProductService,
    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService
  ) {}

  ngOnInit(): void {
    this.sub = this.aroute.params
      .pipe(
        mergeMap((params) =>
          this.authS.User.pipe(
            mergeMap((user) =>
              this.wlService.WishListChanged.pipe(
                map((products) => {
                  this.product = this.pservice.getProducts()[+params["index"]];
                  if (user) {
                    this.auth = true;
                    this.webmaster = user.webmaster;
                  }
                  this.wishlisted = false;
                  if (products && this.auth && !this.webmaster) {
                    let index = products.findIndex(
                      (p) => p.productId === this.product.productId
                    );
                    if (index !== -1) this.wishlisted = true;
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

  onSubmit(f: NgForm) {
    if (!this.auth || this.webmaster) {
      this.authS.logout();
      this.router.navigate(["/auth"]);
      return;
    }
    let quantity = f.value.quantity;
    this.cservice.addToCart(this.product.productId, +quantity);
    this.router.navigate(["/buying/cart"]);
  }

  addToWishList() {
    this.wlService.addToWishList(this.product).subscribe((res) => {
      if (res === "Product added to Wishlist") {
        this.wlService.getWishList();
      }
    });
  }

  removeFromWishList() {
    this.wlService
      .removeFromWishList(this.product.productId)
      .subscribe((res) => {
        if (res === "Product removed from wishlist") {
          this.wlService.getWishList();
        }
      });
  }
}
