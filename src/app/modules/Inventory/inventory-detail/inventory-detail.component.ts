import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, combineLatest, map, of, tap } from 'rxjs';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ColorService } from 'src/app/shared/store/color/color.service';
import { ColorStoreService } from 'src/app/shared/store/color/color.store';
import { Design } from 'src/app/shared/store/design/design.model';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { inventoryForm, createInventoryModel, createCheckInventoryModel, InventoryModel, CheckInventoryModel } from 'src/app/shared/store/inventory/inventory.model';
import { InventoryService } from 'src/app/shared/store/inventory/inventory.service';
import { InventoryStoreService } from 'src/app/shared/store/inventory/inventory.store';
import { Quality } from 'src/app/shared/store/quality/quality.model';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { SizeService } from 'src/app/shared/store/size/size.service';
import { SizeStoreService } from 'src/app/shared/store/size/size.store';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export default class InventoryDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  // sort qualities by name
  qualityList$: Observable<Quality[]> = this.qualityStoreService.selectAll().pipe(
    map(qualities => qualities.sort((a, b) => a.name.localeCompare(b.name)))
  );
  // sort design by name
  designList$: Observable<Design[]> = this.designStoreService.selectAll().pipe(
    map(qualities => qualities.sort((a, b) => a.name.localeCompare(b.name)))
  );
  colorList$: Observable<string[]> = this.colorStoreService.selectAll().pipe(
    map((color) => color.map((t) => t.name))
  );
  sizeList$: Observable<string[]> = this.sizeStoreService.selectAll().pipe(
    map((sizes) => sizes.map((t) => t.name))
  );
  // getting suppliers list by sending supplier id 
  // sort suppliers by name
  supplierUserList$: Observable<UserModel[]> = this.userStoreService.selectByRoleId(5000).pipe(
    map(qualities => qualities.sort((a, b) => a.name.localeCompare(b.name)))
  );

  inventoryForm: FormGroup<inventoryForm> = this.formBuilder.nonNullable.group({
    masterId: [0],
    id: [0],
    quality: [0, [Validators.required, Validators.min(1)]],
    design: [0, [Validators.required, Validators.min(1)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    color: ['', Validators.required],
    size: ['', Validators.required],
    file: [''],
    name: [''],
    supplierId: [0]
  }) as any;

  get masterId() {
    return this.inventoryForm.get('masterId') as FormControl;
  }

  get id() {
    return this.inventoryForm.get('id') as FormControl;
  }

  get quality() {
    return this.inventoryForm.get('quality') as FormControl;
  }

  get design() {
    return this.inventoryForm.get('design') as FormControl;
  }

  get quantity() {
    return this.inventoryForm.get('quantity') as FormControl;
  }
  get color() {
    return this.inventoryForm.get('color') as FormControl;
  }

  get size() {
    return this.inventoryForm.get('size') as FormControl;
  }

  get file() {
    return this.inventoryForm.get('file') as FormControl;
  }

  get name() {
    return this.inventoryForm.get('name') as FormControl;
  }

  get supplierId() {
    return this.inventoryForm.get('supplierId') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: InventoryStoreService,
    private inventoryService: InventoryService,
    private qualityService: QualityService,
    private qualityStoreService: QualityStoreService,
    private designService: DesignService,
    private designStoreService: DesignStoreService,
    private colorService: ColorService,
    private colorStoreService: ColorStoreService,
    private sizeService: SizeService,
    private sizeStoreService: SizeStoreService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private modalService: BsModalService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // get inventory
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.inventoryService.getAll(),
        this.qualityService.getAll(),
        this.colorService.getAll(),
        this.sizeService.getAll(),
        this.designService.getAll(),
        this.userService.getAll()
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != 0) {
            const inventoryId = Number(params['id']);
            const inventory = this.store.getById(inventoryId) ?? createInventoryModel({})
            this.inventoryForm.setValue({
              masterId: inventory.masterId? inventory.masterId: 0,
              id: inventory.id,
              quality: inventory.qualityId,
              design: inventory.designId,
              color: inventory.colorCode,
              size: inventory.size,
              quantity: inventory.quantity,
              supplierId: inventory.supplierId != null? inventory.supplierId: 0,
              file: new File([],''),
              name: '',
            })
          }
        })
      ).subscribe()
    );

  }

  // submit button click
  protected uppertInventory(): void {
    const inventory = createInventoryModel({
      id: this.id.value,
      qualityId: this.quality.value,
      designId: this.design.value,
      quantity: this.quantity.value,
      colorCode: this.color.value,
      size: this.size.value,
      file: this.file.value,
      supplierId: this.supplierId.value
    });

    const checkInventory = createCheckInventoryModel({
      quality: this.quality.value,
      design: this.design.value,
      colorCode: this.color.value,
      size: this.size.value,
      supplierId: this.supplierId.value
    })

    if (this.inventoryForm.valid || this.inventoryForm.disabled) {
      const checkInventory$ = this.inventoryService.checkInventory(checkInventory);
      this.subscriptions.push(
        combineLatest([checkInventory$]).subscribe(([inventoryExists]) => {
          if (inventoryExists && inventoryExists.totalQuantity > 0 && inventoryExists.firstMatchingId != inventory.id) {
            // view model
            this.openUpdateConfirmationModal(inventory, inventoryExists)
          } else {
            // Inventory does not exist, proceed with upsert
            this.subscriptions.push(
              this.inventoryService.upsertInventory(inventory).pipe(
                tap(() => {
                  this.inventoryForm.markAsPristine(),
                  this.navigate();
                })
              ).subscribe()
            );
          }
        }))
    }
  }

  protected openUpdateConfirmationModal(item: InventoryModel, existedItem: CheckInventoryModel) {
    const initialState = {
      item,
      message: `Update Inventory, ${existedItem.totalQuantity} Inventory Already Exists`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            if (this.inventoryForm.valid || this.inventoryForm.disabled) {
              // set Inventory Id
              item.id = existedItem.firstMatchingId;
              // it will increase the inventory to existing
              item.isNormalUpdate = false;
              this.subscriptions.push(
                this.inventoryService.upsertInventory(item).pipe(
                  tap(() => {
                    this.inventoryForm.markAsPristine(),
                    this.navigate();
                  })
                ).subscribe()
              );
            }
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  // navigate to list page
  navigate(){
    this._router.navigate(['/inventory']);
  }

  protected cancel(): void {
    //  cancel the
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // get the image file
  onFileSelected(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files?.length){
      this.file.setValue(event.target.files[0]);
    }  
  }
}
