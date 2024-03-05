import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { CartPageService } from "src/app/services/cart-page.service";
import { WishlistService } from "src/app/services/wishlist.service";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
})
export class WishlistComponent implements OnInit {
  constructor(
    private wlService: WishlistService,
    private cservice: CartPageService,
    private router: Router
  ) {}
  products: Product[] = [];

  ngOnInit(): void {
    this.wlService.getWishList();
    this.wlService.WishListChanged.subscribe((res) => {
      if (res) this.products = res;
    });
  }
  addProductToCart(product: Product) {
    this.cservice.addToCart(product.productId, 1);
    this.router.navigate(["/buying/cart"]);
  }
  removeProduct(product: Product) {
    this.wlService.removeFromWishList(product.productId).subscribe((res) => {
      if (res === "Product removed from wishlist") {
        this.wlService.getWishList();
      }
    });
  }
}
