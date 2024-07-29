import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import LinkSaleComponent from './link-sale/link-sale.component';

const routes: Routes = [
  {
    path: '',
    component: LinkSaleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkSaleRoutingModule {}
