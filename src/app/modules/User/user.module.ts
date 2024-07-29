import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routing.module';
import UsersListComponent from './users-list/users-list.component';
import UserDetailComponent from './user-detail/user-detail.component';
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

@NgModule({
  declarations: [
    UsersListComponent,
    UserDetailComponent,
  ],
  providers: [
    UserStoreService,
    UserService,
    RoleService,
    RoleStoreService
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonModule,
    SharedModule,
    MessageDialogBoxComponent,
    NgxPaginationModule,
    PipesModule,
    CardComponent,
    AgGridAngular
  ],
  exports: [
    UsersListComponent,
    UserDetailComponent,
    CardComponent
  ]
})
export class UserModule { }
