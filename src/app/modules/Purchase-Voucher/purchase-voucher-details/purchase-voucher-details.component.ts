import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, map, Observable, Subscription, tap } from "rxjs";
import { DateService } from "src/app/shared/service/date.service";
import {
  createPurchaseModel,
  ProductDetail,
} from "src/app/shared/store/Purchase-voucher/purchase.model";
import { PurchaseVoucherService } from "src/app/shared/store/Purchase-voucher/purchase.service";
import { PurchaseVoucherStoreService } from "src/app/shared/store/Purchase-voucher/purchase.store";
import { UserModel } from "src/app/shared/store/user/user.model";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";
import { GridApi, ColumnApi, GridOptions, ColDef } from "ag-grid-community";

@Component({
  selector: "app-purchase-voucher-details",
  templateUrl: "./purchase-voucher-details.component.html",
  styleUrls: ["./purchase-voucher-details.component.scss"],
})
export class PurchaseVoucherDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  public editProduct: boolean = false;
  addedProducts: ProductDetail[] = [];
  today: NgbDate = this.calendar.getToday();

  supplierUserList$: Observable<UserModel[]> = this.userStoreService
    .selectByRoleId(5000)
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );

  purchaseVoucherForm: FormGroup = this.formBuilder.nonNullable.group({
    id: [0],
    poNumber: ["", Validators.required],
    voucherDate: ["", Validators.required],
    supplierId: ["", Validators.required],
    otherCharges: [""],
  }) as any;

  productDetailForm: FormGroup = this.formBuilder.nonNullable.group({
    purchaseOrderId: [0],
    productDescription: ["", Validators.required],
    hsnCode: [""],
    quantity: ["", Validators.required],
    rate: ["", Validators.required],
    amount: ["", Validators.required],
  }) as any;

  // variables to hide Rate, sadekaar and designAmt
  rateField = false;
  sadekaarField = false;
  designAmtField = false;


  get id() {
    return this.purchaseVoucherForm.get("id") as FormControl;
  }

  get poNumber() {
    return this.purchaseVoucherForm.get("poNumber") as FormControl;
  }
  get voucherDate() {
    return this.purchaseVoucherForm.get("voucherDate") as FormControl;
  }
  get supplierId() {
    return this.purchaseVoucherForm.get("supplierId") as FormControl;
  }
  get otherCharges() {
    return this.purchaseVoucherForm.get("otherCharges") as FormControl;
  }

  get purchaseOrderId() {
    return this.productDetailForm.get("purchaseOrderId") as FormControl;
  }
  get productDescription() {
    return this.productDetailForm.get("productDescription") as FormControl;
  }
  get hsnCode() {
    return this.productDetailForm.get("hsnCode") as FormControl;
  }
  get quantity() {
    return this.productDetailForm.get("quantity") as FormControl;
  }
  get rate() {
    return this.productDetailForm.get("rate") as FormControl;
  }
  get amount() {
    return this.productDetailForm.get("amount") as FormControl;
  }

 
  // get otherDetails() {
  //   return this.productDetailForm.get("otherDetails") as FormControl;
  // }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _router: Router,
    private PurchaseVoucherService: PurchaseVoucherService,
    private userStoreService: UserStoreService,
    protected dateService: DateService,
    private PurchaseVoucherStoreService: PurchaseVoucherStoreService,
    private userService: UserService,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.subscriptions.push(this.userService.getAll().subscribe());
    this.maxDate = this.dateService.formatDateToInput(new Date())

    // get Product
    this.subscriptions.push(
      combineLatest([this.route.params])
        .pipe(
          tap(([params]) => {
            if (params["id"] != 0) {
              const purchaseId = Number(params["id"]);
              const purchase =
                this.PurchaseVoucherStoreService.getById(purchaseId) ??
                createPurchaseModel({});
              console.log(purchase);
              const productId = Number(params["purchaseOrderId"]);
              const products =
                this.PurchaseVoucherStoreService.getById(productId) ??
                createPurchaseModel({});

              this.purchaseVoucherForm.setValue({
                id: purchase.id,
                poNumber: purchase.poNumber,
                voucherDate: this.dateService.formatDateToInput(
                  new Date(purchase.voucherDate)
                ),
                supplierId: purchase.supplierId,
                otherCharges: purchase.otherCharges,
              });

              this.addedProducts = purchase.details;

              // purchase.Details.forEach(product => {
              //   this.addedProducts.push(p)
              // })
              console.log(this.addedProducts);
              // this.onEditClick(this.addedProducts.length - 1);

              // set one product in form fields
              // this.onEditClick(this.addedProducts.length - 1, true);
              // this.voucherDate.setValue(
              //   // this.dateService.formatDateToInput(
              //   //   new Date(purchase.voucherDate)
              //   // )
              // );
              // this.purchaseVoucherForm.setValue({});
            } else {
              this.voucherDate.setValue(
                this.dateService.formatDateToInput(new Date())
              );
              this.addEmptyRow();
            }
          })
        )
        .subscribe()
    );
  }

// Add this function to your PurchaseVoucherDetailsComponent
calculateAmount(idx: number) {
  console.log("Calculation Called")
  const quantity = this.addedProducts[idx].quantity;
  const rate = this.addedProducts[idx].rate;
  const amount = quantity * rate;
  
  this.addedProducts[idx].amount = amount;

  console.log(this.addedProducts[idx].amount)
  this.changeDetectorRef.markForCheck();
}


    
  maxDate: string = "";
  // navigate to list page
  navigate() {
    this._router.navigate(["/purchase-voucher"]);
  }

  // submit button click
  protected onSubmit(): void {
    if (this.productDetailForm.valid) {
      this.addProduct();
    }

    let voucherDate = new Date(this.voucherDate.value);

    let date = voucherDate.toISOString();

    const purchase = createPurchaseModel({
      id: this.id.value,
      poNumber: this.poNumber.value,
      voucherDate: date,
      supplierId: this.supplierId.value,
      otherCharges: this.otherCharges.value,
      details: this.addedProducts,
    });

    if (this.purchaseVoucherForm.valid) {
      this.subscriptions.push(
        this.PurchaseVoucherService.upsertPurchaseVoucher(purchase)
          .pipe(
            tap(() => {
              this.PurchaseVoucherService.getAll();
              this.purchaseVoucherForm.markAsPristine();
              this.navigate();
            })
          )
          .subscribe()
      );
    }
  }

  clear(): void {
    this.productDetailForm = this.formBuilder.nonNullable.group({
      purchaseOrderId: [0],
      productDescription: ["", Validators.required],
      hsnCode: [""],
      quantity: ["", Validators.required],
      rate: ["", Validators.required],
      amount: ["", Validators.required],
    });
    this.editProduct = false;
  }

  // ADD OR UPDATE PRODUCT
  addProduct() {
    this.addedProducts.push({
      purchaseOrderId: this.purchaseOrderId.value,
      productDescription: this.productDescription.value,
      hsnCode: this.hsnCode.value,
      quantity: this.quantity.value,
      rate: this.rate.value,
      amount: this.amount.value,
      
    });
    this.clear();

    this.changeDetectorRef.detectChanges();
  }

  // FILL PRODUCT DETAILS TO UPDATE
  onEditClick(index: number, initial: boolean = true) {
    if (!initial && !this.productDetailForm.invalid) {
      this.addProduct();
    }
    this.purchaseOrderId.setValue(this.addedProducts[index].purchaseOrderId);
    this.productDescription.setValue(
      this.addedProducts[index].productDescription
    );
    this.hsnCode.setValue(this.addedProducts[index].hsnCode);
    this.quantity.setValue(this.addedProducts[index].quantity);
    this.rate.setValue(this.addedProducts[index].rate);
    this.amount.setValue(this.addedProducts[index].amount);
    // remove product from list before edit
    this.addedProducts.splice(index, 1);
    this.editProduct = true;
    // this.amountOnBlur();
  }

  // DELETE ADDED PRODUCT
  onDeleteClick(index: number) {
    this.addedProducts.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  editingIndex: number | null = null;
  originalProduct: any = null;

  addEmptyRow(): void {
    const emptyProduct: ProductDetail = {
      productDescription: "",
      hsnCode: 0,
      quantity: 0,
      rate: 0,
      amount: 0,
      
    };
    this.addedProducts.push(emptyProduct); // Add the empty product at the end
    this.editingIndex = this.addedProducts.length - 1; // Set the new row to be in edit mode
    this.originalProduct = { ...emptyProduct }; // Save the original empty product
    this.changeDetectorRef.detectChanges();
  }

  onEditClickNew(index: number): void {
    this.editingIndex = index;
    this.originalProduct = { ...this.addedProducts[index] }; // Save the original product values
    this.changeDetectorRef.detectChanges();
  }

  onDeleteClickNew(index: number): void {
    this.addedProducts.splice(index, 1);
    this.changeDetectorRef.detectChanges();
  }

  saveEdit(index: number): void {
    if (this.isProductValid(this.addedProducts[index])) {
      this.editingIndex = null;
      this.originalProduct = null; // Clear the original product values
      this.changeDetectorRef.detectChanges();
    }

    console.log(this.addedProducts);
  }

  cancelEdit(): void {
    if (this.editingIndex !== null) {
      if (this.isProductValid(this.originalProduct)) {
        this.addedProducts[this.editingIndex] = this.originalProduct; // Revert to original values
      } else {
        this.addedProducts.splice(this.editingIndex, 1); // Remove the invalid row
      }
      this.editingIndex = null;
      this.originalProduct = null; // Clear the original product values
      this.changeDetectorRef.detectChanges();
    }
  }

  isProductValid(product: any): boolean {
    return (
      product.productDescription &&
      product.quantity &&
      product.rate &&
      product.amount
    );
  }
}
