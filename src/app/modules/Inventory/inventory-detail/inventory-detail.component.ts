import { booleanAttribute, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import printJS from "print-js";
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
  checkbox: boolean = false; 
  

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

  primaryStoneList$: Observable<string[]> = this.colorStoreService
    .selectAll()
    .pipe(map((primaryStone) => primaryStone.map((t) => t.name)));

  sizeList$: Observable<string[]> = this.sizeStoreService
    .selectAll()
    .pipe(map((sizes) => sizes.map((t) => t.name)));

  shapeList$: Observable<string[]> = this.shapeStoreService
    .selectAll()
    .pipe(map((shape) => shape.map((t) => t.name)));

  productList$: Observable<string[]> = this.productStoreService
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

  supplierIdList$: Observable<string[]> = this.artisanList$.pipe(
    map((artisans) => artisans.map((t) => t.name))
  );

  inventoryForm: FormGroup<inventoryForm> = this.formBuilder.nonNullable.group({
   
    id: [0],
    guid:[""],
    size: ["", Validators.required],
    qualityType: ["", Validators.required],
    product: ["", Validators.required],
    productCode: [""],
    shape: ["", Validators.required],
    primaryStone: ["", Validators.required],
    design: ["", Validators.required],
    primaryColor: ["", Validators.required],
    stonesNb: [null],
    supplierId: ["", Validators.required],
    costPrice: [null],
    sellingPrice: ["", Validators.required],
    productNameCode: ["",Validators.required],
    userCode: [""],
    isExempted:[false],
    quantity: [""]
    // qty: [1, Validators.required]
  }) as any;

  // variables to hide Rate, sadekaar and designAmt
  rateField = false;
  sadekaarField = false;
  designAmtField = false;


  get id() {
    return this.inventoryForm.get("id") as FormControl;
  }
  get guid() {
    return this.inventoryForm.get("guid") as FormControl;
  }

  get size() {
    return this.inventoryForm.get("size") as FormControl;
  }
  get isExempted() {
    return this.inventoryForm.get("isExempted") as FormControl;
  }

  get qualityType() {
    return this.inventoryForm.get("qualityType") as FormControl;
  }

  get product() {
    return this.inventoryForm.get("product") as FormControl;
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

  get stonesNb() {
    return this.inventoryForm.get("stonesNb") as FormControl;
  }

  get userCode() {
    return this.inventoryForm.get("userCode") as FormControl;
  }

  get productNameCode() {
    return this.inventoryForm.get("productNameCode") as FormControl;
  }

  

  get supplierId() {
    return this.inventoryForm.get("supplierId") as FormControl;
  }

  get costPrice() {
    return this.inventoryForm.get("costPrice") as FormControl;
  }

  get sellingPrice() {
    return this.inventoryForm.get("sellingPrice") as FormControl;
  }

  // get qty(){
  //   return this.inventoryForm.get('qty') as FormControl;
  // }

  get quantity() {
    return this.inventoryForm.get('quantity') as FormControl;
  }

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

  // generateCode() {
  //   // Fetch the values from the form controls

  //   console.log(this.inventoryForm.value)
  //   const supplierCode = this.inventoryForm.get("supplierCode")?.value || "SC";
  //   const pc = this.inventoryForm.get("pc")?.value || "";
  //   const primaryColor = this.inventoryForm.get("primaryColor")?.value || "";

  //   // Subscribe to supplierUserList$ to get the supplier data
  //   this.artisanList$.subscribe(
  //     (data) => {
  //       console.log(data);
  //       // Filter the supplier data to find supplier with id == 4 (replace 4 with the correct supplier ID if needed)
  //       const artisan = data?.find(
  //         (artisan) => artisan.name == this.supplierId.value
  //       ); // Update artisan ID accordingly
  //       console.log(artisan);
  //       if (artisan) {
  //         // Log artisan details (for debugging purposes)
  //         console.log(artisan);
  //         const artisanCode = artisan.name.substring(0, 2);

  //         // Example code generation logic
  //         const generatedCode = `A&L-${artisanCode.substring(
  //           0,
  //           3
  //         )}${primaryColor.substring(0, 1)}${pc.substring(
  //           0,
  //           4
  //         )}001`.toUpperCase();

  //         // Set the generated code into the productCode form control
  //         this.inventoryForm.get("productCode")?.setValue(generatedCode);
  //       } else {
  //         console.error("artisan with ID 4 not found");
  //       }
  //     },
  //     (error) => {
  //       // Handle any errors that occur
  //       console.error("Error while fetching artisan data:", error);
  //     },
  //     () => {
  //       // Handle the completion of the Observable
  //       console.log("Observable completed");
  //     }
  //   );
  // }

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
                  id: inventory.id,
                  size: inventory.size,
                  qualityType: inventory.qualityType,
                  product: inventory.product,
                  productCode: inventory.productCode,
                  productNameCode: inventory.productNameCode, // Set PC later when recieved from backend
                  shape: inventory.shape,
                  primaryStone: inventory.primaryStone,
                  design: inventory.design,
                  primaryColor: inventory.primaryColor,
                  stonesNb: inventory.stonesNb,
                  supplierId:
                  inventory.supplierId != null ? inventory.supplierId : 0,
                  costPrice: inventory.costPrice,
                  sellingPrice: inventory.sellingPrice,
                  quantity: 1,
                  userCode: "",
                  isExempted:inventory.isExempted || false,
                  guid:""
                  // rate: inventory.rate,
                  // sadekaar: inventory.sadekaar,
                  // designAmt: inventory.designAmt,
                });

                if(inventory.guid){
                  this.inventoryForm.get('guid')?.setValue(inventory.guid)
                }
                let fullProductList$ = this.productStoreService.selectAll()
                fullProductList$.subscribe((productList) => {
                  let product: any = productList.find(product => product.name == inventory.product);
        
                  if(product) {
                    this.inventoryForm.get('productNameCode')?.setValue(product.code)
        
                  }else{
                    this.inventoryForm.get('productNameCode')?.setValue('')
                  }
                })
              }
            }
          )
        )
        .subscribe()
      );
      

      this.inventoryForm.get('product')?.valueChanges.subscribe((res) => {
        let fullProductList$ = this.productStoreService.selectAll()
        fullProductList$.subscribe((productList) => {
          let product: any = productList.find(product => product.name == res);

          if(product) {
            this.inventoryForm.get('productNameCode')?.setValue(product.code)

          }else{
            this.inventoryForm.get('productNameCode')?.setValue('')
          }
        })
      })
      
      // this.inventoryForm.get('product')?.valueChanges.subscribe((res) => {
      //   this.productStoreService.selectAll().subscribe((productList) => {
      //     const product = productList.find(product => product.name === res);
      //     if (product) {
      //       this.inventoryForm.get('productNameCode')?.setValue(product.code);
      //     } else {
      //       this.inventoryForm.get('productNameCode')?.setValue('');
      //     }
      //   });
      // });
    }
    
  


    // protected editAllSimilarGuidData(): void {
    //   const currentGuid = this.guid.value; // Get the current GUID
    
    //   this.inventoryService.getAll().subscribe(inventories => {
    //     const similarItems = inventories.filter(item => item.guid === currentGuid);
    
    //     similarItems.forEach(item => {
    //       // Edit the item as needed
    //       item.quantity = this.quantity.value; // Example of updating quantity
    //       // Call the upsert service for each item
    //       this.inventoryService.upsertInventory(item).subscribe();
    //     });
    
    //     // Optionally navigate or perform additional logic here
    //   });
    // }

    // submit button click
    protected updateInventory(print:boolean = false): void {
      const inventory = createInventoryModel({
        id: this.id.value,
        supplierId: this.supplierId.value,
        size: this.size.value,
        qualityType: this.qualityType.value,
        product: this.product.value,
        productCode: this.productCode.value,
        shape: this.shape.value,
        primaryStone: this.primaryStone.value,
        design: this.design.value,
        primaryColor: this.primaryColor.value,
        stonesNb: this.stonesNb.value,
        sellingPrice: this.sellingPrice.value,
        productNameCode: this.productNameCode.value,
        costPrice: this.costPrice.value,
        guid: this.guid.value,
        quantity: this.quantity.value,
        isExempted: this.isExempted.value
      });
    
    const checkInventory = createCheckInventoryModel({
      
      design: this.design.value,
      size: this.size.value,
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
      if(this.checkbox){
        this.subscriptions.push(
          this.inventoryService
            .upsertInventory(inventory, true)
            .pipe(
              tap((response) => {
                if(print) {
                  let idsArray: number[] = [];
                  response.data.forEach((item: any) => {
                    idsArray.push(item.id);
                  })

                  this.printInventoryBarcode(idsArray);
                }
                this.store.resetInventoryStore();
                this.inventoryService.getAll();
                this.inventoryForm.markAsPristine();
                this.navigate();
              })
            )
            .subscribe()
        );
      }
      else{

        this.subscriptions.push(
          this.inventoryService
            .upsertInventory(inventory, false)
            .pipe(
              tap((response) => {
                if(print) {
                  let idsArray: number[] = [];
                  response.data.forEach((item: any) => {
                    idsArray.push(item.id);
                  })

                  this.printInventoryBarcode(idsArray);
                }
                this.inventoryService.getAll();
                this.inventoryForm.markAsPristine();
                this.navigate();
              })
            )
            .subscribe()
        );
      }
    }
  }
  // protected editSimilarGuidItems(): void {
  //   const currentGuid = this.guid.value; // Get the current GUID

  //   this.inventoryService.getAll().subscribe(inventories => {
  //     const similarItems = inventories.filter(item => item.guid === currentGuid);

  //     similarItems.forEach(item => {
  //       // Example logic to update similar items
  //       item.quantity = this.quantity.value; // Update quantity
  //       // Call the upsert service for each item
  //       this.inventoryService.upsertInventory(item).subscribe(updatedItem => {
  //         console.log(`Updated item: ${updatedItem.id}`); // Log or handle the updated item
  //       });
  //     });
  //   });
  // }

 
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
              // item.isNormalUpdate = false;
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

  // onEditSameGuidChange(): void {
  //   if (this.editSameGuid) {
  //     this.editSimilarGuidItems();
  //   }
  // }

  // get the image file
  onFileSelected(event: Event) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.files?.length
    ) {
      // this.file.setValue(event.target.files[0]);
    }
  }

  // isExemption(event:any){
  //   if(event.target.checked){
  //     this.checkbox = true;
  //   }else{
  //     this.checkbox = false; 
  //   }
  //   console.log(this.checkbox);
  // }


  editInventoryByGuid(event:any){
    if(event.target.checked){
       this.checkbox = true;
    }else{
      this.checkbox = false;
    }
    console.log(this.checkbox)
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
  searchPrimaryStone = (text$: Observable<string>): Observable<string[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.primaryStoneList$))
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
      switchMap((term) => this.filterAllList(term, this.productList$))
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

  // printAll() {
  //   if (this.agGrid && this.agGrid.api) {
  //     const selectedRows = this.agGrid.api.getSelectedRows(); // Get selected rows
  //     console.log("Selected Rows: ", this.selectedRows);
  //     const idsArray: number[] = []
  //     selectedRows.forEach((row) => {
  //       idsArray.push(row.id);
  //     })

  //     this.printInventoryBarcode(idsArray);
  //   } else {
  //     console.error("Grid API is not available yet.");
  //   }
  // }
  printHTML(htmlContent: string) {
    printJS({
      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
  }

  printInventoryBarcode(productIds:number[]){

    this.inventoryService
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
}
