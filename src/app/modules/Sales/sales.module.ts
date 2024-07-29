import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import SaleDetailComponent from './sale-detail/sale-detail.component';
import SaleListComponent from './sale-list/sale-list.component';
import { SaleRoutingModule } from './sales.routing.module';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { ColorService } from 'src/app/shared/store/color/color.service';
import { ColorStoreService } from 'src/app/shared/store/color/color.store';
import { SizeService } from 'src/app/shared/store/size/size.service';
import { SizeStoreService } from 'src/app/shared/store/size/size.store';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import {NgStepperModule} from 'angular-ng-stepper';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { GetClientNameByIdPipe } from 'src/app/core/pipes/get-client-name-by-id.pipe';
import { GetClientNumberByIdPipe } from 'src/app/core/pipes/get-client-number-by-id.pipe';
import { GetClientCountryByIdPipe } from 'src/app/core/pipes/get-client-country-by-id.pipe';
import { NgbDatepickerModule, NgbModalModule, NgbProgressbarModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderStatusService } from 'src/app/shared/service/order-status.service';
import { PaymentStatusService } from 'src/app/shared/service/payment-status.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';
import SaleViewComponent from './sale-view/sale-view.component';
@NgModule({
  declarations: [
    SaleListComponent,
    SaleDetailComponent,
    SaleViewComponent
  ],
  providers: [
    SaleStoreService,
    SaleService,
    RoleService,
    RoleStoreService,
    QualityService,
    QualityStoreService,
    ColorService,
    ColorStoreService,
    SizeService,
    SizeStoreService,
    DesignService,
    DesignStoreService,
    UserStoreService,
    UserService,
    VoucherService,
    VoucherStoreService,
    OrderStatusService,
    PaymentStatusService,
    AuthService,
    GetClientNameByIdPipe,
    GetClientNumberByIdPipe,
    GetClientCountryByIdPipe,
    DatePipe,
    CurrencyPipe,
    NgbRatingModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgbModalModule,
    AgGridService,
  ],
  imports: [
    SaleRoutingModule,
    CommonModule, // CommonModule is required for ngFor, ngIf, etc.
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    TabsModule,
    NgStepperModule,
    CdkStepperModule,
    TypeaheadModule,
    NgbProgressbarModule,
    // NgxCountriesDropdownModule
  ],
  exports: [
    SaleListComponent,
    SaleDetailComponent,
    SaleViewComponent,
    CardComponent,
  ]
})
export class SaleModule { }
