import { Component, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";
import {
  combineLatest,
  combineLatestAll,
  map,
  Observable,
  Subscription,
  tap,
} from "rxjs";
import MessageDialogBoxComponent from "../../components/message-dialog-box/message-dialog-box.component";
import { Router } from "@angular/router";
import { SaleStoreService } from "src/app/shared/store/sales/sale.store";
import { orderNoForm, SaleModel } from "src/app/shared/store/sales/sale.model";
import { SaleService } from "src/app/shared/store/sales/sale.service";
import { RoleService } from "src/app/shared/store/role/role.service";
import { DesignStoreService } from "src/app/shared/store/design/design.store";
import { DesignService } from "src/app/shared/store/design/design.service";
import { QualityStoreService } from "src/app/shared/store/quality/quality.store";
import { QualityService } from "src/app/shared/store/quality/quality.service";
import { VoucherStoreService } from "src/app/shared/store/voucher/voucher.store";
import { VoucherService } from "src/app/shared/store/voucher/voucher.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";
import { UserService } from "src/app/shared/store/user/user.service";
import {
  Pagination,
  createPagination,
} from "src/app/core/models/pagination.model";
import {
  ModalConfirmComponent,
  ModalType,
} from "src/app/shared/components/modal-confirm/modal-confirm.component";
import { BsModalService } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { dateFilterForm } from "src/app/shared/store/voucher/voucher.model";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { DateService } from "src/app/shared/service/date.service";
import { OrderStatusService } from "src/app/shared/service/order-status.service";
import { PaymentStatusService } from "src/app/shared/service/payment-status.service";
import { AuthService } from "src/app/core/service/auth.service";
import { InvoiceService } from "src/app/shared/store/invoice/invoice.service";
import { MessageToastService } from "src/app/core/service/message-toast.service";
import { ColDef, GridOptions } from "ag-grid-community"; // Column Definition Type Interface
import { AgCustomButtonComponent } from "src/app/shared/components/Button/ag-custom-button/ag-custom-button.component";
import { environment } from "src/environments/environment";
import { AgGridService } from "src/app/shared/service/ag-grid.service";
import { ImageService } from "src/app/core/service/Image.service";
import { ModalPrintShowComponent } from "src/app/shared/components/modal-print-show/modal-print-show.component";
import { ProgressBarComponent } from "src/app/shared/components/progress-bar/progress-bar.component";
import printJS from "print-js";
import { ModalCancelConfirmComponent } from "src/app/shared/components/modal-cancel-confirm/modal-cancel-confirm.component";
import { AgCustomDropdownComponent } from "src/app/shared/components/Button/ag-custom-dropdown/ag-custom-dropdown.component";

@Component({
  selector: "app-sale-list",
  templateUrl: "./sale-list.component.html",
  styleUrls: ["./sale-list.component.scss"],
})
export default class SaleListComponent implements OnInit, OnDestroy {
  colDefs: ColDef[] = [
    {
      headerName: "Order Date",
      field: "orderDate",
      filter: "agDateColumnFilter",
      floatingFilter: true,
      valueFormatter: (params) => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString("en-US", {
          month: "short", // "Jul"
          day: "numeric", // "4"
          year:
            date.getFullYear() === new Date().getFullYear()
              ? undefined
              : "numeric", // "2024"
          hour: "numeric", // "3"
          minute: "numeric", // "39"
          hour12: true, // Use 12-hour format
        });
      },
      minWidth: 150,
      filterParams: this.agGridService.filterParams,
    },
    {
      headerName: "Order No.",
      field: "orderNumber",
      filter: true,
      floatingFilter: true,
      maxWidth: 100,
    },
    {
      headerName: "Tracking No.",
      field: "tracking.trackingNumber",
      filter: true,
      floatingFilter: true,
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Voucher No.",
      field: "voucherCode",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Invoice No.",
      field: "gstInvoiceNumber",
      filter: true,
      floatingFilter: true,
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Customer Name",
      field: "customerName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Order Status",
      field: "orderStatusName",
      filter: true,
      floatingFilter: true,
      cellStyle: (params) => {
        if (params.value === "To Be Shipped") {
          return { color: "darkorange" };
        } else if (params.value === "Delivered") {
          return { color: "darkgreen" };
        } else if (params.value === "Under Shipment") {
          return { color: "yellowgreen" };
        } else if (params.value === "Under Process") {
          return { color: "crimson" };
        }
        return null;
      },
    },
    {
      headerName: "Payment Status",
      field: "paymentStatusName",
      filter: true,
      floatingFilter: true,
      cellStyle: (params) => {
        if (params.value === "Success") {
          return { color: "darkgreen" };
        } else if (params.value === "Partial Payment") {
          return { color: "darkorange" };
        } else if (params.value === "Unpaid") {
          return { color: "crimson" };
        }
        return null;
      },
    },
    {
      headerName: "Hand Carry",
      field: "isHandCarry",
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    {
      headerName: "Cancelled",
      field: "isCancelled",
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomDropdownComponent,
      cellClass: "actions-button-cell",
      cellRendererParams: {
        buttonsToShow: ["view", "edit", "delete", "print", "cancel"],
        onViewClick: this.onViewClicked.bind(this),
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        onPrintClick: this.onPrintClicked.bind(this),
        onCancelClick: this.onCancelClicked.bind(this),
      },
      minWidth: 100,
    },
  ];

  gridOptions: GridOptions = {
    getRowStyle: (params) => {
      if (params.data && params.data.isCancelled) {
        // Replace with your actual condition
        return { background: "rgba(220, 20, 60, 0.1)" }; // Transparent crimson color
      }
      return undefined;
    },
  };

  paginationPageSize = environment.tableRecordSize;

  onViewClicked(e: any) {
    // this.router.navigate(['sale/view', e.rowData.id]);
    this.showInvoice(e.rowData);
  }

  onEditClicked(e: any) {
    this.navigateSale(e.rowData.id);
  }

  onDeleteClicked(e: any) {
    this.openDeleteConfirmationModal(e.rowData);
  }

  onPrintClicked(e: any) {
    this.printInvoice(e.rowData);
  }

  onCancelClicked(e: any) {
    this.openCancelConfirmationModal(e.rowData);
  }

  // pagination config
  pagingConfig: Pagination = createPagination({});

  // users List
  saleList$: Observable<SaleModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
    this.voucherStoreService.selectAll(),
  ]).pipe(
    map(([sales, users, vouchers]) => {
      return sales
        .map((sale) => {
          sales.forEach((sale) => {
            sale.salesManName =
              users.find((user) => user.id === sale.salesManId)?.name || "N/A";
            sale.voucherCode =
              vouchers.find((voucher) => voucher.id === sale.voucherId)
                ?.voucherCode || "N/A";
            sale.customerName =
              users.find((user) => user.id === sale.customerId)?.name || "N/A";
            sale.orderStatusName =
              this.orderStatusService.getOrderStatusDisplayName(
                sale.orderStatus
              );
            sale.paymentStatusName =
              this.paymentStatusService.getPaymentStatusDisplayName(
                sale.paymentStatus
              );
            sale.mobileNumberList =
              users.find((user) => user.id === sale.customerId)
                ?.mobileNumberList || [];
          });
          return sale;
        })
        .sort((a, b) => {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        }); // sort desc by id
    })
  );

  // if user is sales man then dont show him sale list
  isUserSalesMan: boolean = false;
  isForeignSale : boolean =true;

  dateFilterForm: FormGroup<dateFilterForm> =
    this.formBuilder.nonNullable.group({
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
    });

  // form for order number
  orderNoForm: FormGroup<orderNoForm>;

  get fromDate() {
    return this.dateFilterForm.get("fromDate") as FormControl;
  }

  get toDate() {
    return this.dateFilterForm.get("toDate") as FormControl;
  }

  // GETTERS FOR ORDER-NO-FORM
  get orderNo() {
    return this.orderNoForm.get("orderNo") as FormControl;
  }

  // subscription
  subscriptions: Subscription[] = [];

  @ViewChild(MessageDialogBoxComponent)
  messageDialog!: MessageDialogBoxComponent;
  public message: string = "";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: SaleStoreService,
    private saleService: SaleService,
    private roleService: RoleService,
    private designService: DesignService,
    private qualityService: QualityService,
    private voucherService: VoucherService,
    private voucherStoreService: VoucherStoreService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    protected orderStatusService: OrderStatusService,
    protected paymentStatusService: PaymentStatusService,
    private invoiceService: InvoiceService,
    private modalService: BsModalService,
    private authService: AuthService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    protected dateService: DateService,
    private datePipe: DatePipe,
    private messageService: MessageToastService,
    public agGridService: AgGridService,
    private imageService: ImageService
  ) {
    this.orderNoForm = this.formBuilder.nonNullable.group({
      orderNo: [{ value: "New-Order", disabled: true }],
      enableOrderNo: [false],
      isForeignSale:[false]
    });
  }

  ngOnInit() {
    // check user is sales man or admin
    this.isUserSalesMan = this.authService.getRole() == 2000 ? true : false;
    if (this.isUserSalesMan) {
      this.navigateSale('counter');
    }
    

    this.store.resetSaleStore();
    this.userStoreService.resetUserStore();
    this.subscriptions.push(
      combineLatest([
        this.saleService.getOrderNo(),
        this.saleService.getAll(), // Removed .subscribe()
        this.roleService.getAll(), // Removed .subscribe()
        this.qualityService.getAll(), // Removed .subscribe()
        this.designService.getAll(), // Removed .subscribe()
        this.voucherService.getAll(), // Removed .subscribe()
        this.userService.getAll(), // Removed .subscribe()
      ])
        .pipe(
          tap(
            ([orderNo, sales, roles, qualities, designs, vouchers, users]) => {
              // this.orderNo.setValue(orderNo);
              // You can now use sales, roles, qualities, designs, vouchers, and users as needed
            }
          )
        )
        .subscribe()
    );
  }

  // Toogle order no field for manula order numbers
  toggleOrderNoField(): void {
    const enableOrderNo = this.orderNoForm.get("enableOrderNo")?.value;
    let orderNoField = this.orderNoForm.get("orderNo");
    if (enableOrderNo) {
      orderNoField?.enable();
      orderNoField?.setValue("");
    } else {
      orderNoField?.disable();
      orderNoField?.setValue("New-Order");
    }
  }
  // Navigate to Sale detail
  protected navigateSale(type: 'counter' | 'foreign', id: number = 0): void {
    const enableOrderNoValue = this.orderNoForm.get("enableOrderNo")?.value;
    

    if (id === 0 && this.orderNo.value !== ""  ) {
      if (enableOrderNoValue) {
        this.saleService
          .checkOrderNo(this.orderNo.value)
          .pipe(
            tap((result) => {
              if (result) {
              } else {
                this.router.navigate(["sale", type, id, this.orderNo.value]);
              }
            })
          )
          .subscribe();
      } else {
        this.router.navigate(["sale",type, id, this.orderNo.value]);
      }
    } else if (id !== 0) {
      this.router.navigate(["sale",type, id, this.orderNo.value]);
    }
  }

  openDeleteConfirmationModal(item: SaleModel) {
    const initialState = {
      item,
      message: `delete sale: ${item.orderNumber}`,
      modalType: ModalType.Confirmation,
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, {
      initialState,
      class: "modal-sm modal-dialog-centered",
    });
    const sub = modalRef.content?.onClose
      .pipe(
        tap((result: boolean) => {
          if (result) {
            this.saleService.deleteSale(item);
          }
        })
      )
      .subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  openCancelConfirmationModal(item: SaleModel) {
    const initialState = {
      item,
      message: `cancel sale: ${item.orderNumber}`,
      modalType: ModalType.Confirmation,
    };

    const modalRef = this.modalService.show(ModalCancelConfirmComponent, {
      initialState,
      class: "modal-sm modal-dialog-centered",
    });
    const sub = modalRef.content?.onClose
      .pipe(
        tap((result: any) => {
          if (result) {
            let comment = result.comment.value;
            this.saleService.cancelSale(item, comment);
          }
        })
      )
      .subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  showInvoice(sale: SaleModel) {
    this.invoiceService
      .printInvoice(sale.id)
      .pipe(
        tap((invoiceResponse) => {
          if (invoiceResponse) {
            // show pdf in new tab
            // console.log('Invoice res - '+ invoiceResponse);
            // window.open(invoiceResponse, "_blank");

            // const newWindow = window.open("", "_blank");
            // if (newWindow) {
            //   newWindow.document.write(invoiceResponse);
            //   newWindow.document.close(); // Close the document to finish loading the content
            // } else {
            //   console.error("Failed to open new window");
            // }

            // this.router.navigate(['sale/view', e.rowData.id]);
            this.router.navigate(["sale/view"], {
              state: { invoiceHtml: invoiceResponse },
            });
          }
        })
      )
      .subscribe();
  }

  printHTML(htmlContent: string) {
    printJS({
      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
  }

  printInvoice(sale: SaleModel) {
    this.invoiceService
      .printInvoice(sale.id)
      .pipe(
        tap((invoiceResponse) => {
          // if (invoiceResponse) {
          //   const iframe = document.createElement('iframe');
          //   iframe.style.position = 'absolute';
          //   iframe.style.width = '0';
          //   iframe.style.height = '0';
          //   iframe.style.border = 'none';

          //   document.body.appendChild(iframe);
          //   const contentWindow = iframe.contentWindow;
          //   const doc = iframe.contentWindow?.document;
          //   if (doc) {
          //     doc.open();
          //     doc.write(invoiceResponse);
          //     doc.close();

          //     if(contentWindow){
          //       contentWindow.onafterprint = () => {
          //         iframe.remove(); // Remove iframe after the user has interacted with the print dialog
          //       };
          //     }

          //     if(iframe.contentWindow){
          //       iframe.contentWindow.onload = () => {
          //         iframe.contentWindow?.focus();
          //         iframe.contentWindow?.print();
          //       }
          //     }

          //     // Remove the iframe after printing
          //     // iframe.remove();
          //   }
          // }

          if (invoiceResponse) {
            this.printHTML(invoiceResponse);
          }
        })
      )
      .subscribe();
  }

  // printInvoice1(sale: SaleModel){
  //   const modalRef = this.modalService.show(ModalPrintShowComponent, { class: 'modal-sm modal-dialog-centered' });
  //   const sub = modalRef.content?.onClose.pipe(
  //     tap(
  //       (result: number) => {
  //         if (result == 1) {
  //           // print the invoice
  //           this.invoiceService.printInvoice(sale.id, 1).pipe(
  //             tap((invoiceResponse) => {
  //               // if (invoiceResponse) {
  //               //   const iframe = document.createElement('iframe');
  //               // iframe.style.position = 'absolute';
  //               // iframe.style.width = '0';
  //               // iframe.style.height = '0';
  //               // iframe.style.border = 'none';

  //               // document.body.appendChild(iframe);
  //               // console.log("Added")
  //               // const contentWindow = iframe.contentWindow;
  //               // const doc = iframe.contentWindow?.document;
  //               // if (doc) {
  //               //   console.log("I am Here")
  //               //   doc.open();
  //               //   doc.write(invoiceResponse);
  //               //   doc.close();

  //               //   if(contentWindow){
  //               //     contentWindow.onafterprint = () => {
  //               //       console.log("Print dialog interaction finished");
  //               //       iframe.remove(); // Remove iframe after the user has interacted with the print dialog
  //               //     };
  //               //   }

  //               //   if(iframe.contentWindow){
  //               //     iframe.contentWindow.onload = () => {
  //               //       iframe.contentWindow?.focus();
  //               //       iframe.contentWindow?.print();
  //               //     }
  //               //   }

  //               //   // Remove the iframe after printing
  //               //   // iframe.remove();
  //               // }
  //               // }

  //               let invoice = JSON.parse(invoiceResponse);

  //               if (invoice.url) {
  //                 // show pdf in new tab
  //                 window.open(this.imageService.getGeneratedURL(invoice.url), "_blank");
  //               }

  //             })
  //           ).subscribe()
  //         }
  //         else if(result == 0){
  //           // show the invoice
  //           this.invoiceService.printInvoice(sale.id, 0).pipe(
  //             tap((invoiceResponse) => {
  //               if (invoiceResponse) {

  //                 // show pdf in new tab
  //                 window.open(invoiceResponse, "_blank");
  //               }
  //             })
  //           ).subscribe()
  //         }
  //         else{
  //           // do nothing
  //         }
  //       }
  //     )
  //   ).subscribe();
  // }

  // variables for date filter
  hoveredDate: NgbDate | null = null;
  fromDate1: NgbDate | null = this.calendar.getPrev(
    this.calendar.getToday(),
    "d",
    10
  );
  toDate1: NgbDate | null = this.calendar.getToday();
  limitDate: NgbDate | null = this.calendar.getToday();

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate1 = date;
    } else if (
      this.fromDate1 &&
      !this.toDate1 &&
      date &&
      (date.after(this.fromDate1) || date.equals(this.fromDate1))
    ) {
      this.toDate1 = date;
    } else {
      this.toDate1 = null;
      this.fromDate1 = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate1) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return (
      this.toDate && date.after(this.fromDate1) && date.before(this.toDate1)
    );
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate1) ||
      (this.toDate && date.equals(this.toDate1)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  filterClick(): void {
    this.fromDate.setValue(
      new Date(
        this.fromDate1!.year,
        this.fromDate1!.month - 1,
        this.fromDate1!.day
      )
    );
    this.fromDate.setValue(
      this.datePipe.transform(this.fromDate.value, "yyyy-MM-ddTHH:mm:ss.SSSS")
    );
    this.toDate.setValue(
      new Date(
        this.toDate1!.year,
        this.toDate1!.month - 1,
        this.toDate1!.day,
        23,
        59,
        59,
        999
      )
    );
    this.toDate.setValue(
      this.datePipe.transform(this.toDate.value, "yyyy-MM-ddTHH:mm:ss.SSSS")
    );
    if (this.dateFilterForm.valid || this.dateFilterForm.disabled) {
      this.saleList$ = this.store.filterByDateRange(
        this.fromDate.value,
        this.toDate.value
      );
    }
  }

  resetClick(): void {
    this.saleList$ = this.store.selectAll();
    this.fromDate.setValue(new Date());
    this.toDate.setValue(new Date());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
