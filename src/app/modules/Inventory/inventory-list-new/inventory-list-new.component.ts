import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularGridInstance, Column, Formatters, GridOption, SlickDataView, SlickGrid} from 'angular-slickgrid';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, map, Observable, of, Subscription } from 'rxjs';
import { ImageService } from 'src/app/core/service/Image.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';
import { Design } from 'src/app/shared/store/design/design.model';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { InventoryService } from 'src/app/shared/store/inventory/inventory.service';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
import { Quality } from 'src/app/shared/store/quality/quality.model';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Component({
  selector: 'app-inventory-list-new',
  templateUrl: './inventory-list-new.component.html',
  styleUrls: ['./inventory-list-new.component.scss']
})
export class InventoryListNewComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  // gridOptions!: GridOption;
  // columnDefinitions: Column[] = [];
  dataset: any[] = [];

  // subscription
  subscriptions: Subscription[] = [];

  // inventories List
  inventoryList$: Observable<any> = of([]);
  qualityList$: Observable<Quality[]> = this.qualityStoreService.selectAll();
  designList$: Observable<Design[]> = this.designStoreService.selectAll();

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
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.store.resetInventoryStore();

    this.subscriptions.push(
      combineLatest([
        this.service.getAll(),
        this.userSerive.getAll()
      ])
      .subscribe(() => {
        // this.prepareGrid();
        this.changeDetectorRef.markForCheck();
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
    this.inventoryList$.subscribe((data) => {
      this.dataset = data;
      this.updateGridData()
      this.changeDetectorRef.markForCheck(); // Trigger change detection
    });
  }

  angularGridReady(angularGrid: AngularGridInstance | any) {
    this.angularGrid = angularGrid.detail;
    console.log(this.angularGrid);
  }

  updateGridData(): void {
    if (this.angularGrid?.dataView) {
      console.log('Dataset:', this.dataset); // Debug log
      this.angularGrid.dataView.setItems(this.dataset, 'id'); // Use a unique ID field
      this.angularGrid.dataView.refresh(); // Refresh the DataView
      this.angularGrid.slickGrid.invalidate(); // Invalidate and refresh all rows
      this.angularGrid.slickGrid.render(); // Re-render the grid
    }
    if(this.dataset.length > 10) {
      this.angularGrid.paginationService?.togglePaginationVisibility(true);
    }
    this.changeDetectorRef.detectChanges();
    // this.updatePagination(); // Update pagination metadata
  } 

  updatePagination(): void {
    if (this.angularGrid?.paginationService) {
      this.angularGrid.paginationService.paginationOptions = {
        pageSize: this.gridOptions.pagination?.pageSize || 5,
        totalItems: this.dataset.length || 0, // Update total items
      };
    }
  }

  customDateFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any): string {
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
    { id: 'createdOn', name: 'Date', field: 'createdOn', filterable: true, sortable: true, minWidth: 80, width: 80, formatter: this.customDateFormatter },
    { id: 'supplierName', name: 'Supplier Name', field: 'supplierName', filterable: true, sortable: true, minWidth: 65, width: 65,
      grouping: {
        getter: 'supplierName',
        formatter: (g: any) => `Supplier: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
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
    { id: 'product', name: 'Product', field: 'product', filterable: true, sortable: true, minWidth: 80, width: 130,
      grouping: {
        getter: 'qualityType',
        formatter: (g: any) => `Quality: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
    {
      id: 'shape', name: 'Shape', field: 'shape', filterable: true, sortable: true, minWidth: 60, width: 60,
      // filter: {
      //   model: Filters.singleSelect,
      //   collection: [{ label: '', value: '' }, { label: 'Buy', value: 'Buy' }, { label: 'Sell', value: 'Sell' }]
      // },
      grouping: {
        getter: 'shape',
        formatter: (g: any) => `sShape: <span style="var(--slick-primary-color); font-weight: bold;">${g.value}</span>  <span style="color: #659bff;">(${g.count} items)</span>`,
        aggregateCollapsed: true,
        collapsed: true
      }
    },
  ];

  gridOptions: GridOption = {
    autoResize: {
      container: '.trading-platform',
      rightPadding: 0,
      bottomPadding: 10,
    },
    formatterOptions: {
      displayNegativeNumberWithParentheses: true,
      thousandSeparator: ','
    },
    draggableGrouping: {
      dropPlaceHolderText: 'Drop a column header here to group inventory data by that column',
      deleteIconCssClass: 'mdi mdi-close',
    },
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    darkMode: false,
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
  };

}
