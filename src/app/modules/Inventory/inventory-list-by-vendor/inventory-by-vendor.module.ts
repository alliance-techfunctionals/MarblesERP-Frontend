import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
import { InventoryService } from 'src/app/shared/store/inventory/inventory.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { ColorStoreService } from 'src/app/shared/store/color/color.store';
import { ColorService } from 'src/app/shared/store/color/color.service';
import { SizeStoreService } from 'src/app/shared/store/size/size.store';
import { SizeService } from 'src/app/shared/store/size/size.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { AgGridAngular } from 'ag-grid-angular';
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { ShapeStoreService } from 'src/app/shared/store/shape/shape.store';
import { ShapeService } from 'src/app/shared/store/shape/shape.service';
import { ProductStoreService } from 'src/app/shared/store/product/product.store';
import { ProductService } from 'src/app/shared/store/product/product.service';
import { PrimaryColorService } from 'src/app/shared/store/primary-color/primary-color.service';
import { PrimaryColorStoreService } from 'src/app/shared/store/primary-color/primary-color.store';
import { ArtisanStoreService } from 'src/app/shared/store/artisan/artisan.store';
import { ArtisanService } from 'src/app/shared/store/artisan/artisan.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Column, GridOption, AngularSlickgridModule } from 'angular-slickgrid';
import { InventoryListByVendorComponent } from './inventory-list-by-vendor.component';
import { InventoryByVendorRoutingModule } from './inventory-by-vendor.routing.module';


@NgModule({
  declarations: [
    InventoryListByVendorComponent
  ],
  providers: [
    InventoryStoreService,
    InventoryService,
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
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    TypeaheadModule,
    NgbAccordionModule,
    TagInputModule,
    TableModule, ButtonModule, RippleModule,
    AngularSlickgridModule.forRoot(),
  ],
  exports: [
    CardComponent,
    InventoryListByVendorComponent,
    InventoryByVendorRoutingModule
  ]
})
export class InventoryModule { }
