import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
// import 'ag-grid-enterprise';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';



import type {
  AngularGridInstance,
  Column,
  DelimiterType,
  Editors,
  FieldType,
  FileType,
  Filters,
  Formatters,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  SortComparers,
} from 'angular-slickgrid';
import { Aggregators } from 'angular-slickgrid';
import { auto } from '@popperjs/core';


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
  rowData: any[] = [];
  colDefs: ColDef[] = [
    { headerName: "#", headerCheckboxSelection: true, checkboxSelection: true, valueGetter: "node.rowIndex + 1", maxWidth: 75, resizable: true },
    {
      headerName: "Date",
      field: "createdOn",
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
      minWidth: 90,
      filterParams: this.agGridService.filterParams,
    },
    { field: "supplierName", headerName: 'Supplier', filter: true, floatingFilter: true },
    { field: "qualityType", headerName: 'Quality', filter: true, floatingFilter: true },
    { field: "product", headerName: 'Product Name', filter: true, floatingFilter: true },
    { field: "shape", headerName: 'Shape', filter: true, floatingFilter: true },
    { field: "design", headerName: 'Design', filter: true, floatingFilter: true },
    { field: "stonesNb", headerName: 'No Of Stones', filter: true, floatingFilter: true },
    { field: "productCode", headerName: 'Product Code', filter: true, minWidth: 150, floatingFilter: true },
    { field: "inStock", filter: true, floatingFilter: true, maxWidth: 75 },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: (params: any) => ({
        buttonsToShow:  this.getButtonsToShow(params),
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        onPrintClick: this.onPrintClicked.bind(this),
        onToggleClick: this.toggleRowExpansion.bind(this),
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
    return ['edit', 'delete', 'print', 'toggler'];
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
    private messageService: MessageToastService,
    public agGridService: AgGridService,
    private changeDetectorRef: ChangeDetectorRef
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

  originalData: any[] = [];
  groupingColumns: string[] = ['supplierName', 'qualityType', 'product']; // Example grouping columns
  ngOnInit() {
    console.log("Init")
    


    this.store.resetInventoryStore();

    this.subscriptions.push(
      combineLatest([
        this.service.getAll(),
        this.userSerive.getAll()
      ])
      .subscribe(() => {
        // this.prepareGrid();
      })
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

        this.originalData = result;
        return result;
      })
    );

    this.inventoryList$.subscribe((data) => {
      // this.updateRowData();
      // this.rowData = data;
    });

    this.groupDataCounter = 0;
    this.groupData();
  }

  groupDataCounter: number = 0;

  groupData(columns: { column: keyof InventoryModel, value: any }[] = [], groupId: number = -1) {
    let filteredData: InventoryModel[] = [];

    this.store.filterByColumns(columns).subscribe((data) => {
      filteredData = data;
      /**
       * If column is equal to groupingColumns, then add the filtered data right after the row on which expand button is clicked
       * Then create rows which have distinct values of the column placed at groupingColumns[columns.length], and them right after the row on which expand button is clicked
       */
  
      // Copilot please implement this
      if(columns.length === this.groupingColumns.length - 1) {
        // Add the filtered data right after the row on which expand button is clicked
        // Add the filtered data right after the row which have groupId === groupId and if groupId === -1 then add it at the end
        // Find the index of the row where the expand button is clicked
        const rowIndex = this.rowData.findIndex(row => row.groupId === groupId);
  
        if (rowIndex !== -1) {
          // Insert the filtered data right after the row with the matching groupId
          this.rowData.splice(rowIndex + 1, 0, ...filteredData);
        } else if (groupId === -1) {
          // If groupId is -1, add the filtered data at the end
          this.rowData.push(...filteredData);
        }
  
      }else {
        const groupRows = this.createGroupRows(filteredData, columns, this.groupingColumns[columns.length] as keyof InventoryModel);
        console.log(groupRows);
        // Find the index of the row where the expand button is clicked
        const rowIndex = this.rowData.findIndex(row => row.groupId === groupId);
        if (rowIndex !== -1) {
          // Insert the filtered data right after the row with the matching groupId
          this.rowData.splice(rowIndex + 1, 0, ...groupRows);
        } else if (groupId === -1) {
          // If groupId is -1, add the filtered data at the end
          this.rowData.push(...groupRows);
        }
      }
    });


  }

  createGroupRows(rowData: InventoryModel[], groupColumnsData: any[], columnName: keyof InventoryModel) {
    let groupRows: any = [];
    const uniqueValues = new Set();
  
    // Iterate over rowData to find unique values for columnName
    rowData.forEach(row => {
      if (!uniqueValues.has(row[columnName])) {
        uniqueValues.add(row[columnName]);
        groupRows.push({
          ...row,
          isGroup: true,
          isExpanded: false,
          children: rowData.filter(r => r[columnName] === row[columnName]),
          groupColumnsData: groupColumnsData
        });
      }
    });
  
    return groupRows;
  }

  groupDataByColumns(data: any[], columns: any[]): any[] {
    if (columns.length === 0) {
      return data;
    }

    const groupedData = data.reduce((acc, item) => {
      const groupKey = columns.map(col => item[col]).join('|');
      if (!acc[groupKey]) {
        acc[groupKey] = {
          ...columns.reduce((obj, col) => ({ ...obj, [col]: item[col] }), {}),
          children: [],
          isGroup: true,
          isExpanded: false,
          count: 0
        };
      }
      acc[groupKey].children.push(item);
      acc[groupKey].count += 1;
      return acc;
    }, {});

    return Object.values(groupedData).map((group: any) => ({
      ...group,
      children: this.groupDataByColumns(group.children, columns.slice(1))
    }));
  }

  flattenGroupedData(groupedData: any[], level: number = 0): any[] {
    return groupedData.reduce((acc, group) => {
      if (level === 0) {
        acc.push({
          [this.groupingColumns[0]]: group[this.groupingColumns[0]],
          isGroup: true,
          isExpanded: false,
          count: group.count,
          level: 0,
          children: group.children
        });
      } else if (group.isExpanded) {
        acc.push({
          ...group,
          level,
          isGroup: true,
          isExpanded: false, // Ensure all groups are initially collapsed
          children: undefined
        });
        acc.push(...this.flattenGroupedData(group.children, level + 1));
      }
      return acc;
    }, []);
  }

  toggleRowExpansion(row: any) {
    row.isExpanded = !row.isExpanded;
    this.updateRowData();
  }

  updateRowData() {
    const groupedData = this.groupDataByColumns(this.originalData, this.groupingColumns);
    this.rowData = this.flattenGroupedData(groupedData, 0);
    this.changeDetectorRef.detectChanges();
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









  // columnDefinitions: Column[] = [];
  // gridOption: GridOption = {};
  // dataset: any[] = [];

  // prepareGrid() {
  //   this.columnDefinitions = [
  //     { id: '#', name: '#', field: 'rowIndex', sortable: true, maxWidth: 75, resizable: true },
  //     // {
  //     //   id: 'createdOn',
  //     //   name: 'Date',
  //     //   field: 'createdOn',
  //     //   sortable: true,
  //     //   filter: 'agDateColumnFilter',
  //     //   floatingFilter: true,
  //     //   valueFormatter: (params) => {
  //     //     if (!params.value) return "N/A";
  //     //     const date = new Date(params.value);
  //     //     return date.toLocaleString("en-US", {
  //     //       month: "short",
  //     //       day: "numeric",
  //     //       year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  //     //       hour: "numeric",
  //     //       minute: "numeric",
  //     //       hour12: true,
  //     //     });
  //     //   },
  //     //   minWidth: 90,
  //     //   filterParams: this.agGridService.filterParams,
  //     // },
  //     { id: 'supplierName', name: 'Supplier', field: 'supplierName', sortable: true,
  //       filterable: true,
  //       grouping: {
  //         getter: 'supplierName',
  //         formatter: (g) => `Supplier: ${g.value}`,
  //         aggregators: [
  //           new Aggregators['Sum']('cost')
  //         ],
  //         aggregateCollapsed: false,
  //         collapsed: false
  //       }
  //     },
  //     { id: 'qualityType', name: 'Quality', field: 'qualityType', sortable: true,
  //       filterable: true,},
  //     { id: 'product', name: 'Product Name', field: 'product', sortable: true,
  //       filterable: true,},
  //     { id: 'shape', name: 'Shape', field: 'shape', sortable: true,
  //       filterable: true,},
  //     { id: 'design', name: 'Design', field: 'design', sortable: true,
  //       filterable: true,},
  //     { id: 'stonesNb', name: 'No Of Stones', field: 'stonesNb', sortable: true,
  //       filterable: true,},
  //     { id: 'productCode', name: 'Product Code', field: 'productCode', sortable: true, minWidth: 150,
  //       filterable: true,},
  //     { id: 'inStock', name: 'In Stock', field: 'inStock', sortable: true, maxWidth: 75,
  //       filterable: true,},
  //     // {
  //     //   id: 'action',
  //     //   name: 'Actions',
  //     //   field: 'action',
  //     //   cellRenderer: AgCustomButtonComponent,
  //     //   cellRendererParams: (params: any) => ({
  //     //     buttonsToShow: this.getButtonsToShow(params),
  //     //     onEditClick: this.onEditClicked.bind(this),
  //     //     onDeleteClick: this.onDeleteClicked.bind(this),
  //     //     onPrintClick: this.onPrintClicked.bind(this)
  //     //   })
  //     // }
  //   ];

  //   this.gridOption = {
  //     enableAutoResize: true,
  //     enableSorting: true,
  //     autoResize: {
  //     maxHeight: 1000,
  //     minHeight: 250,
  //     maxWidth: 800,
  //     minWidth: 200,
  //     rightPadding: 40,
  //     bottomPadding: 40,
  //     },
  //     enablePagination: true,
  //     autoHeight: true, // Enable auto height
  //     // auto: true,  // Enable auto width
  //     gridWidth: auto,
  //     forceFitColumns: true,
  //     // createTopHeaderPanel: true,
  //     // showTopHeaderPanel: true,
  //     // topHeaderPanelHeight: 26,
  //     enableFiltering: true,
  //     enableDraggableGrouping: true,

  //     createPreHeaderPanel: true,
  //     showPreHeaderPanel: true,
  //     preHeaderPanelHeight: 30,

  //     // when Top-Header is created, it will be used by the Draggable Grouping (otherwise the Pre-Header will be used)
  //     createTopHeaderPanel: true,
  //     showTopHeaderPanel: true,
  //     topHeaderPanelHeight: 35,

  //   };

  //   // fill the dataset with your data (or read it from the DB)
  //   this.dataset = [
  //     { id: 0, title: 'Task 1', duration: 45, percentComplete: 5, start: '2001-01-01', finish: '2001-01-31' },
  //     { id: 1, title: 'Task 2', duration: 33, percentComplete: 34, start: '2001-01-11', finish: '2001-02-04' },
  //   ];
  // }
  
}
