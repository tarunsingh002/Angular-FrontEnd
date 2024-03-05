import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  api: string = "https://ng-ecommerce-electronics-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient) {}

  getOrder(id: string) {
    return this.http.get(`${this.api}/orders/${id}.json`);
  }
}
