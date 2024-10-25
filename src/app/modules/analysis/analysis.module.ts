import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import  SaleAnalysisComponent  from './sale-analysis/sale-analysis.component';
import { SaleAnalysisModule } from './sale-analysis.routing.module';
// Angular Chart Component
import { AgCharts } from 'ag-charts-angular';
// Chart Options Type Interface
import { AgChartOptions } from 'ag-charts-community';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';
import { OrderStatusService } from 'src/app/shared/service/order-status.service';
import { PaymentStatusService } from 'src/app/shared/service/payment-status.service';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { UserService } from 'src/app/shared/store/user/user.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { ChartModule } from 'primeng/chart';
// import { NgApexchartsModule } from "ng-apexcharts"

import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SaleAnalysisComponent
  ],
  providers: [
    SaleStoreService,
    UserStoreService,
    VoucherStoreService,
    OrderStatusService,
    PaymentStatusService,
    SaleService,
    RoleService,
    DesignService,
    DesignStoreService,
    QualityService,
    QualityStoreService,
    VoucherService,
    UserService,
    CurrencyPipe,
    RoleStoreService,
  ],
  imports: [
    CommonModule,
    SaleAnalysisModule,
    AgCharts,
    // NgApexchartsModule,
    ChartModule,
    ReactiveFormsModule
  ]
})
export class AnalysisModule { }
