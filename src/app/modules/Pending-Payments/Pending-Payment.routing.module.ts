import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import PendingPaymentListComponent from './pending-payment-list/pending-payment-list.component';
import PendingPaymentDetailComponent from './pending-payment-detail/pending-payment-detail.component';
import SubPendingPaymentListComponent from './sub-pending-payment-list/sub-pending-payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: PendingPaymentListComponent
  },
  {
    path: ':id',
    component: PendingPaymentDetailComponent
  },
  {
    path: 'pending/:id',
    component: SubPendingPaymentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPaymentRoutingModule {}
