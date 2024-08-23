import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import { createPagination, Pagination } from 'src/app/core/models/pagination.model';
import { ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import ModalDeliveryPartnerInputComponent from 'src/app/shared/components/modal-delivery-partner-input/modal-delivery-partner-input.component';
import ModalInputComponent from 'src/app/shared/components/modal-input/modal-input.component';
import { OrderStatusService } from 'src/app/shared/service/order-status.service';
import { DeliveryShipmentService } from 'src/app/shared/store/deliver-shipment/deliver-shipment.service';
import { createShippingModel } from 'src/app/shared/store/deliver-shipment/delivery-shipment.model';
import { createDeliveryPartnerModel } from 'src/app/shared/store/delivery-partner/delivery-partner.model';
import { DeliveryPartnerService } from 'src/app/shared/store/delivery-partner/delivery-partner.service';
import { DeliveryPartnerStoreService } from 'src/app/shared/store/delivery-partner/delivery-partner.store';
import { SaleModel } from 'src/app/shared/store/sales/sale.model';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delivery-shipment',
  templateUrl: './delivery-shipment.component.html',
  styleUrls: ['./delivery-shipment.component.scss']
})
export default class DeliveryShipmentComponent implements OnInit, OnDestroy {
  colDefs: ColDef[] = [
    { headerName: "Date", field: "createdOn", filter: true, floatingFilter: true,
      valueFormatter: params => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString('en-US', {
          month: 'short', // "Jul"
          day: 'numeric', // "4"
          year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric', // "2024"
          hour: 'numeric', // "3"
          minute: 'numeric', // "39"
          hour12: true // Use 12-hour format
        });
      },
      maxWidth: 200
    },
    { headerName: "Order No.", field: "orderNumber", filter: true, floatingFilter: true},
    { headerName: "Customer Name", field: "customerName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    { headerName: "Order Status", field: "orderStatusName", filter: true, floatingFilter: true, cellStyle: (params) => {
      if(params.value === "To Be Shipped"){
        return {color: 'darkorange'}
      }
      else if(params.value === "Delivered"){
        return {color: 'darkgreen'}
      }
      else if(params.value === "Under Shipment"){
        return {color: 'yellowgreen'}
      }
      else if(params.value === "Under Process"){
        return {color: 'crimson'}
      }
      return null;
    }
   },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      minWidth: 250,
      cellRendererParams: {
        buttonsToShow: ['ship', 'delivered'],
        onShipClick: this.onShipClicked.bind(this),
        onDeliveredClick: this.onDeliveredClicked.bind(this),
      }
    }
  ];

  colDefsDelivered: ColDef[] = [
    { headerName: "Date", field: "createdOn", filter: true, floatingFilter: true,
      valueFormatter: params => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString('en-US', {
          month: 'short', // "Jul"
          day: 'numeric', // "4"
          year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric', // "2024"
          hour: 'numeric', // "3"
          minute: 'numeric', // "39"
          hour12: true // Use 12-hour format
        });
      }
    },
    { headerName: "Order No.", field: "orderNumber", filter: true, floatingFilter: true},
    { headerName: "Delivery Partner", field: "deliveryPartnerName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    { headerName: "Tracking ID", field: "tracking.trackingNumber", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    { headerName: "Customer Name", field: "customerName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    { headerName: "Order Status", field: "orderStatusName", filter: true, floatingFilter: true, cellStyle: (params) => {
      if(params.value === "To Be Shipped"){
        return {color: 'darkorange'}
      }
      else if(params.value === "Delivered"){
        return {color: 'darkgreen'}
      }
      else if(params.value === "Under Shipment"){
        return {color: 'yellowgreen'}
      }
      else if(params.value === "Under Process"){
        return {color: 'crimson'}
      }
      return null;
    }
   }
  ];

  public defaultColDef: ColDef = {
    enableValue: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };

  paginationPageSize = environment.tableRecordSize;

  onShipClicked(e: any) {
    if(e.rowData.orderStatus === 6)
      this.openShipmentModal(e.rowData)
    else
      this.messageService.error('Order Is Under Shipment')
  }

  onDeliveredClicked(e: any) {
    if(e.rowData.orderStatus === 7)
      this.upsertDelivery(e.rowData);
    else
      this.messageService.error('Order Is Not Under Shipment')
  }

  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // filter by isHandCarry
  toBeShippedSaleList$: Observable<SaleModel[]> = this.store.selectAll().pipe(
    map(saleList => saleList.filter(sale => !sale.isHandCarry))
  );

  // Splitting the sales based on orderStatus
  ordersWithDeliveredStatus$: Observable<SaleModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
    this.deliveryPartnerStoreService.selectAll()
  ]).pipe(
    map(([sales, users, deliveryPartners]) => {
      return sales.map(sale => {
        sale.customerName = users.find(user => user.id === sale.customerId)?.name || 'N/A';
        sale.orderStatusName = this.orderStatusService.getOrderStatusDisplayName(sale.orderStatus);
        if(sale.tracking)
          sale.deliveryPartnerName = deliveryPartners.find(dp => dp.id === sale.tracking.deliveryPartnerId)?.name || 'N/A';

        return sale;
      }).filter(sale => sale.orderStatus === 8);
    })
  );

  ordersWithNotDeliveredStatus$: Observable<SaleModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll()
  ]).pipe(
    map(([sales, users]) => {
      return sales.map(sale => {
        sale.customerName = users.find(user => user.id === sale.customerId)?.name || 'N/A';
        sale.orderStatusName = this.orderStatusService.getOrderStatusDisplayName(sale.orderStatus);
        return sale;
      }).filter(sale => sale.orderStatus === 6 || sale.orderStatus === 7);
    })
  );

  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: SaleStoreService,
    private saleService: SaleService,
    private userStoreService: UserStoreService,
    private userService: UserService,
    private modalService: BsModalService,
    private deliveryShipmentService: DeliveryShipmentService,
    protected orderStatusService: OrderStatusService,
    private deliveryPartnerService: DeliveryPartnerService,
    private deliveryPartnerStoreService: DeliveryPartnerStoreService,
    private messageService: MessageToastService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.saleService.getAll().subscribe(),
      this.userService.getAll().subscribe(),
      this.deliveryPartnerService.getAll().subscribe()
    )
  }

  openShipmentModal(item: SaleModel) {
    const initialState = {
      item,
      message: `Tracking Id for Order: ${item.orderNumber}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalInputComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        // taking result as any type which is form group
        (result: any) => {
          if (result) {
            const shipping = createShippingModel({
              masterSaleId: item.id,
              trackingNumber: result.input.value,
              clientName: this.userStoreService.getById(item.customerId)?.name || '',
              deliveryPartnerId: result.deliveryPartnerId.value
            });

            this.deliveryShipmentService.upsertShipmentDelivery(shipping, false).pipe(
              tap((result) => {
                if(result) {
                  // change the orderStatus to under shipment
                  item.orderStatus = 7;
                  // update the store
                  this.store.updateSale(item);
                }
              })
            ).subscribe();
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  openDeliveryPartnerInputModal(){
    const initialState = {
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalDeliveryPartnerInputComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        // taking result as any type which is form group
        (result: any) => {
          if (result) {
            const deliveryPartner = createDeliveryPartnerModel({
              name: result.name.value,
              url: result.url.value,
              redirectUrl: result.url.value
            });

            this.deliveryPartnerService.upsertDeliveryPartner(deliveryPartner).pipe(
              tap((result) => {
                if(result) {
                }
              })
            ).subscribe();
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  // Upsert Delivery 
  upsertDelivery(item: SaleModel) {
    const shipping = createShippingModel({
      masterSaleId: item.id,
      clientName: this.userStoreService.getById(item.customerId)?.name || '',
    });

    this.deliveryShipmentService.upsertShipmentDelivery(shipping, true).pipe(
      tap((result) => {
        if(result) {
          // order is delivered so change the status
          item.orderStatus = 8;
          // update the store
          this.store.updateSale(item)
        }
      })
    ).subscribe();
  }

  

  // navigate to Pending Payment
  protected navigatePendingPayment(id: number = 0): void {
    this.router.navigate(['pending-payment/pending', id]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
