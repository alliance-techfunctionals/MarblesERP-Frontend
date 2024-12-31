import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { PaymentStatusService } from 'src/app/shared/service/payment-status.service';
import { PendingPaymentModel } from 'src/app/shared/store/pending-payment/pending-payment.model';
import { PendingPaymentService } from 'src/app/shared/store/pending-payment/pending-payment.service';
import { PendingPaymentStoreService } from 'src/app/shared/store/pending-payment/pending-payment.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';

@Component({
  selector: 'app-pending-payment-list',
  templateUrl: './pending-payment-list.component.html',
  styleUrls: ['./pending-payment-list.component.scss']
})
export default class PendingPaymentListComponent implements OnInit, OnDestroy{
  isPaymentLoading = false;
  isUserLoading = false;
  isSaleLoading = false;

  colDefs: ColDef[] = [
    { headerName: "Date", field: "createdOn", filter: "agDateColumnFilter", floatingFilter: true , valueFormatter: params => {
      if (!params.value) return "N/A"; // Check if the date is null or undefined
      const date = new Date(params.value); // Convert the string date to a Date object
      return date.toLocaleString('en-US', {
        month: 'short', // "Jul"
        day: 'numeric', // "4"
        year: 'numeric', // "2024"
        hour: 'numeric', // "3"
        minute: 'numeric', // "39"
        hour12: true // Use 12-hour format
      });
    },
    minWidth: 200,
    filterParams: this.agGridService.filterParams
   },
    { headerName:"Order No.", field: "orderNumber", filter: true, floatingFilter: true },
    { headerName:"Customer Name", field: "customerName", filter: true, floatingFilter: true },
    { headerName:"Payment Status", field: "paymentStatusName", filter: true, floatingFilter: true, cellStyle: (params) => {
        if(params.value === "Success"){
          return {color: 'darkgreen'}
        }
        else if(params.value === "Partial Payment"){
          return {color: 'darkorange'}
        }
        else if(params.value === "Unpaid"){
          return {color: 'crimson'}
        }
        return null;
      }
    },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ['edit'],
        onEditClick: this.onEditClicked.bind(this),
      }
    }
  ];

  paginationPageSize = environment.tableRecordSize;

  onEditClicked(e: any) {
    this.navigatePendingPayment(e.rowData.id);
  }

  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // Initialize an object to store the checked state of each row
  rowCheckedState: { [key: number]: boolean } = {};
  selectedIds: number[] = [];

  // users List
  pendingPaymentList$: Observable<PendingPaymentModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
  ]).pipe(
    map(([payments, users]) => {
      return payments.map(payment => {
        payments.forEach(payment => {
          payment.customerName = users.find(user => user.id === payment.customerId)?.name || 'N/A';
          payment.paymentStatusName = this.paymentStatusService.getPaymentStatusDisplayName(payment.paymentStatus);
        });
        return payment;
      }).sort((a, b) => {
        const dateA = new Date(a.createdOn);
        const dateB = new Date(b.createdOn);
        return dateB.getTime() - dateA.getTime();
      }); // sort desc by createdOn
    })
  );

  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: PendingPaymentStoreService,
    private pendingPaymentService: PendingPaymentService,
    private modalService: BsModalService,
    private saleStore: SaleStoreService,
    private saleService: SaleService,
    private userStoreService: UserStoreService,
    private userService: UserService,
    protected paymentStatusService: PaymentStatusService,
    public agGridService: AgGridService
  ) { }

  ngOnInit() {
    this.isPaymentLoading = true;
    this.isSaleLoading = true;
    this.isUserLoading = true;
    this.store.resetPendingPaymentStore();
    this.userStoreService.resetUserStore();
    this.subscriptions.push(
      this.pendingPaymentService.getAll().subscribe(() => this.isPaymentLoading = false),
      this.saleService.getAll().subscribe(() => this.isSaleLoading = false),
      this.userService.getAll().subscribe(() => this.isUserLoading = false),
    )
  }

  // navigate to Pending Payment
  protected navigatePendingPayment(id: number = 0): void {
    this.router.navigate(['pending-payment/pending', id]);
  }

  pendingOrderClick(){
    this.pendingPaymentService.sendReminder(this.selectedIds).pipe(
      tap((res) => {
        if(res){
          this.pendingPaymentList$.subscribe(payments => {
            payments.forEach(payment => this.rowCheckedState[payment.id] = false)
            // Get the IDs of checked payments
            this.selectedIds = payments.filter(payment => this.rowCheckedState[payment.id]).map(payment => payment.id);
            // setting head checkbox unchecked..........
            const headCheckBox = document.getElementById('headCheckBox') as HTMLInputElement;
            headCheckBox.checked = false;
          });
        }
      })
    ).subscribe();
  }


  toggleRowSelection(id: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowCheckedState[id] = isChecked;
    this.updateSelectedIds();
  }

  isSelected(id: number): boolean {
    return this.rowCheckedState[id] || false;
  }
  
  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.pendingPaymentList$.subscribe(payments => {
      payments.forEach(payment => this.rowCheckedState[payment.id] = isChecked)
      // Get the IDs of checked payments
      this.selectedIds = payments.filter(payment => this.rowCheckedState[payment.id]).map(payment => payment.id);
    // console.log(this.selectedIds);
    });
    // console.log(this.rowCheckedState);
  }

  updateSelectedIds() {
    this.selectedIds = Object.keys(this.rowCheckedState)
    .filter(id => this.rowCheckedState[parseInt(id)])
    .map(id => parseInt(id));
    console.log(this.selectedIds)
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
