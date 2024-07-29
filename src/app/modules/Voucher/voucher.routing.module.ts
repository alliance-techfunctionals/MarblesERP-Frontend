import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import VoucherListComponent from './voucher-list/voucher-list.component';
import VoucherDetailComponent from './voucher-detail/voucher-detail.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherListComponent
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
