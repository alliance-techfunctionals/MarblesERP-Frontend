import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import MessageDialogBoxComponent from '../../components/message-dialog-box/message-dialog-box.component';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Role } from 'src/app/shared/store/role/role.model';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export default class UsersListComponent implements OnInit, OnDestroy {
  // colDefs: ColDef[] = [
  //   { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 60 },
  //   { headerName: "Name", field: "name", filter: true, floatingFilter: true },
  //   { headerName: "E-mail", filter: true, floatingFilter: true, valueGetter: params => params.data.emailAddressList && params.data.emailAddressList.length > 0 ? params.data.emailAddressList[0] : "N/A", minWidth: 220},
  //   { headerName: "Mobile", filter: true, floatingFilter: true, valueGetter: params => params.data.mobileNumberList && params.data.mobileNumberList.length > 0 ? params.data.mobileNumberList[0] : "N/A",},
  //   { headerName: "Password", field: "password", filter: true, floatingFilter: true, maxWidth: 110},
  //   { headerName: "Country", field: "country", filter: true, floatingFilter: true, maxWidth: 110},
  //   { headerName: "City", field: "city", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
  //   {
  //     headerName: "Actions",
  //     field: "action",
  //     cellRenderer: AgCustomButtonComponent,
  //     cellRendererParams: {
  //       buttonsToShow: ['edit', 'delete'],
  //       onEditClick: this.onEditClicked.bind(this),
  //       onDeleteClick: this.onDeleteClicked.bind(this),
  //     }
  //   }
  // ];

  // public defaultColDef: ColDef = {
  //   enableValue: true,
  //   filter: true,
  //   flex: 1,
  //   minWidth: 100,
  // };

  // paginationPageSize = environment.tableRecordSize;

  // onEditClicked(e: any) {
  //   console.log(e); 
  //   this.navigateUser(e.rowData.id);
  // }

  // onDeleteClicked(e: any) {
  //   this.openDeleteConfirmationModal(e.rowData);
  // }

  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // users List
  userList$: Observable<UserModel[]> = this.store.selectAll();
  roleList$: Observable<Role[]> = this.roleStoreService.selectAll().pipe(
    tap((item) => this.active = window.localStorage.getItem('tabIndex') ? Number(window.localStorage.getItem('tabIndex')) : item[0]?.id)
  );


  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: UserStoreService,
    private userService: UserService,
    private roleService: RoleService,
    private roleStoreService: RoleStoreService,
    private modalService: BsModalService

  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getAll().subscribe(),
      this.roleService.getAll().subscribe()
    )

  }

  // navigate to User
  protected navigateUser(id: number = 0): void {
    // saving tabIndex temporarily
    window.localStorage.setItem('tabIndex',this.active.toString());
    this.router.navigate(['users', id]);
  }

  protected openDeleteConfirmationModal(item: UserModel) {
    const initialState = {
      item,
      message: `delete user: ${item.name}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.userService.deleteUser(item);
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  tabClick(id: number){
    window.localStorage.setItem('tabIndex', id.toString());
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected selectUserByRoleId(roleId: number): Observable<UserModel[]> {
    return this.store.selectByRoleId(roleId)
  }

}
