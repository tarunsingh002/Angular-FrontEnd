import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AllOrdersComponent } from "./all-orders/all-orders.component";
import { AllWishlistComponent } from "./all-wishlist/all-wishlist.component";
import { RouterModule, Routes } from "@angular/router";
import { IsWebmasterGuard } from "src/app/services/auth-services/is-webmaster.guard";
import { OrderDetailsComponent } from "./order-details/order-details.component";

const routes: Routes = [
  {
    path: "allorders",
    component: AllOrdersComponent,
    canActivate: [IsWebmasterGuard],
  },
  {
    path: "allwishlisted",
    component: AllWishlistComponent,
    canActivate: [IsWebmasterGuard],
  },
  {
    path: "orderdetail/:id",
    component: OrderDetailsComponent,
    canActivate: [IsWebmasterGuard],
  },
];

@NgModule({
  declarations: [
    AllOrdersComponent,
    AllWishlistComponent,
    OrderDetailsComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
