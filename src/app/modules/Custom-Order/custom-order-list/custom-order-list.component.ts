import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { CustomOrderModel } from 'src/app/shared/store/custom-order/custom-order.model';
import { CustomOrderService } from 'src/app/shared/store/custom-order/custom-order.service';
import { CustomOrderStoreService } from 'src/app/shared/store/custom-order/custom-order.store';
import { Role } from 'src/app/shared/store/role/role.model';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-order-list',
  templateUrl: './custom-order-list.component.html',
  styleUrls: ['./custom-order-list.component.scss']
})
export default class CustomOrderListComponent implements OnInit, OnDestroy{
  colDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 60 },
    { headerName:"Order No.", field: "orderNumber", filter: true, floatingFilter: true },
    { headerName:"Supplier", field: "supplierName", filter: true, floatingFilter: true },
    { headerName:"POC", field: "pocName", filter: true, floatingFilter: true},
    { headerName:"EDD", field: "edd", filter: true, floatingFilter: true,
      valueFormatter: params => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString('en-US', {
          month: 'short', // "Jul"
          day: 'numeric', // "4"
          year: 'numeric', // "2024"
        });
      },
    },
    { headerName:"Description", field: "orderDescription", filter: true, floatingFilter: true, minWidth: 250},
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ['edit', 'check'],
        onEditClick: this.onEditClicked.bind(this),
        onCheckClick: this.onCheckClicked.bind(this),
      },
      maxWidth: 110
    }
  ];
  public defaultColDef: ColDef = {
    enableValue: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };

  paginationPageSize = environment.tableRecordSize;

  onEditClicked(e: any) {
    this.navigateCustomOrder(e.rowData.id);
  }

  onCheckClicked(e: any) {
    this.openReceivedConfirmationModal(e.rowData);
  }


  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // custom order list
  customOrderList$: Observable<CustomOrderModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
  ]).pipe(
    map(([customOrders, users]) => {
      return customOrders.map(customOrder => {
        customOrders.forEach(customOrder => {
          customOrder.pocName = users.find(user => user.id === customOrder.pocId)?.name || 'N/A';
          customOrder.supplierName = users.find(user => user.id === customOrder.supplierId)?.name || 'N/A';
        });
        return customOrder;
      }).sort((a, b) => b.id - a.id);
    })
  );

  // character limit variable for description
  descriptionLimit: number = 35;

  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: CustomOrderStoreService,
    private customOrderService: CustomOrderService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private roleService: RoleService,
    private roleStoreService: RoleStoreService,
    private modalService: BsModalService,
    private saleStoreService: SaleStoreService

  ) { }

  ngOnInit() {
    this.store.resetStore();
    this.subscriptions.push(
      this.customOrderService.getAll().subscribe(),
      this.userService.getAll().subscribe(),
      this.roleService.getAll().subscribe()
    )
  }

  // navigate to CustomOrder
  protected navigateCustomOrder(id: number = 0): void {
    this.router.navigate(['custom-order', id]);
  }

  // navigate to custom order progress list
  protected navigateToCustomOrderProgress(id: number = 0): void{
    this.router.navigate(['custom-order/progress', id]);
  }

  openReceivedConfirmationModal(item: CustomOrderModel) {
    const initialState = {
      item,
      icon: `feather icon-alert-triangle`,
      message: `Mark This Order As Received`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.customOrderService.orderReceived(item);
            const sale = this.saleStoreService.getById(item.masterOrderId);
            if(sale && !sale.isHandCarry){
              // change the order status to to be shipped
              sale.orderStatus = 6;
              // update the sale order
              this.saleStoreService.updateSale(sale)
            }
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
