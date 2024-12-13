import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListByVendorComponent } from './inventory-list-by-vendor.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryListByVendorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryByVendorRoutingModule {}
