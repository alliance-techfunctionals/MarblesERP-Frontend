import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VoucherRoutingModule } from './voucher.routing.module';
import VoucherListComponent from './voucher-list/voucher-list.component';
import VoucherDetailComponent from './voucher-detail/voucher-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import MessageDialogBoxComponent from '../components/message-dialog-box/message-dialog-box.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
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
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { AuthService } from 'src/app/core/service/auth.service';
import { DateService } from 'src/app/shared/service/date.service';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';

@NgModule({
  declarations: [
    VoucherListComponent,
    VoucherDetailComponent,
  ],
  providers: [
    VoucherStoreService,
    VoucherService,
    QualityStoreService,
    QualityService,
    DesignService,
    DesignStoreService,
    ColorStoreService,
    ColorService,
    SizeStoreService,
    SizeService,
    RoleService,
    RoleStoreService,
    UserService,
    UserStoreService,
    DatePipe,
    AuthService,
    DateService,
    AgGridService
  ],
  imports: [
    CommonModule,
    VoucherRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular,
    TypeaheadModule,
  ],
  exports: [
    VoucherListComponent,
    VoucherDetailComponent,
    CardComponent
  ]
})
export class VoucherModule { }
