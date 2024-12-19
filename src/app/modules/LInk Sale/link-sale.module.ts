import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import LinkSaleComponent from './link-sale/link-sale.component';
import { LinkSaleRoutingModule } from './link-sale.routing.module';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    LinkSaleComponent,
  ],
  providers: [
    SaleStoreService,
    SaleService,
    VoucherService,
    VoucherStoreService,
    UserStoreService,
    UserService
  ],
  imports: [
    CommonModule,
    LinkSaleRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  exports: [
    LinkSaleComponent,
    CardComponent
  ]
})
export class LinkSaleModule { }
