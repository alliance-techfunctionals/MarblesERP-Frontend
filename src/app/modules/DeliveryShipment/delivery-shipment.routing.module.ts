import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import DeliveryShipmentComponent from './delivery-shipment/delivery-shipment.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryShipmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryShipmentRoutingModule {}
