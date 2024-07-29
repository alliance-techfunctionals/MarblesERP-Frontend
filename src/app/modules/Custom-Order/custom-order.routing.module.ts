import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import CustomOrderListComponent from './custom-order-list/custom-order-list.component';
import CustomOrderDetailComponent from './custom-order-detail/custom-order-detail.component';
import CustomOrderProgressDetailComponent from './custom-order-progress-detail/custom-order-progress-detail.component';
import CustomOrderProgressListComponent from './custom-order-progress-list/custom-order-progress-list.component';

const routes: Routes = [
  {
    path: '',
    component: CustomOrderListComponent
  },  
  {
    path: 'progress/:id',
    component: CustomOrderProgressListComponent
  },
  {
    path: ':id',
    component: CustomOrderDetailComponent
  },
  {
    path: 'progressDetail/:saleOrderId/:id',
    component: CustomOrderProgressDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomOrderRoutingModule {}
