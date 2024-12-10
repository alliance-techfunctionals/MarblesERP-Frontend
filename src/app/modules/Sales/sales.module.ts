import { CdkStepperModule } from "@angular/cdk/stepper";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbRatingModule,
} from "@ng-bootstrap/ng-bootstrap";
import { AgGridAngular } from "ag-grid-angular"; // AG Grid Component
import { NgStepperModule } from "angular-ng-stepper";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgxPaginationModule } from "ngx-pagination";
import { GetClientCountryByIdPipe } from "src/app/core/pipes/get-client-country-by-id.pipe";
import { GetClientNameByIdPipe } from "src/app/core/pipes/get-client-name-by-id.pipe";
import { GetClientNumberByIdPipe } from "src/app/core/pipes/get-client-number-by-id.pipe";
import { PipesModule } from "src/app/core/pipes/pipes.module";
import { AuthService } from "src/app/core/service/auth.service";
import { CardComponent } from "src/app/shared/components/card/card.component";
import { ModalCancelConfirmModule } from "src/app/shared/components/modal-cancel-confirm/modal-cancel-confirm.module";
import { ModalPrintShowModule } from "src/app/shared/components/modal-print-show/modal-print-show.module";
import { AgGridService } from "src/app/shared/service/ag-grid.service";
import { OrderStatusService } from "src/app/shared/service/order-status.service";
import { PaymentStatusService } from "src/app/shared/service/payment-status.service";
import { SharedModule } from "src/app/shared/shared.module";
import { ColorService } from "src/app/shared/store/color/color.service";
import { ColorStoreService } from "src/app/shared/store/color/color.store";
import { DesignService } from "src/app/shared/store/design/design.service";
import { DesignStoreService } from "src/app/shared/store/design/design.store";
import { QualityService } from "src/app/shared/store/quality/quality.service";
import { QualityStoreService } from "src/app/shared/store/quality/quality.store";
import { RoleService } from "src/app/shared/store/role/role.service";
import { RoleStoreService } from "src/app/shared/store/role/role.store";
import { SaleService } from "src/app/shared/store/sales/sale.service";
import { SaleStoreService } from "src/app/shared/store/sales/sale.store";
import { SizeService } from "src/app/shared/store/size/size.service";
import { SizeStoreService } from "src/app/shared/store/size/size.store";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";
import { VoucherService } from "src/app/shared/store/voucher/voucher.service";
import { VoucherStoreService } from "src/app/shared/store/voucher/voucher.store";
import MessageDialogBoxComponent from "../components/message-dialog-box/message-dialog-box.component";
import SaleDetailComponent from "./sale-detail/sale-detail.component";
import SaleListComponent from "./sale-list/sale-list.component";
import SaleViewComponent from "./sale-view/sale-view.component";
import { SaleRoutingModule } from "./sales.routing.module";
import { ProductStoreService } from "src/app/shared/store/product/product.store";
import { ProductService } from "src/app/shared/store/product/product.service";
import { PrimaryColorService } from "src/app/shared/store/primary-color/primary-color.service";
import { PrimaryColorStoreService } from "src/app/shared/store/primary-color/primary-color.store";
import { ShapeService } from "src/app/shared/store/shape/shape.service";
import { ShapeStoreService } from "src/app/shared/store/shape/shape.store";
import { InventoryStoreService } from "src/app/shared/store/inventory/inventory.store";
import { InventoryService } from "src/app/shared/store/inventory/inventory.service";
@NgModule({
  declarations: [SaleListComponent, SaleDetailComponent, SaleViewComponent],
  providers: [
    SaleStoreService,
    SaleService,
    RoleService,
    RoleStoreService,
    QualityService,
    ProductStoreService,
    ProductService,
    QualityStoreService,
    PrimaryColorService,
    PrimaryColorStoreService,
    ShapeService,
    ShapeStoreService,
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
    InventoryService,
    InventoryStoreService
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
    ModalPrintShowModule,
    ModalCancelConfirmModule
    // NgxCountriesDropdownModule
  ],
  exports: [
    SaleListComponent,
    SaleDetailComponent,
    SaleViewComponent,
    CardComponent,
  ],
})
export class SaleModule {}
