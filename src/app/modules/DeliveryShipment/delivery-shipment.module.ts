import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AgGridAngular } from 'ag-grid-angular';
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryShipmentRoutingModule } from './delivery-shipment.routing.module';
import DeliveryShipmentComponent from './delivery-shipment/delivery-shipment.component';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { FormsModule } from '@angular/forms';
import { ModalInputModule } from 'src/app/shared/components/modal-input/modal-input.module';
import { OrderStatusService } from 'src/app/shared/service/order-status.service';
import { ModalDeliveryPartnerInputModule } from 'src/app/shared/components/modal-delivery-partner-input/modal-delivery-partner-input.module';
import { DeliveryPartnerService } from 'src/app/shared/store/delivery-partner/delivery-partner.service';
import { DeliveryPartnerStoreService } from 'src/app/shared/store/delivery-partner/delivery-partner.store';
import { DeliveryShipmentService } from 'src/app/shared/store/deliver-shipment/deliver-shipment.service';
import ModalInputComponent from 'src/app/shared/components/modal-input/modal-input.component';

@NgModule({
  declarations: [
    DeliveryShipmentComponent
  ],
  providers: [
    SaleStoreService,
    SaleService,
    UserStoreService,
    UserService,
    OrderStatusService,
    DeliveryPartnerStoreService,
    DeliveryPartnerService,
    DeliveryShipmentService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DeliveryShipmentRoutingModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    TypeaheadModule,
    NgbAccordionModule,
    ModalInputModule,
    ModalDeliveryPartnerInputModule,
  ],
  exports: [
    DeliveryShipmentComponent,
    CardComponent
  ]
})
export class DeliveryShipmentModule { }
