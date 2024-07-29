import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import ModalInputComponent from './modal-input.component';
import { ModalInputRoutingModule } from './modal-input.routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DeliveryPartnerStoreService } from '../../store/delivery-partner/delivery-partner.store';
import { DeliveryPartnerService } from '../../store/delivery-partner/delivery-partner.service';
import { DeliveryShipmentService } from '../../store/deliver-shipment/deliver-shipment.service';

@NgModule({
  declarations: [
    ModalInputComponent,
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
    ModalInputRoutingModule
  ],
  exports: [
    ModalInputComponent,
  ]
})
export class ModalInputModule { }
