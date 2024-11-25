import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import InventoryListComponent from './inventory-list/inventory-list.component';
import InventoryDetailComponent from './inventory-detail/inventory-detail.component';
import { InventoryListNewComponent } from './inventory-list-new/inventory-list-new.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryListNewComponent
  },
  {
    path: ':id',
    component: InventoryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
