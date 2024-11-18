import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community'; // Column Definition Type Interface
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
import 'ag-grid-enterprise';


export interface AutoCompleteModel {
  value: any;
  display: string;
}

function isChildRow(params: any): boolean {
  console.log(params);
  return params.data && !params.data.productCodeRange;
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export default class InventoryListComponent {
  colDefs: ColDef[] = [
    { headerName: "#", headerCheckboxSelection: true, checkboxSelection: true, valueGetter: "node.rowIndex + 1", maxWidth: 100, resizable: true },
    { field: "supplierName", headerName: 'Supplier', filter: true, floatingFilter: true },
    { field: "qualityType", headerName: 'Quality', filter: true, floatingFilter: true },
    { field: "product", headerName: 'Product Name', filter: true, floatingFilter: true },
    { field: "shape", headerName: 'Shape', filter: true, floatingFilter: true },
    { field: "design", headerName: 'Design', filter: true, floatingFilter: true },
    { field: "stonesNb", headerName: 'No Of Stones', filter: true, floatingFilter: true },
    { field: "productCode", headerName: 'Product Code', filter: true, minWidth: 150, floatingFilter: true },
    { field: "inStock",
      filter: true, floatingFilter: true,
    },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: (params: any) => ({
        buttonsToShow:  this.getButtonsToShow(params),
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        onPrintClick: this.onPrintClicked.bind(this)
      })
    }
  ];
  public defaultColDef: ColDef = {
    enableValue: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    enableRowGroup: true,
  };

  gridOptions: GridOptions = {
    rowBuffer: 20,
    getRowStyle: (params) => {
      if (params.data && params.data.isSold) {
        // Replace with your actual condition
        return { background: "rgba(220, 20, 60, 0.1)" }; // Transparent crimson color
      }
      return undefined;
    },
  };

  getButtonsToShow(params: any): string[] {
    if (params.node.group) {
      return []; // No buttons for group rows
    }
    return ['edit', 'delete', 'print'];
  }

  groupDefaultExpanded = 0;
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
  
  // onToggleClick(e: any) {
  //   this.toggleGuidVisibility(e.rowData.guid);
  // }

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
        if(row.id) idsArray.push(row.id);
      })

      this.printInventoryBarcode(idsArray);

      this.agGrid.api.deselectAll();
    } else {
      console.error("Grid API is not available yet.");
    }
  }
  printHTML(htmlContent: string) {
    const dummyContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Bar Code</title><style>
      body {
        margin: 0;
        padding: 0;
      }
      .page-container {
        width: 101.6mm;
        height: auto;
        margin: 0;
        padding: 0;
      }
      .page {
        width: 50.8mm;
        height: 25mm;
        margin: 0;
        padding: 1mm 5mm;
      }
      img {
        height: 5mm;
        width: auto;
      }
      @media print {
        .page {
          page-break-before: always; /* Ensures each .page starts on a new page */
          page-break-inside: avoid; /* Prevents page break inside the div */
        }

        /* To avoid the first div from breaking before */
        .page:first-of-type {
          page-break-before: auto;
        }
      }
    </style></head><body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0;">
  <div class="page-container"
    style='box-sizing: border-box; display: flex; justify-content: space-between; flex-wrap: wrap;'>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL146</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL147</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL148</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL149</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL150</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL146</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL147</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL148</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL149</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL150</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
    <div class="page"
      style='box-sizing: border-box;  display: flex; flex-direction: column; justify-content: space-between;'>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>A&L-APBBL151</p>
        <p>4*5</p>
      </div>
      <div style='box-sizing: border-box; width: 100%; display: flex; justify-content: center;'><img
          src='https://artsandlife.atf-labs.com/images/barcode.jpg ' alt='barcode' /></div>
      <div style='box-sizing: border-box; display: flex; justify-content: space-between; font-size: 10.5px; font-family: arial'>
        <p>454533.00</p>
        <p>12356</p>
      </div>
    </div>
  </div>
</body></html>`
    printJS({
      
      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
    // console.log(htmlContent);
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

  


  filteredInventoryList: any[] = [];
  expandedGuids: Set<string> = new Set();
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
              inStock: !inventory.isSold,
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return dateB.getTime() - dateA.getTime();
          });
    
        // this.addProductCodeRange(result);
        // this.filteredInventoryList = this.filterUniqueGuids(result);
        return result;
      })
    );
  }

  // addProductCodeRange(inventories: any[]): void {
  //   const guidMap = new Map<string, string[]>();
  
  //   inventories.forEach(inventory => {
  //     if (!guidMap.has(inventory.guid)) {
  //       guidMap.set(inventory.guid, []);
  //     }
  //     guidMap.get(inventory.guid)?.push(inventory.productCode);
  //   });
  
  //   inventories.forEach(inventory => {
  //     const productCodes = guidMap.get(inventory.guid);
  //     if (productCodes) {
  //       productCodes.sort();
  //       inventory.productCodeRange = `${productCodes[0]} - ${productCodes[productCodes.length - 1]}`;
  //     }
  //   });
  // }
  
  // filterUniqueGuids(inventories: any[]): any[] {
  //   const uniqueGuids = new Set();
  //   return inventories.filter(inventory => {
  //     if (!uniqueGuids.has(inventory.guid)) {
  //       uniqueGuids.add(inventory.guid);
  //       return true;
  //     }
  //     return false;
  //   }).map(inventory => ({
  //     guid: inventory.guid,
  //     productCodeRange: inventory.productCodeRange,
  //     supplierName: '',
  //     qualityType: '',
  //     product: '',
  //     shape: '',
  //     design: '',
  //     stonesNb: '',
  //     productCode: '',
  //     action: ''
  //   }));
  // }
  
  // toggleGuidVisibility(guid: string): void {
  //   if (this.expandedGuids.has(guid)) {
  //     this.expandedGuids.delete(guid);
  //   } else {
  //     this.expandedGuids.add(guid);
  //   }
  //   this.updateFilteredInventoryList();
  // }
  
  // updateFilteredInventoryList(): void {
  //   this.inventoryList$.subscribe(inventories => {
  //     const uniqueGuids = new Set();
  //     this.filteredInventoryList = inventories.reduce((acc: any, inventory: any) => {
  //       if (!uniqueGuids.has(inventory.guid)) {
  //         uniqueGuids.add(inventory.guid);
  //         acc.push({
  //           guid: inventory.guid,
  //           productCodeRange: inventory.productCodeRange,
  //           supplierName: '',
  //           qualityType: '',
  //           product: '',
  //           shape: '',
  //           design: '',
  //           stonesNb: '',
  //           productCode: '',
  //           action: ''
  //         });
  //         if (this.expandedGuids.has(inventory.guid)) {
  //           acc.push({ ...inventory, productCodeRange: '' });
  //         }
  //       } else if (this.expandedGuids.has(inventory.guid)) {
  //         acc.push({ ...inventory, productCodeRange: '' });
  //       }
  //       return acc;
  //     }, []);
  //   });
  // }
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
