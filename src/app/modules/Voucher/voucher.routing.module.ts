import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import VoucherListComponent from './voucher-list/voucher-list.component';
import VoucherDetailComponent from './voucher-detail/voucher-detail.component';
import { ViewVoucherComponent } from './voucher-view/view-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherListComponent
  },
  {
    path: 'view/:id',
    component: ViewVoucherComponent
  },
  {
    path: ':id',
    component: VoucherDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherRoutingModule {}
