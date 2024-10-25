import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseVoucherDetailsComponent } from './purchase-voucher-details/purchase-voucher-details.component';
import { PurchaseVoucherListComponent } from './purchase-voucher-list/purchase-voucher-list.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseVoucherListComponent
  },
  {
    path: 'purchase-voucher-detail/:id',
    component: PurchaseVoucherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class purchaseVoucherRoutingModules {}
