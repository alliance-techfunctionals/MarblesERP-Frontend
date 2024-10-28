import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, of, Subscription, tap } from 'rxjs';
import { Design } from 'src/app/shared/store/design/design.model';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import {PurchaseModel} from 'src/app/shared/store/Purchase-voucher/purchase.model';
import { PurchaseVoucherService } from 'src/app/shared/store/Purchase-voucher/purchase.service';
import { PurchaseVoucherStoreService } from 'src/app/shared/store/Purchase-voucher/purchase.store';
import { Quality } from 'src/app/shared/store/quality/quality.model';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import {ColDef} from 'ag-grid-community';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { FormControl } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { InvoiceService } from 'src/app/shared/store/invoice/invoice.service';
import printJS from "print-js";



@Component({
  selector: "app-purchase-voucher-list",
  templateUrl: "./purchase-voucher-list.component.html",
  styleUrls: ["./purchase-voucher-list.component.scss"],
})
export class PurchaseVoucherListComponent implements OnInit {
  colDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 60,
      resizable: true,
    },
    {
      field: "poNumber",
      headerName: "Purchase Order No",
      filter: true,
      minWidth: 300,
      floatingFilter: true,
    },
    {
      field: "voucherDate",
      headerName: "Date",
      filter: true,
      minWidth: 300,
      floatingFilter: true,
      valueFormatter: params => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString('en-US', {
          month: 'short', // "Jul"
          day: 'numeric', // "4"
          year:  'numeric', // "2024"
          // hour: 'numeric', // "3"
          // minute: 'numeric', // "39"
          // hour12: true // Use 12-hour format
        });
      },
    },

    {
      field: "supplierName",
      headerName: "Supplier",
      filter: true,
      minWidth: 300,
      floatingFilter: true,
    },

    // { field: "supplierName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ["edit", "delete", "print"],
        // onViewClick: this.onViewClicked.bind(this),
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        // onImageClick: this.onImageClicked.bind(this),
        onPrintClick: this.onPrintClicked.bind(this),
      },
      minWidth: 150,
      flex: 1,
    },
  ];
  public defaultColDef: ColDef = {
    enableValue: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };

  // onViewClicked(e: any) {
  //   this.router.navigate(["purchase", e.rowData.id]);
  // }

  onEditClicked(e: any) {
    this.router.navigate([
      "purchase-voucher/purchase-voucher-detail",
      e.rowData.id,
    ]);
  }

  onDeleteClicked(e: any) {
    this.openDeleteConfirmationModal(e.rowData);
  }
  onPrintClicked(e: any) {
    this.printPurchaseVoucher(e.rowData);
  }

  // purchaseVoucherList$: Observable<PurchaseModel[]> = this.store.selectAll();
  qualityList$: Observable<Quality[]> = this.qualityStoreService.selectAll();
  designList$: Observable<Design[]> = this.designStoreService.selectAll();

  // forms for
  qualitySearch = new FormControl("");
  qualitySearchId = new FormControl(0);

  designSearch = new FormControl("");
  designSearchId = new FormControl(0);
  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: PurchaseVoucherStoreService,
    private purchaseVoucherService: PurchaseVoucherService,
    private designStoreService: DesignStoreService,
    private modalService: BsModalService,
    private qualityStoreService: QualityStoreService,
    private userStoreService: UserStoreService,
    private userService: UserService,
    private invoiceService: InvoiceService,
  ) {}

  purchaseVoucherList$ = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
    
  ]).pipe(
    map(([purchaseVouchers, users]) => {
      const userMap = new Map(users.map(user => [user.id, user]));

      const result = purchaseVouchers.map((purchaseVoucher) => {
        const supplier = userMap.get(purchaseVoucher.supplierId);

        return {
          ...purchaseVoucher,
          supplierName: supplier?.name || "N/A",
        };
      }).sort((a, b) => {
        const dateA = new Date(a.voucherDate);
        const dateB = new Date(b.voucherDate);
        return dateB.getTime() - dateA.getTime();
      });

      console.timeEnd('Mapping and Sorting Time');
      return result;
    })
  );


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    console.log("Hi there");
    this.store.resetPurchaseVoucherStore();
    this.userStoreService.resetUserStore();
    this.subscriptions.push(
      combineLatest([
        this.purchaseVoucherService.getAll(),
        this.userService.getAll(), // Removed .subscribe()

      ]) .pipe(
        tap(
          ([purchaseVouchers, users]) => {
            // this.orderNo.setValue(orderNo);
            // You can now use sales, roles, qualities, designs, vouchers, and users as needed
          }
        )
      )
      .subscribe()
  );


    // this.subscriptions.push(
      

    //   this.purchaseVoucherService
    //     .getAll()

    //     .subscribe()
    // );


    



    // this.purchaseVoucherList$ = combineLatest([this.store.selectAll()]).pipe(
    //   map(([purchase]) => {
    //     return purchase
    //       .map((purchase) => {
    //         // const design = designs.find(design => design.id == inventory.designId);

    //         return purchase;
    //       })
    //       .sort((a, b) => b.id - a.id); // sort desc by id
    //   })
    // );

    this.purchaseVoucherList$.subscribe((res) => {
      console.log(res);
    });
  }

  showInvoice(purchase: PurchaseModel) {
    this.invoiceService
      .printInvoice(purchase.id)
      .pipe(
        tap((invoiceResponse) => {
          if (invoiceResponse) {
          
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

  printPurchaseVoucher(purchaseVoucher: PurchaseModel) {
    this.purchaseVoucherService
      .printPurchaseVoucher(purchaseVoucher.id)
      .pipe(
        tap((purchaseVoucherResponse) => {
          if (purchaseVoucherResponse) {
            
            this.printHTML(purchaseVoucherResponse);
          }
        })
      )
      .subscribe();
  }
 
  protected navigatePurchaseVoucherDetail(id: number = 0): void {
    console.log("hi");
    this.router.navigate(["purchase-voucher/purchase-voucher-detail", id]);
  }

  protected onQualitySelect(event?: TypeaheadMatch): void {
    const { name, id } = event?.item;
    this.qualitySearch.setValue(name);
    this.qualitySearchId.setValue(id);
  }

  protected onDesignSelect(event?: TypeaheadMatch): void {
    const { name, id } = event?.item;
    this.designSearch.setValue(name);
    this.designSearchId.setValue(id);
  }
  protected openDeleteConfirmationModal(item: PurchaseModel) {
    const initialState = {
      item,
      message: `delete Purchase: ${item.id}`,
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
            this.purchaseVoucherService.deletePurchaseVoucher(item);
          }
        })
      )
      .subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }
}
