import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { DeliveryPartnerStoreService } from '../../store/delivery-partner/delivery-partner.store';
import { DeliveryPartnerService } from '../../store/delivery-partner/delivery-partner.service';
import { DeliveryShipmentService } from '../../store/deliver-shipment/deliver-shipment.service';
import { ModalPrintShowComponent } from './modal-print-show.component';

@NgModule({
  declarations: [
    ModalPrintShowComponent,
  ],
  providers:[
    DeliveryPartnerStoreService,
    DeliveryPartnerService,
    DeliveryShipmentService
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalPrintShowComponent,
  ]
})
export class ModalPrintShowModule { }
