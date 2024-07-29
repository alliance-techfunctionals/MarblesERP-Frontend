import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory.routing.module';
import InventoryListComponent from './inventory-list/inventory-list.component';
import InventoryDetailComponent from './inventory-detail/inventory-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
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

@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryDetailComponent,
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
    SizeService,
    UserService,
    UserStoreService,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    TypeaheadModule,
    NgbAccordionModule,
    TagInputModule
  ],
  exports: [
    InventoryListComponent,
    InventoryDetailComponent,
    CardComponent
  ]
})
export class InventoryModule { }
