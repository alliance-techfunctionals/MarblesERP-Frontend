import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { ModalDeliveryPartnerInputRoutingModule } from './modal-delivery-partner-input.routing.module';
import { DeliveryPartnerService } from '../../store/delivery-partner/delivery-partner.service';
import { DeliveryPartnerStoreService } from '../../store/delivery-partner/delivery-partner.store';
import { DeliveryShipmentService } from '../../store/deliver-shipment/deliver-shipment.service';
import ModalDeliveryPartnerInputComponent from './modal-delivery-partner-input.component';

@NgModule({
  declarations: [
    ModalDeliveryPartnerInputComponent
  ],
  providers:[
    DeliveryPartnerService,
    DeliveryPartnerStoreService,
    DeliveryShipmentService
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDeliveryPartnerInputRoutingModule,
  ],
  exports: [
    ModalDeliveryPartnerInputComponent,
  ]
})
export class ModalDeliveryPartnerInputModule { }
