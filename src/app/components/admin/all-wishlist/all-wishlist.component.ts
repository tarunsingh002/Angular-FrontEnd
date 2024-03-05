import { Component, OnInit } from "@angular/core";
import { map, mergeMap, tap } from "rxjs/operators";
import { Product } from "src/app/models/product.model";
import { AdminService, wishlist } from "src/app/services/admin.service";
import { ProductDataService } from "src/app/services/product-data.service";

@Component({
  selector: "app-all-wishlist",
  templateUrl: "./all-wishlist.component.html",
  styleUrls: ["./all-wishlist.component.css"],
})
export class AllWishlistComponent implements OnInit {
  products = [];
  wishlisted = [];

  constructor(
    private adminService: AdminService,
    private productService: ProductDataService
  ) {}
  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(
        mergeMap((products) =>
          this.adminService.getAllWishlisted().pipe(
            map((res: wishlist[]) => {
              this.wishlisted = [];
              products.forEach((p) => {
                this.wishlisted.push(0);
              });
              res.forEach((r) => {
                r.products.forEach((listp) => {
                  let index = products.findIndex(
                    (p) => p.productId === listp.productId
                  );
                  if (index !== -1) {
                    this.wishlisted[index]++;
                  }
                });
              });
              this.products = products;
              this.products.sort((p1, p2) => {
                let index1 = products.findIndex(
                  (p) => p.productId === p1.productId
                );
                let index2 = products.findIndex(
                  (p) => p.productId === p2.productId
                );
                return this.wishlisted[index2] - this.wishlisted[index1];
              });
              this.wishlisted.sort((lt1, lt2) => {
                return lt2 - lt1;
              });
              console.log(res);
            })
          )
        )
      )

      .subscribe();
  }
}
