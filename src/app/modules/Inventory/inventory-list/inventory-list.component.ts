import { Component, ViewChild } from '@angular/core';
import { combineLatest, map, Observable, of, startWith, Subscription, tap } from 'rxjs';
import { InventoryModel } from 'src/app/shared/store/inventory/inventory.model';
import MessageDialogBoxComponent from '../../components/message-dialog-box/message-dialog-box.component';
import { Router } from '@angular/router';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
import { InventoryService } from 'src/app/shared/store/inventory/inventory.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImageService } from 'src/app/core/service/Image.service';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { Quality } from 'src/app/shared/store/quality/quality.model';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { FormControl } from '@angular/forms';
import { Design } from 'src/app/shared/store/design/design.model';
import { AgCustomButtonComponent } from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { environment } from 'src/environments/environment';

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
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 60 },
    { field: "qualityName", filter: true, floatingFilter: true },
    { field: "designName", filter: true, floatingFilter: true },
    { field: "colorCode", filter: true, floatingFilter: true},
    { field: "size", filter: true, floatingFilter: true, maxWidth: 110},
    { field: "quantity", filter: true, floatingFilter: true, maxWidth: 110},
    { field: "supplierName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A"},
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ['edit', 'delete', 'image'],
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        onImageClick: this.onImageClicked.bind(this),
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

  onEditClicked(e: any) {
    this.router.navigate(['inventory', e.rowData.id]);
  }

  onDeleteClicked(e: any) {
    this.openDeleteConfirmationModal(e.rowData);
  }

  onImageClicked(e: any) {
    if(e.rowData.fileKey != null){
      window.open(this.imageService.getGeneratedURL(e.rowData.fileKey), "_blank");
    }
    else{
      this.messageService.error("No Image Found");
    }
    
  }

  // pagination config
  pagingConfig: Pagination = createPagination({});

  // inventorys List
  inventoryList$: Observable<InventoryModel[]> = of([]);
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

  ngOnInit() {
    this.subscriptions.push(
      this.service.getAll().subscribe(),
      this.qualityService.getAll().subscribe(),
      this.designService.getAll().subscribe(),
      this.userSerive.getAll().subscribe()
    )

    this.inventoryList$ = combineLatest([
      this.store.selectAll(),
      this.designStoreService.selectAll(),
      this.qualityStoreService.selectAll(),
      this.userStoreService.selectAll(),
      this.designSearchId.valueChanges.pipe(
        startWith(this.designSearchId.value)
      ),
      this.qualitySearchId.valueChanges.pipe(
        startWith(this.qualitySearchId.value)
      )
    ]).pipe(
      map(([inventories,designs, qualities, users, designSearchId, qualitySearchId]) => {
        return inventories.map(inventory => {
          const design = designs.find(design => design.id == inventory.designId);
          const quality = qualities.find(quality => quality.id == inventory.qualityId);
          const user = users.find(user => user.id == inventory.supplierId);

          if(design){
            inventory.designName = design.name;
          }
          if(quality){
            inventory.qualityName = quality.name;
          }
          if(user){
            inventory.supplierName = user.name;
          }
          return inventory;
        }).sort((a, b) => b.id - a.id); // sort desc by id
      })
    );

  }

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

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.service.deleteInventory(item);
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
