import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import SaleListComponent from './sale-list/sale-list.component';
import SaleDetailComponent from './sale-detail/sale-detail.component';
import SaleViewComponent from './sale-view/sale-view.component';

const routes: Routes = [
  {
    path: '',
    component: SaleListComponent
  },
  {
    path: 'view',
    component: SaleViewComponent
  },
  {
    path: ':id/:orderNo',
    component: SaleDetailComponent
  },
  {
    path: ':type/:id/:orderNo',
    component: SaleDetailComponent
  },
  {
    path: ':type/:id/:orderNo/:productIds',
    component: SaleDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule {}
