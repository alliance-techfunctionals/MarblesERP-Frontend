import { NgModule } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CardComponent } from 'src/app/shared/components/card/card.component';
// import { PurchaseVoucherDetailsComponent } from './purchase-voucher-details/purchase-voucher-details.component';
// import { PurchaseVoucherListComponent } from './purchase-voucher-list/purchase-voucher-list.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { PurchaseVoucherListComponent } from './purchase-voucher-list/purchase-voucher-list.component';
import { purchaseVoucherRoutingModules } from './purchase-voucher.routing.modules';
import { PurchaseVoucherDetailsComponent } from './purchase-voucher-details/purchase-voucher-details.component';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { ColorStoreService } from 'src/app/shared/store/color/color.store';
import { ColorService } from 'src/app/shared/store/color/color.service';
import { SizeStoreService } from 'src/app/shared/store/size/size.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { PrimaryColorService } from 'src/app/shared/store/primary-color/primary-color.service';
import { ProductService } from 'src/app/shared/store/product/product.service';
import { ShapeService } from 'src/app/shared/store/shape/shape.service';
import { SizeService } from 'src/app/shared/store/size/size.service';
import { ArtisanService } from 'src/app/shared/store/artisan/artisan.service';
import { ArtisanStoreService } from 'src/app/shared/store/artisan/artisan.store';
import { PrimaryColorStoreService } from 'src/app/shared/store/primary-color/primary-color.store';
import { ProductStoreService } from 'src/app/shared/store/product/product.store';
import { ShapeStoreService } from 'src/app/shared/store/shape/shape.store';
import { PurchaseVoucherService } from 'src/app/shared/store/Purchase-voucher/purchase.service';
import { PurchaseVoucherStoreService } from 'src/app/shared/store/Purchase-voucher/purchase.store';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
// import { SharedModule } from 'primeng/api';



@NgModule({
  declarations: [
    PurchaseVoucherListComponent,
    PurchaseVoucherDetailsComponent,
  ],
  providers: [
    InventoryStoreService,
    PurchaseVoucherService,
    PurchaseVoucherStoreService,
    QualityStoreService,
    QualityService,
    DesignService,
    DesignStoreService,
    ColorStoreService,
    ColorService,
    SizeStoreService,
    ShapeStoreService,
    ProductStoreService,
    PrimaryColorStoreService,
    ArtisanStoreService,
    ArtisanService,
    SizeService,
    ShapeService,
    ProductService,
    PrimaryColorService,
    UserService,
    UserStoreService,
  ],
  imports: [
    CommonModule,
    CardComponent,
    CommonModule,
    SharedModule,
    // MessageDialogBoxComponent,
    // NgxPaginationModule,
    // PipesModule,
    CardComponent,
    AgGridAngular,
    // TypeaheadModule,
    // NgbAccordionModule,
    // TagInputModule,
    purchaseVoucherRoutingModules
  ],
  exports: [
    PurchaseVoucherListComponent,
    PurchaseVoucherDetailsComponent,
    CardComponent
  ]
})
export class PurchaseVoucherModule { }
