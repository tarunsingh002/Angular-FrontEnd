import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { map, mergeMap, take } from "rxjs/operators";
import { AdminService } from "src/app/services/admin.service";
import { AuthService } from "src/app/services/auth-services/auth.service";
import { order } from "src/app/services/auth-services/user.service";

@Component({
  selector: "app-all-orders",
  templateUrl: "./all-orders.component.html",
  styleUrls: ["./all-orders.component.css"],
})
export class AllOrdersComponent implements OnInit {
  orders = [];
  earnings: number;
  constructor(
    private adminService: AdminService,
    private authS: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authS.User.pipe(
      take(1),
      mergeMap((user) =>
        this.adminService.loadAllOrders().pipe(
          map((res: order[]) => {
            this.earnings = 0;
            console.log(user);
            res.forEach((r) => {
              let timestamp = new Date(r.timestamp).toDateString();
              let orderTotal = 0;
              r.orderItems.forEach((i) => {
                orderTotal = i.product.price * i.quantity + orderTotal;
              });
              this.earnings = this.earnings + orderTotal;
              this.orders.push({
                timestamp: timestamp,
                total: orderTotal,
                id: r.orderId,
                email: r.user.username,
              });
            });
            console.log(res);
          })
        )
      )
    ).subscribe();
  }

  orderDetailsPage(order) {
    this.router.navigate([`/admin/orderdetail/${order.id}`]);
  }
}
