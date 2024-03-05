import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/product.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  reactiveForm: FormGroup;
  placeholder: string = "";
  searchedProducts: Product[];
  products: Product[];

  constructor(private pservice: ProductService) {}

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      searchBy: new FormControl(null),
      searchTerm: new FormControl(null),
    });

    this.products = this.pservice.getProducts();

    this.pservice.searchedProductsChanged.next(this.products);
    // this.searchByCategory();

    this.reactiveForm.get("searchTerm").valueChanges.subscribe((term) => {
      if (term.trim() === "") {
        this.searchedProducts = this.products;
      } else {
        let p1 = this.products.filter((p) =>
          p.name.toLowerCase().includes(term.trim().toLowerCase())
        );

        let p2 = this.products.filter((p) =>
          p.brand.toLowerCase().includes(term.trim().toLowerCase())
        );

        let p3 = this.products.filter((p) =>
          p.category.toLowerCase().includes(term.trim().toLowerCase())
        );

        this.searchedProducts = p1.concat(p2).concat(p3);
        this.searchedProducts = this.unique(this.searchedProducts);
      }
      this.pservice.searchedProductsChanged.next(this.searchedProducts);
    });
  }

  unique(p: Product[]) {
    const ids = p.map(({ productId }) => productId);
    const unique = p.filter(
      ({ productId }, index) => !ids.includes(productId, index + 1)
    );
    return unique;
  }
}
