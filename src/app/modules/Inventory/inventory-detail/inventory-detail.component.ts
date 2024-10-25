import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import {
  ModalConfirmComponent,
  ModalType,
} from "src/app/shared/components/modal-confirm/modal-confirm.component";
import { Artisan } from "src/app/shared/store/artisan/artisan.model";
import { ArtisanService } from "src/app/shared/store/artisan/artisan.service";
import { ArtisanStoreService } from "src/app/shared/store/artisan/artisan.store";
import { ColorService } from "src/app/shared/store/color/color.service";
import { ColorStoreService } from "src/app/shared/store/color/color.store";
import { DesignService } from "src/app/shared/store/design/design.service";
import { DesignStoreService } from "src/app/shared/store/design/design.store";
import {
  CheckInventoryModel,
  createCheckInventoryModel,
  createInventoryModel,
  inventoryForm,
  InventoryModel,
} from "src/app/shared/store/inventory/inventory.model";
import { InventoryService } from "src/app/shared/store/inventory/inventory.service";
import { InventoryStoreService } from "src/app/shared/store/inventory/inventory.store";
import { PrimaryColorService } from "src/app/shared/store/primary-color/primary-color.service";
import { PrimaryColorStoreService } from "src/app/shared/store/primary-color/primary-color.store";
import { ProductService } from "src/app/shared/store/product/product.service";
import { ProductStoreService } from "src/app/shared/store/product/product.store";
import { QualityService } from "src/app/shared/store/quality/quality.service";
import { QualityStoreService } from "src/app/shared/store/quality/quality.store";
import { ShapeService } from "src/app/shared/store/shape/shape.service";
import { ShapeStoreService } from "src/app/shared/store/shape/shape.store";
import { SizeService } from "src/app/shared/store/size/size.service";
import { SizeStoreService } from "src/app/shared/store/size/size.store";
import { UserModel } from "src/app/shared/store/user/user.model";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";

@Component({
  selector: "app-inventory-detail",
  templateUrl: "./inventory-detail.component.html",
  styleUrls: ["./inventory-detail.component.scss"],
})
export default class InventoryDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  qualityList$: Observable<string[]> = this.qualityStoreService
    .selectAll()
    .pipe(map((qualities) => qualities.map((t) => t.name)));

  qualityList = this.qualityList$.forEach((value) => value);

  designList$: Observable<string[]> = this.designStoreService
    .selectAll()
    .pipe(map((designs) => designs.map((t) => t.name)));

  colorList$: Observable<string[]> = this.colorStoreService
    .selectAll()
    .pipe(map((color) => color.map((t) => t.name)));

  sizeList$: Observable<string[]> = this.sizeStoreService
    .selectAll()
    .pipe(map((sizes) => sizes.map((t) => t.name)));

  shapeList$: Observable<string[]> = this.shapeStoreService
    .selectAll()
    .pipe(map((shape) => shape.map((t) => t.name)));

  productNameList$: Observable<string[]> = this.productStoreService
    .selectAll()
    .pipe(map((product) => product.map((t) => t.name)));
  productCodeList$: Observable<string[]> = this.productStoreService
    .selectAll()
    .pipe(map((product) => product.map((t) => t.name)));

  primaryColorList$: Observable<string[]> = this.primaryColorStoreService
    .selectAll()
    .pipe(map((product) => product.map((t) => t.name)));
  // getting suppliers list by sending supplier id
  // sort suppliers by name
  supplierUserList$: Observable<UserModel[]> = this.userStoreService
    .selectByRoleId(5000)
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );

  artisanList$: Observable<Artisan[]> = this.artisanStoreService.selectAll();

  artisanNameList$: Observable<string[]> = this.artisanList$.pipe(
    map((artisans) => artisans.map((t) => t.name))
  );

  inventoryForm: FormGroup<inventoryForm> = this.formBuilder.nonNullable.group({
    // masterId: [0],
    // id: [0],
    // quality: ['', [Validators.required, Validators.min(1)]],
    // design: ['', [Validators.required, Validators.min(1)]],
    // quantity: [1, [Validators.required, Validators.min(1)]],
    // color: ['', Validators.required],
    // size: ['', Validators.required],
    // file: [''],
    // name: [''],
    // supplierId: [0]

    masterId: [0],
    id: [0],
    size: ["", Validators.required],
    productType: ["", Validators.required],
    productName: ["", Validators.required],
    productCode: ["", Validators.required],
    shape: ["", Validators.required],
    primaryStone: ["", Validators.required],
    design: ["", Validators.required],
    primaryColor: ["", Validators.required],
    noOfStone: ["", Validators.required],
    // rate: [0],
    // sadekaar: [0],
    // designAmt: [0],
    artisanName: ["", Validators.required],
    artisanId: [0],
    cp: ["", Validators.required],
    sp: ["", Validators.required],
    pc: [""],
    userCode: [""],
    // qty: [1, Validators.required]
  }) as any;

  // variables to hide Rate, sadekaar and designAmt
  rateField = false;
  sadekaarField = false;
  designAmtField = false;

  get masterId() {
    return this.inventoryForm.get("masterId") as FormControl;
  }

  get id() {
    return this.inventoryForm.get("id") as FormControl;
  }

  get size() {
    return this.inventoryForm.get("size") as FormControl;
  }

  get productType() {
    return this.inventoryForm.get("productType") as FormControl;
  }

  get productName() {
    return this.inventoryForm.get("productName") as FormControl;
  }

  get productCode() {
    return this.inventoryForm.get("productCode") as FormControl;
  }
  get shape() {
    return this.inventoryForm.get("shape") as FormControl;
  }

  get primaryStone() {
    return this.inventoryForm.get("primaryStone") as FormControl;
  }

  get design() {
    return this.inventoryForm.get("design") as FormControl;
  }

  get primaryColor() {
    return this.inventoryForm.get("primaryColor") as FormControl;
  }

  get noOfStone() {
    return this.inventoryForm.get("noOfStone") as FormControl;
  }

  get userCode() {
    return this.inventoryForm.get("userCode") as FormControl;
  }

  get pc() {
    return this.inventoryForm.get("pc") as FormControl;
  }

  // get rate(){
  //   return this.inventoryForm.get('rate') as FormControl;
  // }

  // get sadekaar(){
  //   return this.inventoryForm.get('sadekaar') as FormControl;
  // }

  // get designAmt(){
  //   return this.inventoryForm.get('designAmt') as FormControl;
  // }

  get artisanName() {
    return this.inventoryForm.get("artisanName") as FormControl;
  }

  get artisanId() {
    return this.inventoryForm.get("artisanId") as FormControl;
  }

  get cp() {
    return this.inventoryForm.get("cp") as FormControl;
  }

  get sp() {
    return this.inventoryForm.get("sp") as FormControl;
  }

  // get qty(){
  //   return this.inventoryForm.get('qty') as FormControl;
  // }

  // get quality() {
  //   return this.inventoryForm.get('quality') as FormControl;
  // }

  // get design() {
  //   return this.inventoryForm.get('design') as FormControl;
  // }

  // get quantity() {
  //   return this.inventoryForm.get('quantity') as FormControl;
  // }
  // get color() {
  //   return this.inventoryForm.get('color') as FormControl;
  // }

  // get size() {
  //   return this.inventoryForm.get('size') as FormControl;
  // }

  // get file() {
  //   return this.inventoryForm.get('file') as FormControl;
  // }

  // get name() {
  //   return this.inventoryForm.get('name') as FormControl;
  // }

  // get supplierId() {
  //   return this.inventoryForm.get('supplierId') as FormControl;
  // }

  generateCode() {
    // Fetch the values from the form controls
    const supplierCode = this.inventoryForm.get("supplierCode")?.value || "SC";
    const pc = this.inventoryForm.get("pc")?.value || "";
    const primaryColor = this.inventoryForm.get("primaryColor")?.value || "";

    // Subscribe to supplierUserList$ to get the supplier data
    this.artisanList$.subscribe(
      (data) => {
        console.log(data);
        // Filter the supplier data to find supplier with id == 4 (replace 4 with the correct supplier ID if needed)
        const artisan = data?.find(
          (artisan) => artisan.name == this.artisanName.value
        ); // Update artisan ID accordingly
        console.log(artisan);
        if (artisan) {
          // Log artisan details (for debugging purposes)
          console.log(artisan);
          const artisanCode = artisan.name.substring(0, 2);

          // Example code generation logic
          const generatedCode = `A&L-${artisanCode.substring(
            0,
            3
          )}${primaryColor.substring(0, 1)}${pc.substring(
            0,
            4
          )}001`.toUpperCase();

          // Set the generated code into the productCode form control
          this.inventoryForm.get("productCode")?.setValue(generatedCode);
        } else {
          console.error("artisan with ID 4 not found");
        }
      },
      (error) => {
        // Handle any errors that occur
        console.error("Error while fetching artisan data:", error);
      },
      () => {
        // Handle the completion of the Observable
        console.log("Observable completed");
      }
    );
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
    private shapeService: ShapeService,
    private productService: ProductService,
    private shapeStoreService: ShapeStoreService,
    private productStoreService: ProductStoreService,
    private primaryColorService: PrimaryColorService,
    private primaryColorStoreService: PrimaryColorStoreService,
    private artisanService: ArtisanService,
    private artisanStoreService: ArtisanStoreService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private modalService: BsModalService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    console.log("NgOnInt");
    // get inventory
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.inventoryService.getAll(),
        this.qualityService.getAll(),
        this.colorService.getAll(),
        // this.sizeService.getAll(),
        this.shapeService.getAll(),
        this.designService.getAll(),
        this.productService.getAll(),
        this.primaryColorService.getAll(),
        this.artisanService.getAll(),
        this.userService.getAll(),
        // this.shapeService
      ])
        .pipe(
          tap(
            ([
              params,
              inventoryData,
              qualityData,
              colorData,
              shapeData,
              designData,
              productData,
              primaryColorData,
              artisanData,
              userData,
            ]) => {
              if (params["id"] != 0) {
                const inventoryId = Number(params["id"]);
                const inventory =
                  this.store.getById(inventoryId) ?? createInventoryModel({});

                console.log(inventory);

                this.inventoryForm.setValue({
                  masterId: inventory.masterId ? inventory.masterId : 0,
                  id: inventory.id,
                  size: inventory.size,
                  productType: inventory.qualityTypeName,
                  productName: inventory.productName,
                  productCode: inventory.productCode,
                  pc: "", // Set PC later when recieved from backend
                  shape: inventory.shapeName,
                  primaryStone: inventory.primaryStoneName,
                  design: inventory.designName,
                  primaryColor: inventory.primaryColorName,
                  noOfStone: inventory.stonesNb,
                  // rate: inventory.rate,
                  // sadekaar: inventory.sadekaar,
                  // designAmt: inventory.designAmt,
                  artisanName: inventory.artisianName,
                  artisanId:
                    inventory.artisanId != null ? inventory.artisanId : 0,
                  cp: 0,
                  sp: inventory.sellingPrice,

                  // qty: inventory.quantity
                  userCode: "",
                });
              }
            }
          )
        )
        .subscribe()
    );
  }

  // submit button click
  protected uppertInventory(): void {
    const inventory = createInventoryModel({
      // id: this.id.value,
      // qualityId: this.quality.value,
      // designId: this.design.value,
      // quantity: this.quantity.value,
      // colorCode: this.color.value,
      // size: this.size.value,
      // file: this.file.value,
      // supplierId: this.supplierId.value

      id: this.id.value,
      artisianName: this.artisanName.value,
      size: this.size.value,
      qualityTypeName: this.productType.value,
      productName: this.productName.value,
      productCode: this.productCode.value,
      shapeName: this.shape.value,
      primaryStoneName: this.primaryStone.value,
      designName: this.design.value,
      primaryColorName: this.primaryColor.value,
      stoneNb: this.noOfStone.value,
      sellingPrice: this.sp.value,
      // rate: this.rate.value,
      // sadekaar: this.sadekaar.value,
      // designAmt: this.designAmt.value,
      // costPrice: this.cp.value,
      // quantity: this.qty.value
    });

    const checkInventory = createCheckInventoryModel({
      // quality: this.quality.value,
      design: this.design.value,
      // colorCode: this.color.value,
      size: this.size.value,
      // supplierId: this.supplierId.value
    });

    // if (this.inventoryForm.valid || this.inventoryForm.disabled) {
    //   const checkInventory$ = this.inventoryService.checkInventory(checkInventory);
    //   this.subscriptions.push(
    //     combineLatest([checkInventory$]).subscribe(([inventoryExists]) => {
    //       if (inventoryExists && inventoryExists.totalQuantity > 0 && inventoryExists.firstMatchingId != inventory.id) {
    //         // view model
    //         this.openUpdateConfirmationModal(inventory, inventoryExists)
    //       } else {
    //         // Inventory does not exist, proceed with upsert
    //         this.subscriptions.push(
    //           this.inventoryService.upsertInventory(inventory).pipe(
    //             tap(() => {
    //               this.inventoryForm.markAsPristine(),
    //               this.navigate();
    //             })
    //           ).subscribe()
    //         );
    //       }
    //     }))
    // }

    console.log(inventory);

    if (this.inventoryForm.valid || this.inventoryForm.disabled) {
      this.subscriptions.push(
        this.inventoryService
          .upsertInventory(inventory)
          .pipe(
            tap(() => {
              this.inventoryService.getAll();
              this.inventoryForm.markAsPristine();
              this.navigate();
            })
          )
          .subscribe()
      );
    }
  }

  protected openUpdateConfirmationModal(
    item: InventoryModel,
    existedItem: CheckInventoryModel
  ) {
    const initialState = {
      item,
      message: `Update Inventory, ${existedItem.totalQuantity} Inventory Already Exists`,
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
            if (this.inventoryForm.valid || this.inventoryForm.disabled) {
              // set Inventory Id
              item.id = existedItem.firstMatchingId;
              // it will increase the inventory to existing
              item.isNormalUpdate = false;
              this.subscriptions.push(
                this.inventoryService
                  .upsertInventory(item)
                  .pipe(
                    tap(() => {
                      this.inventoryForm.markAsPristine(), this.navigate();
                    })
                  )
                  .subscribe()
              );
            }
          }
        })
      )
      .subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  // navigate to list page
  navigate() {
    this._router.navigate(["/inventory"]);
  }

  protected cancel(): void {
    //  cancel the
  }

  // get the image file
  onFileSelected(event: Event) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.files?.length
    ) {
      // this.file.setValue(event.target.files[0]);
    }
  }

  searchQuality = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.qualityList$))
    );
  };

  searchDesign = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.designList$))
    );
  };

  searchColour = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.colorList$))
    );
  };

  searchSize = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.sizeList$))
    );
  };

  searchShape = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.shapeList$))
    );
  };

  searchProductName = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.productNameList$))
    );
  };
  searchProductCode = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.productCodeList$))
    );
  };

  searchPrimaryColor = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.primaryColorList$))
    );
  };

  private filterAllList(
    term: string,
    list: Observable<string[]>
  ): Observable<string[]> {
    if (term === "") {
      return of([]);
    }

    const filtered = list.pipe(
      switchMap((list) =>
        of(
          list
            .filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase()))
            .splice(0, 10)
        )
      )
    );

    return filtered;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
