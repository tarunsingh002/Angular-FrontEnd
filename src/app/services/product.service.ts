import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  products: Product[] = [];
  productsChanged = new BehaviorSubject<Product[]>(null);
  searchedProductsChanged = new BehaviorSubject<Product[]>(null);

  constructor() {}

  addProduct(p: Product) {
    this.products.push(p);
    this.productsChanged.next(this.products);
  }

  addProducts(p: Product[]) {
    this.products = p;
    this.productsChanged.next(this.products);
  }

  getProducts() {
    return this.products;
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.productsChanged.next(this.products);
  }
}
