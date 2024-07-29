import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { CustomOrderStoreService } from 'src/app/shared/store/custom-order/custom-order.store';
import { CustomOrderService } from 'src/app/shared/store/custom-order/custom-order.service';
import PendingPaymentListComponent from './pending-payment-list/pending-payment-list.component';
import PendingPaymentDetailComponent from './pending-payment-detail/pending-payment-detail.component';
import { PendingPaymentRoutingModule } from './Pending-Payment.routing.module';
import { PendingPaymentService } from 'src/app/shared/store/pending-payment/pending-payment.service';
import { PendingPaymentStoreService } from 'src/app/shared/store/pending-payment/pending-payment.store';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import SubPendingPaymentListComponent from './sub-pending-payment-list/sub-pending-payment-list.component';
import { SubPendingPaymentService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.service';
import { SubPendingPaymentStoreService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.store';
import { GetOrderNoByIdPipe } from 'src/app/core/pipes/get-orderNo-by-id.pipe';
import { PaymentStatusService } from 'src/app/shared/service/payment-status.service';

@NgModule({
  declarations: [
    PendingPaymentListComponent,
    PendingPaymentDetailComponent,
    SubPendingPaymentListComponent
  ],
  providers: [
    PendingPaymentService,
    PendingPaymentStoreService,
    SaleStoreService,
    UserStoreService,
    UserService,
    SaleStoreService,
    SaleService,
    SubPendingPaymentService,
    SubPendingPaymentStoreService,
    PaymentStatusService,
    DatePipe,
    GetOrderNoByIdPipe
  ],
  imports: [
    CommonModule,
    PendingPaymentRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular
  ],
  exports: [
    PendingPaymentListComponent,
    PendingPaymentDetailComponent,
    SubPendingPaymentListComponent,
    CardComponent
  ]
})
export class PendingPaymentModule { }
