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
import CustomOrderListComponent from './custom-order-list/custom-order-list.component';
import { CustomOrderRoutingModule } from './custom-order.routing.module';
import CustomOrderDetailComponent from './custom-order-detail/custom-order-detail.component';
import { CustomOrderStoreService } from 'src/app/shared/store/custom-order/custom-order.store';
import { CustomOrderService } from 'src/app/shared/store/custom-order/custom-order.service';
import { CustomOrderProgressStoreService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.store';
import { CustomOrderProgressService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.service';
import CustomOrderProgressDetailComponent from './custom-order-progress-detail/custom-order-progress-detail.component';
import CustomOrderProgressListComponent from './custom-order-progress-list/custom-order-progress-list.component';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';

@NgModule({
  declarations: [
    CustomOrderListComponent,
    CustomOrderDetailComponent,
    CustomOrderProgressListComponent,
    CustomOrderProgressDetailComponent,
  ],
  providers: [
    UserStoreService,
    UserService,
    RoleService,
    RoleStoreService,
    CustomOrderStoreService,
    CustomOrderService,
    CustomOrderProgressStoreService,
    CustomOrderProgressService,
    SaleStoreService,
    DatePipe,
  ],
  imports: [
    CommonModule,
    CustomOrderRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
  ],
  exports: [
    CustomOrderListComponent,
    CustomOrderDetailComponent,
    CustomOrderProgressListComponent,
    CustomOrderProgressDetailComponent,
    CardComponent
  ]
})
export class CustomOrderModule { }
