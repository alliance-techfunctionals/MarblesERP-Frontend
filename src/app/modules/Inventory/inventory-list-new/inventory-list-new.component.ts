import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Aggregators, AngularGridInstance, AngularSlickgridComponent, Column, FieldType, Formatters, GridOption, GridStateChange, SlickDataView, SlickGrid, SortComparers, SortDirectionNumber } from 'angular-slickgrid';
import { update } from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { it } from 'node:test';
import printJS from 'print-js';
import { combineLatest, concatMap, filter, map, Observable, of, Subscription, tap } from 'rxjs';
import { ImageService } from 'src/app/core/service/Image.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalDeleteInventoryComponent } from 'src/app/shared/components/modal-delete/modal-delete-inventory.component';
import { ModalSaleTypeConfirmComponent } from 'src/app/shared/components/modal-sale-type-confirm/modal-sale-type-confirm.component';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';
import { DateService } from 'src/app/shared/service/date.service';
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
import { dateFilterForm } from 'src/app/shared/store/voucher/voucher.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-inventory-list-new',
  templateUrl: './inventory-list-new.component.html',
  styleUrls: ['./inventory-list-new.component.scss']
})
export class InventoryListNewComponent implements OnInit {
  isLoading = false;
  angularGrid!: AngularGridInstance;
  range!: FormGroup
  // gridOptions!: GridOption;
  // columnDefinitions: Column[] = [];
  dataset: any[] = [];

  // subscription
  subscriptions: Subscription[] = [];


  dateFilterForm: FormGroup<dateFilterForm> = this.formBuilder.nonNullable.group({
    fromDate: [new Date(), Validators.required],
    toDate: [new Date(), Validators.required]
  });

  
  // inventories List
  inventoryList$: Observable<any> = of([]);
  qualityList$: Observable<Quality[]> = this.qualityStoreService.selectAll();
  designList$: Observable<Design[]> = this.designStoreService.selectAll();

  showPrintButton: boolean = false; // Initially, Hide the print button

  constructor(
    private router: Router,
    private calendar: NgbCalendar,
    protected dateService: DateService,
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
    public formatter: NgbDateParserFormatter,
    public agGridService: AgGridService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null, [Validators.required]),
      end: new FormControl<Date | null>(null, [Validators.required]),
    });
    this.isLoading = true;
    this.store.resetInventoryStore();

    this.subscriptions.push(
      combineLatest([
        this.service.getAll(),
        this.userSerive.getAll()
      ])
        .subscribe(() => {
          // this.prepareGrid();
          this.changeDetectorRef.markForCheck();
          this.isLoading = false
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

        return result;
      })
    );

    // this.defineGrid();
    this.inventoryList$.pipe(
      filter((data: any[]) => Array.isArray(data))
    ).subscribe((data) => {
      const sortedData = data.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      this.dataset = sortedData;
      console.log(this.dataset)
      this.updateGridData();
      this.changeDetectorRef.markForCheck();
    });
  }

  angularGridReady(angularGrid: AngularGridInstance | any) {
    this.angularGrid = angularGrid.detail;
    // Subscribe to row selection changes
    this.angularGrid.slickGrid.onSelectedRowsChanged.subscribe((_e, args) => {

      const selectedRowIndexes = args.rows; // Indexes of selected rows
      const selectedRowData = selectedRowIndexes.map((index) =>
        this.angularGrid.dataView.getItem(index)
      );

      if (selectedRowData.length > 0) {
        this.showPrintButton = true;
      } else {
        this.showPrintButton = false;
      }
    });

    // Handle action button clicks
    this.angularGrid.slickGrid.onClick.subscribe((e: any, args: any) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');
      const row = target.getAttribute('data-row');
      const data = this.angularGrid.dataView.getItem(Number(row));

      if (action === 'edit') {
        this.onEditClicked(data);
      } else if (action === 'delete') {
        this.onDeleteClicked(data);
      } else if (action === 'print') {
        this.onPrintClicked(data);
      } else if (action === 'sell') {
        this.onSellInventory(data);
      }
    });

    // this.angularGrid.dataView.

  }

  applyRowStyles() {
    const unsoldRows = this.dataset
      .filter((row) => !row.isSold)
      .reduce((acc, row) => {
        acc[row.id] = { id: 'highlight-unsold' }; // Map ID to CSS class
        return acc;
      }, {});

    this.angularGrid.slickGrid.setCellCssStyles('unsoldRows', unsoldRows);
  }


  actionButtonsFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
    return `
      <i class="feather icon-edit m-r-10" data-action="edit" data-row="${row}" style="color: blue; cursor: pointer"></i>
      <i class="feather icon-trash-2 m-r-10" data-action="delete" data-row="${row}" style="color: red; cursor: pointer"></i>
      <i class="bi bi-printer m-r-10" data-action="print" data-row="${row}" style="color: darkorange; cursor: pointer"></i>
      <i class="bi bi-cart" data-action="sell" data-row="${row}" style="color: green; cursor: pointer"></i>
    `;
  }

  updateGridData(): void {
    if (this.angularGrid?.dataView) {
      // Debug log
      this.angularGrid.dataView.setItems(this.dataset, 'id'); // Use a unique ID field
      this.angularGrid.dataView.refresh(); // Refresh the DataView
      this.angularGrid.slickGrid.invalidate(); // Invalidate and refresh all rows
      this.angularGrid.slickGrid.render(); // Re-render the grid
    }

    if (this.angularGrid?.paginationService) {
      if (this.dataset.length > 10) {
        this.angularGrid.paginationService?.togglePaginationVisibility(true);
      } else {
        this.angularGrid.paginationService?.togglePaginationVisibility(false);
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  updatePagination(): void {
    if (this.angularGrid?.paginationService) {
      this.angularGrid.paginationService.paginationOptions = {
        pageSize: this.gridOptions.pagination?.pageSize || 5,
        totalItems: this.dataset.length || 0, // Update total items
        pageSizes: this.gridOptions.pagination?.pageSizes || [5, 10, 15, 20, 25], // Update page sizes
      };
    }
  }

  customDateFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
    const date = new Date(value);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
    };

    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }

    return date.toLocaleString('en-US', options);
  }

  customDateFormatterForGrouping(value: any): string {
    const date = new Date(value);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }

    return date.toLocaleString('en-US', options);
  }


  columnDefinitions = [
    {
      id: 'productCode', name: 'Product Code', field: 'productCode', filterable: true, sortable: true, minWidth: 100, width: 100,
    },
    {
      id: 'product', name: 'Product', field: 'product', filterable: true, sortable: true, minWidth: 80, width: 80,
      grouping: {
        getter: 'product',
        formatter: (g: any) => `Product: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'supplierName', name: 'Supplier Name', field: 'supplierName', filterable: true, sortable: true, minWidth: 65, width: 120,
      grouping: {
        getter: 'supplierName',
        formatter: (g: any) => `Supplier: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'design', name: 'Design', field: 'design', filterable: true, sortable: true, minWidth: 60, width: 60,
      grouping: {
        getter: 'design',
        formatter: (g: any) => `Design: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'qualityType', name: 'Quality', field: 'qualityType', filterable: true, sortable: true, minWidth: 75, width: 75,
      grouping: {
        getter: 'qualityType',
        formatter: (g: any) => `Quality: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'shape', name: 'Shape', field: 'shape', filterable: true, sortable: true, minWidth: 60, width: 60,
      grouping: {
        getter: 'shape',
        formatter: (g: any) => `Shape: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'stonesNb', name: 'No Of Stones', field: 'stonesNb', filterable: true, sortable: true, minWidth: 60, width: 60,
      grouping: {
        getter: 'stonesNb',
        formatter: (g: any) => `No Of Stones: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'inStock', name: 'In Stock', field: 'inStock', filterable: true, sortable: true, maxWidth: 50, width: 50,
      grouping: {
        getter: 'inStock',
        formatter: (g: any) => `In Stock: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      },
      formatter: Formatters['checkmarkMaterial']
    },
    { id: 'createdOn', name: 'Date', field: 'createdOn', filterable: true, sortable: true, minWidth: 60, width: 60, formatter: this.customDateFormatter },
    {
      id: 'actions', name: 'Actions', field: 'actions', minWidth: 125, maxWidth: 125,
      formatter: this.actionButtonsFormatter.bind(this)
    }
  ];

  gridOptions: GridOption = {
    enableAutoResize: true,
    autoResize: {
      container: '#inventory-list-container',
      resizeDetection: 'container',  // the 2 options would be 'container' | 'window'
      calculateAvailableSizeBy: 'container'
    },
    formatterOptions: {
      displayNegativeNumberWithParentheses: true,
      thousandSeparator: ',',

    },
    draggableGrouping: {
      dropPlaceHolderText: 'Drop a column header here to group inventory data by any of these column - Supplier Name, Quality, Product, Shape, Design, No Of Stones, In Stock',
      deleteIconCssClass: 'mdi mdi-close',
      onGroupChanged: (e, args) => {
        console.log(args)
        this.onGroupsChanged(args);
      }
    },
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableCellNavigation: true,
    enableFiltering: true,
    cellHighlightCssClass: 'changed',
    autoHeight: true,
    enablePagination: true,
    pagination: {
      pageSizes: [10, 15, 20, 25],
      pageSize: 10,
    },
    rowHeight: 40,
    enableCheckboxSelector: true,
    enableRowSelection: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
    },

    multiSelect: true,
    multiColumnSort: true,
    checkboxSelector: {
      applySelectOnAllPages: true,
    },


  };

  onGroupsChanged(args: any) {

    if (args.groupColumns.length > 0) {
      this.angularGrid.paginationService?.togglePaginationVisibility(false);
    } else {
      if (this.dataset.length > 10) {
        this.angularGrid.paginationService?.togglePaginationVisibility(true);
      } else {
        this.angularGrid.paginationService?.togglePaginationVisibility(false);
      }
    }
    this.dataset = [...this.dataset]
    console.log(this.angularGrid?.paginationService)
  }

  onSelectedRowsChanged(e: any, args: any) {

    if (Array.isArray(args.rows)) {
      // user clicked on the 1st column, multiple checkbox selection

    }
  }

  protected navigateInventory(id: number = 0): void {
    this.router.navigate(['inventory', id]);
  }

  printAll() {
    // if (this.agGrid && this.agGrid.api) {
    //   const selectedRows = this.agGrid.api.getSelectedRows(); // Get selected rows
    //   
    //   const idsArray: number[] = []
    //   selectedRows.forEach((row) => {
    //     if(row.id) idsArray.push(row.id);
    //   })

    //   this.printInventoryBarcode(idsArray);

    //   this.agGrid.api.deselectAll();
    // } else {
    //   console.error("Grid API is not available yet.");
    // }

    // const selectedRowIndexes = this.angularGrid.slickGrid.getSelectedRows(); // Indexes of selected rows
    // // sort selected row indexes in ascending order
    // const selectedRowData = selectedRowIndexes.map((index) =>
    //   this.angularGrid.dataView.getItem(index)
    // );

    // const idsArray: number[] = []
    // selectedRowData.forEach((row) => {
    //   if(row.id) idsArray.push(row.id);
    // })

    // 
    this.printInventoryBarcode(this.selectedRowIds);



    // this.angularGrid.slickGrid.setSelectedRows([]); // Deselect all rows
    this.angularGrid.dataView.setSelectedIds([]); // Deselect all rows
    this.selectedRowIds = [];
    this.changeDetectorRef.detectChanges();



  }

  printHTML(htmlContent: string) {
    printJS({

      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
    // 
  }

  printInventoryBarcode(productIds: number[]) {

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

  onEditClicked(e: any) {
    this.router.navigate(['inventory', e.id]);
  }

  onDeleteClicked(e: any) {
    this.openDeleteConfirmationModal(e);
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
          if (result) {

            if (result.value) {
              this.service.deleteInventoryByGuid(item);
              this.store.resetInventoryStore().pipe(
                concatMap(() => this.service.getAll())
              ).subscribe();
            } else {
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

  onPrintClicked(e: any) {
    const idsArray: number[] = []
    idsArray.push(e.id);
    this.printInventoryBarcode(idsArray);

  }

  onSellInventory(e: any) {
    const productIds = [e.id];
    let product = this.dataset.find((item) => item.id === e.id);
    if (product.isSold) {
      this.messageService.error("This inventory is already sold.");
      return;
    }
    this.openSaleTypeConfirmationModal(productIds);
  }

  onSellAllSelectedInventories() {
    const productIds = this.selectedRowIds;
    const soldItems = this.dataset.filter(item => productIds.includes(item.id) && item.isSold);
    if (soldItems.length > 0) {
      this.messageService.error("Some of the selected inventories are already sold.");
      return;
    }
    this.openSaleTypeConfirmationModal(productIds);
  }

  openSaleTypeConfirmationModal(productIds: number[]) {
    const initialState = {};

    const modalRef = this.modalService.show(ModalSaleTypeConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: any) => {
          if (result) {

            this.router.navigate(['sale', result.value, 0, "New-Order", productIds.join(",")]);
          }
        }
      )
    ).subscribe()
  }

  selectedRowIds: number[] = [];

  gridStateChanged(params: any) {
    const gridStateChanges: GridStateChange = params.detail;

    // 

    if (gridStateChanges?.change?.type === "pagination") {


      // 
      const itemsPerPage = this.angularGrid.paginationService?.getCurrentItemPerPage();
      const currentPage = this.angularGrid.paginationService?.getCurrentPageNumber();
      const selectedRowIndex: (number)[] = [];
      this.selectedRowIds.forEach((id) => {
        let idx = this.angularGrid.dataView.getIdxById(id);
        if (currentPage && itemsPerPage && idx != undefined) {
          let start = (currentPage - 1) * itemsPerPage;
          let end = start + itemsPerPage;

          if (idx >= start && idx < end) {
            if (currentPage > 1) {
              selectedRowIndex.push(idx % (itemsPerPage * (currentPage - 1)));
            } else if (currentPage === 1 && idx < itemsPerPage) {
              selectedRowIndex.push(idx);
            }
          }
        }


        // 
        // if (idx != undefined) selectedRowIndex.push(idx);
      })

      this.angularGrid.slickGrid.setSelectedRows(selectedRowIndex);
    } else if (gridStateChanges?.change?.type === 'rowSelection') {
      this.selectedRowIds = (gridStateChanges?.gridState?.rowSelection?.dataContextIds || []) as number[];
      this.selectedRowIds = this.selectedRowIds.sort((a, b) => a - b); // sort by ID
      this.changeDetectorRef.detectChanges();
    }
  }

  hoveredDate: NgbDate | null = null;
  fromDate1: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 10);
  toDate1: NgbDate | null = this.calendar.getToday();
  limitDate: NgbDate | null = this.calendar.getToday();

  get fromDate() {
    return this.dateFilterForm.get('fromDate') as FormControl
  }

  get toDate() {
    return this.dateFilterForm.get('toDate') as FormControl
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate1 = date;
    } else if (this.fromDate1 && !this.toDate1 && date && (date.after(this.fromDate1) || date.equals(this.fromDate1))) {
      this.toDate1 = date;
    } else {
      this.toDate1 = null;
      this.fromDate1 = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate1) && date.before(this.hoveredDate)
    );
  }

  formatDate(date: NgbDate | null): string | null {
    if (!date) return null;
    const year = date.year; // Full year
    const month = date.month; // Month without leading zero
    const day = date.day; // Day without leading zero
  
    return `${month}/${day}/${year}`;
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate1) && date.before(this.toDate1);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate1) ||
      (this.toDate && date.equals(this.toDate1)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  downloadExcel() {
    if(this.dateFilterForm.invalid) return;

    const startDate = String(this.formatDate(this.fromDate1))
    const endDate = String(this.formatDate(this.toDate1))

    const formattedData = this.dataset.map((item: any) => {
      const itemDate = new Date(item.createdOn);
      const formattedDate = itemDate.toLocaleDateString('en-US');
      return { ...item, createdOn: formattedDate };
    });

    const filteredData = formattedData
      .filter(item => {
        const itemDate = new Date(item.createdOn);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      })
      .map((item, index) => {
        return {
          srNo: index+1,
          supplierName: item.supplierName,
          size: item.size,
          qualityType: item.qualityType,
          product: item.product,
          productCode: item.productCode,
          shape: item.shape,
          primaryStone: item.primaryStone,
          design: item.design,
          primaryColor: item.primaryColor,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
          noOfStones: item.stonesNb,
          Date: item.createdOn
        };
      });

    console.log(filteredData, ' filtered')
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'inventory-data.xlsx');
  }
}
