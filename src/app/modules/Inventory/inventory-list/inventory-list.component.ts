import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef, GridApi } from 'ag-grid-community'; // Column Definition Type Interface
import { BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { combineLatest, concatMap, map, Observable, of, Subscription, tap } from 'rxjs';
import { createPagination, Pagination } from 'src/app/core/models/pagination.model';
import { ImageService } from 'src/app/core/service/Image.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { Design } from 'src/app/shared/store/design/design.model';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { InventoryModel } from 'src/app/shared/store/inventory/inventory.model';
import { InventoryService } from 'src/app/shared/store/inventory/inventory.service';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
import { Quality } from 'src/app/shared/store/quality/quality.model';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { environment } from 'src/environments/environment';
import MessageDialogBoxComponent from '../../components/message-dialog-box/message-dialog-box.component';
// import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import printJS from 'print-js';
import { ModalDeleteInventoryComponent } from 'src/app/shared/components/modal-delete/modal-delete-inventory.component';

export interface AutoCompleteModel {
  value: any;
  display: string;
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export default class InventoryListComponent {
  colDefs: ColDef[] = [
    // { field: '', headerCheckboxSelection: true, checkboxSelection: true},
    { headerName: "#", headerCheckboxSelection: true, checkboxSelection: true, valueGetter: "node.rowIndex + 1", maxWidth: 60, resizable: true },
    { field: "supplierName", headerName: 'Supplier', filter: true, floatingFilter: true },
    { field: "qualityType", headerName: 'Quality', filter: true, floatingFilter: true},
    { field: "product",headerName: 'Product Name', filter: true, floatingFilter: true},
    { field: "shape",headerName: 'Shape', filter: true, floatingFilter: true},
    { field: "design",headerName: 'Design', filter: true, floatingFilter: true},
    { field: "stonesNb",headerName: 'No Of Stones', filter: true, floatingFilter: true},
    { field: "productCode",headerName: 'Product Code', filter: true, minWidth: 150, floatingFilter: true},
    // { field: "supplierName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ['edit', 'delete' , 'print'],
        // onViewClick: this.onViewClicked.bind(this),
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        // onImageClick: this.onImageClicked.bind(this),
        onPrintClick: this.onPrintClicked.bind(this)
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
  

  // onViewClicked(e: any) {
  //   this.router.navigate(['sale/view', e.rowData.id]);
  // }

  onEditClicked(e: any) {
    this.router.navigate(['inventory', e.rowData.id]);
  }

  onDeleteClicked(e: any) {
    console.log("Deleted")
    this.openDeleteConfirmationModal(e.rowData);
  }

  // onImageClicked(e: any) {
  //   if(e.rowData.fileKey != null){
  //     window.open(this.imageService.getGeneratedURL(e.rowData.fileKey), "_blank");
  //   }
  //   else{
  //     this.messageService.error("No Image Found");
  //   }
  // }
  onRowSelected(): void {
    // Get the selected rows using the grid API
    this.selectedRows = this.agGrid.api.getSelectedRows();
    
    // Show the button if rows are selected
    this.showButton = this.selectedRows.length > 0;
  }
  onPrintClicked(e: any) {
    const idsArray: number[] = []
    idsArray.push(e.rowData.id);
    this.printInventoryBarcode(idsArray);
  }
  // pagination config
  pagingConfig: Pagination = createPagination({});

  // inventories List
  inventoryList$: Observable<any> = of([]);
  qualityList$: Observable<Quality[]> = this.qualityStoreService.selectAll();
  designList$: Observable<Design[]> = this.designStoreService.selectAll();

  // forms for 
  qualitySearch = new FormControl('');
  qualitySearchId = new FormControl(0);

  designSearch = new FormControl('');
  designSearchId = new FormControl(0);

  // subscription
  subscriptions: Subscription[] = [];

  @ViewChild(MessageDialogBoxComponent) messageDialog!: MessageDialogBoxComponent;
  public message: string = "";

  constructor(
    private router: Router,
    private store: InventoryStoreService,
    private service: InventoryService,
    private designStoreService: DesignStoreService,
    private designService: DesignService,
    private qualityStoreService: QualityStoreService,
    private qualityService: QualityService,
    private modalService: BsModalService,
    private userSerive: UserService,
    private userStoreService: UserStoreService,
    private imageService: ImageService,
    private messageService: MessageToastService

  ) { }
  private gridApi!: GridApi;
  
  
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  selectedRows: any[] = []; // Store selected rows
  showButton: boolean = false; // Initially, show the button

@ViewChild('agGrid') agGrid!: AgGridAngular;


  printAll() {
    if (this.agGrid && this.agGrid.api) {
      const selectedRows = this.agGrid.api.getSelectedRows(); // Get selected rows
      console.log("Selected Rows: ", this.selectedRows);
      const idsArray: number[] = []
      selectedRows.forEach((row) => {
        idsArray.push(row.id);
      })

      this.printInventoryBarcode(idsArray);
    } else {
      console.error("Grid API is not available yet.");
    }
  }
  printHTML(htmlContent: string) {
    printJS({
      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
  }

  printInventoryBarcode(productIds:number[]){

    this.service
      .printInventoryBarcode(productIds)
      .pipe(
        tap((productBarcodeResponse) => {
          if (productBarcodeResponse) {
            
            this.printHTML(productBarcodeResponse);
          }
        })
      )
      .subscribe();

  }

  


  
  ngOnInit() {
    console.log("Init")
    


    this.store.resetInventoryStore();

    this.subscriptions.push(
      combineLatest([
        this.service.getAll(),
        this.userSerive.getAll()
      ])
      .subscribe()
    )

    
    this.inventoryList$ = combineLatest([
      this.store.selectAll(),
      this.userStoreService.selectAll(),
    ]).pipe(
      map(([inventories, users]) => {
        const userMap = new Map(users.map((user) => [user.id, user]));

        const result = inventories
          .map((inventory) => {
            const supplier = userMap.get(inventory.supplierId);

            return {
              ...inventory,
              supplierName: supplier?.name || "N/A",
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return dateB.getTime() - dateA.getTime();
          });

          return result;
      })
    );
  }
  // printInvoice(sale: SaleModel){
  //   this.invoiceService.printInvoice(sale.id).pipe(
  //     tap((invoiceResponse) => {
  //       console.log("Here " + typeof invoiceResponse);
  //       console.log("Here " + invoiceResponse.url);
        

  //       let invoice = JSON.parse(invoiceResponse);
        
  //       if (invoice.url) {
  //         show pdf in new tab
  //         window.open(this.imageService.getGeneratedURL(invoice.url), "_blank");
  //       }
  //     })
  //   ).subscribe()
  // }

  // navigate to Inventory
  protected navigateInventory(id: number = 0): void {
    this.router.navigate(['inventory', id]);
  }
  

  protected openDeleteConfirmationModal(item: InventoryModel) {
    const initialState = {
      item,
      message: `delete inventory: ${item.id}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalDeleteInventoryComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: any) => {
          if(result){

            if (result.value) {
              this.service.deleteInventoryByGuid(item);
              this.store.resetInventoryStore().pipe(
                concatMap(() => this.service.getAll())
              ).subscribe();
            }else{              
              this.service.deleteInventoryById(item);
            }
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  protected getImageURL(fileName: string | null): string {
    return this.imageService.getGeneratedURL(fileName ?? '');
  }

  onQualityInputChange() {
    this.qualitySearch.reset();
    this.qualitySearchId.reset(0);
  }

  onDesignInputChange() {
    this.designSearch.reset();
    this.designSearchId.reset(0);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
}
