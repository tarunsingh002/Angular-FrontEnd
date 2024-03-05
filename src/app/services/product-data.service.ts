import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { map, tap } from "rxjs/operators";
import { ProductService } from "./product.service";
import { apiUrl } from "../apiutility";

@Injectable({
  providedIn: "root",
})
export class ProductDataService {
  api: string = `${apiUrl}`;
  constructor(private http: HttpClient, private pservice: ProductService) {}

  addProduct(p: Product) {
    return this.http.post<Product>(`${this.api}/api/v1/admin/addproduct`, p);
  }

  getProducts() {
    return this.http.get<Product[]>(`${this.api}/api/v1/all/getproducts`).pipe(
      tap((res) => {
        this.pservice.addProducts(res);
      })
    );
  }

  deleteProduct(id: number) {
    console.log(id);
    return this.http.delete(`${this.api}/api/v1/admin/deleteproduct/${id}`, {
      responseType: "text",
    });
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(
      `${this.api}/api/v1/admin/updateproduct/${id}`,
      product
    );
  }
}
