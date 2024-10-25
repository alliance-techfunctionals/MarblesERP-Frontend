import { Component, OnDestroy, OnInit } from "@angular/core";
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
  productDetail,
} from "src/app/shared/store/Purchase-voucher/purchase.model";
import { PurchaseVoucherService } from "src/app/shared/store/Purchase-voucher/purchase.service";
import { PurchaseVoucherStoreService } from "src/app/shared/store/Purchase-voucher/purchase.store";
import { UserModel } from "src/app/shared/store/user/user.model";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";

@Component({
  selector: "app-purchase-voucher-details",
  templateUrl: "./purchase-voucher-details.component.html",
  styleUrls: ["./purchase-voucher-details.component.scss"],
})
export class PurchaseVoucherDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  public editProduct: boolean = false;
  addedProducts: productDetail[] = [];
  today: NgbDate = this.calendar.getToday();

  supplierUserList$: Observable<UserModel[]> = this.userStoreService
    .selectByRoleId(5000)
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );

  purchaseVoucherForm: FormGroup = this.formBuilder.nonNullable.group({
    id: [0],
    invoiceNo: ["", Validators.required],
    voucherDate: ["", Validators.required],
    supplierId: ["", Validators.required],
  }) as any;

  productDetailForm: FormGroup = this.formBuilder.nonNullable.group({
    masterId: [0],
    productDescription: ["", Validators.required],
    hsnCode: [""],
    quantity: ["", Validators.required],
    rate: ["", Validators.required],
    amount: ["", Validators.required],
    otherCharges: [""],
    otherDetails: [""],
  }) as any;

  // variables to hide Rate, sadekaar and designAmt
  rateField = false;
  sadekaarField = false;
  designAmtField = false;

  get id() {
    return this.purchaseVoucherForm.get("id") as FormControl;
  }

  get invoiceNo() {
    return this.purchaseVoucherForm.get("invoiceNo") as FormControl;
  }
  get voucherDate() {
    return this.purchaseVoucherForm.get("voucherDate") as FormControl;
  }
  get supplierId() {
    return this.purchaseVoucherForm.get("supplierId") as FormControl;
  }

  get masterId() {
    return this.productDetailForm.get("masterId") as FormControl;
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
  get otherCharges() {
    return this.productDetailForm.get("otherCharges") as FormControl;
  }
  get otherDetails() {
    return this.productDetailForm.get("otherDetails") as FormControl;
  }

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
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    console.log("NgOnInt");

    const voucherDate = new Date().toISOString();
    this.maxDate = voucherDate;
    console.log(voucherDate);
    this.purchaseVoucherForm.get("voucherDate")?.setValue(voucherDate);
    console.log(this.purchaseVoucherForm.value.voucherDate);
    this.purchaseVoucherForm.valueChanges.subscribe((res) => {
      console.log(res);
    });

    this.subscriptions.push(this.userService.getAll().subscribe());
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
                console.log(purchase)
              const productId = Number(params["masterId"]);
              const products =
                this.PurchaseVoucherStoreService.getById(productId) ??
                createPurchaseModel({});

              this.purchaseVoucherForm.setValue({
                id: purchase.id,
                invoiceNo: purchase.invoiceNo,
                voucherDate: purchase.voucherDate,
                supplierId: purchase.supplierId,
              });
              

              this.addedProducts = purchase.details;

              // purchase.Details.forEach(product => {
              //   this.addedProducts.push(p)
              // })
              console.log(this.addedProducts)
              this.onEditClick(this.addedProducts.length - 1);

              // set one product in form fields
              // this.onEditClick(this.addedProducts.length - 1, true);
              this.voucherDate.setValue(
                this.dateService.formatDateToInput(
                  new Date(purchase.voucherDate)
                )
              );
              this.purchaseVoucherForm.setValue({});
            } else {
              this.voucherDate.setValue(
                this.dateService.formatDateToInput(new Date())
              );
            }
          })
        )
        .subscribe()
    );
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
    voucherDate.setHours(voucherDate.getHours() - 5);
    voucherDate.setMinutes(voucherDate.getMinutes() - 30);

    let date = voucherDate.toISOString();

    const purchase = createPurchaseModel({
      id: this.id.value,
      invoiceNo: this.invoiceNo.value,
      voucherDate: date,
      supplierId: this.supplierId.value,
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
      masterId: [0],
      productDescription: ["", Validators.required],
      hsnCode: [""],
      quantity: ["", Validators.required],
      rate: ["", Validators.required],
      amount: ["", Validators.required],
      otherCharges: [""],
      otherDetails: [""],
    });
    this.editProduct = false;
  }

  
  // ADD OR UPDATE PRODUCT
  addProduct() {
    this.addedProducts.push({
      masterId: this.masterId.value,
      productDescription: this.productDescription.value,
      hsnCode: this.hsnCode.value,
      quantity: this.quantity.value,
      rate: this.rate.value,
      amount: this.amount.value,
      otherCharges: this.otherCharges.value,
      otherDetails: this.otherDetails.value,
    });
    this.clear();
  }

  // FILL PRODUCT DETAILS TO UPDATE
  onEditClick(index: number, initial: boolean = true) {
    if (!initial && !this.productDetailForm.invalid) {
      this.addProduct();
    }
    this.masterId.setValue(this.addedProducts[index].masterId);
    this.productDescription.setValue(
    this.addedProducts[index].productDescription);
    this.hsnCode.setValue(this.addedProducts[index].hsnCode);
    this.quantity.setValue(this.addedProducts[index].quantity);
    this.rate.setValue(this.addedProducts[index].rate);
    this.amount.setValue(this.addedProducts[index].amount);
    this.otherCharges.setValue(this.addedProducts[index].otherCharges);
    this.otherDetails.setValue(this.addedProducts[index].otherDetails);

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
}
