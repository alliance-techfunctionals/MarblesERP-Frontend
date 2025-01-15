import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
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
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { BsModalService } from "ngx-bootstrap/modal";
import { IConfig } from "ngx-countries-dropdown";
import {
  Observable,
  Subscription,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { AuthService } from "src/app/core/service/auth.service";
import { ImageService } from "src/app/core/service/Image.service";
import { MessageToastService } from "src/app/core/service/message-toast.service";
import { validateEmailFormat } from "src/app/core/validators/validators/email.validator";
import { validatePincodeFormat } from "src/app/core/validators/validators/pincode.validators";
import { ProgressBarComponent } from "src/app/shared/components/progress-bar/progress-bar.component";
import { G20_COUNTRY_DATA } from "src/app/shared/DataBase/countryList";
import { CURRENCY_DATA } from "src/app/shared/DataBase/currencyList";
import { STATE_DATA } from "src/app/shared/DataBase/stateList";
import { DateService } from "src/app/shared/service/date.service";
import {
  City,
  Country,
  State,
} from "src/app/shared/service/open-source-data.service";
import { ColorService } from "src/app/shared/store/color/color.service";
import { ColorStoreService } from "src/app/shared/store/color/color.store";
import { DesignService } from "src/app/shared/store/design/design.service";
import { DesignStoreService } from "src/app/shared/store/design/design.store";
import {
  createFeedbackModel,
  createFeedbackSaveModel,
  feedbackForm,
  FeedbackModel,
} from "src/app/shared/store/feedback-form/feedback-form.model";
import { FeedbackService } from "src/app/shared/store/feedback-form/feedback-form.service";
import { createInvoiceModel } from "src/app/shared/store/invoice/invoice.model";
import { InvoiceService } from "src/app/shared/store/invoice/invoice.service";
import { QualityService } from "src/app/shared/store/quality/quality.service";
import { QualityStoreService } from "src/app/shared/store/quality/quality.store";
import { RoleService } from "src/app/shared/store/role/role.service";
import { RoleStoreService } from "src/app/shared/store/role/role.store";
import {
  ClientDetailForm,
  PartPaymentDetails,
  ProductDetails,
  SaleForm,
  addProductForm,
  checkoutForm,
  createSaleModel,
} from "src/app/shared/store/sales/sale.model";
import { SaleService } from "src/app/shared/store/sales/sale.service";
import { SaleStoreService } from "src/app/shared/store/sales/sale.store";
import { SizeService } from "src/app/shared/store/size/size.service";
import { SizeStoreService } from "src/app/shared/store/size/size.store";
import { UserModel } from "src/app/shared/store/user/user.model";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";
import { VoucherModel } from "src/app/shared/store/voucher/voucher.model";
import { VoucherService } from "src/app/shared/store/voucher/voucher.service";
import { VoucherStoreService } from "src/app/shared/store/voucher/voucher.store";
import printJS from "print-js";
import { ProductStoreService } from "src/app/shared/store/product/product.store";
import { ProductService } from "src/app/shared/store/product/product.service";
import { PrimaryColorStoreService } from "src/app/shared/store/primary-color/primary-color.store";
import { PrimaryColorService } from "src/app/shared/store/primary-color/primary-color.service";
import { ShapeStoreService } from "src/app/shared/store/shape/shape.store";
import { ShapeService } from "src/app/shared/store/shape/shape.service";
import { clear } from "console";
import { InventoryStoreService } from "src/app/shared/store/inventory/inventory.store";
import { InventoryService } from "src/app/shared/store/inventory/inventory.service";

@Component({
  selector: "app-sale-detail",
  templateUrl: "./sale-detail.component.html",
  styleUrls: ["./sale-detail.component.scss"],
})
export default class SaleDetailComponent implements OnInit, OnDestroy {
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    let result = confirm("Changes you made may not be saved.");
    if (result) {
      // Do more processing...
    }
    event.returnValue = false; // stay on same page
  }

  isSaleDone: boolean = false;
  allowFullPayment: boolean = false;

  subscriptions: Subscription[] = [];
  // sort salesmans by name
  salesManList$: Observable<UserModel[]> = this.userStoreService
    .selectAll()
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );
  productList$: Observable<string[]> = this.productStoreService
    .selectAll()
    .pipe(map((product) => product.map((t) => t.name)));
  supplierUserList$: Observable<UserModel[]> = this.userStoreService
    .selectByRoleId(5000)
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );
  qualityList$: Observable<String[]> = this.qualityStoreService
    .selectAll()
    .pipe(map((quality) => quality.map((t) => t.name)));
  colorsList$: Observable<String[]> = this.colorStoreService
    .selectAll()
    .pipe(map((color) => color.map((t) => t.name)));

  shapeList$: Observable<string[]> = this.shapeStoreService
    .selectAll()
    .pipe(map((shape) => shape.map((t) => t.name)));

  primaryColorList$: Observable<string[]> = this.primaryColorStoreService
    .selectAll()
    .pipe(map((product) => product.map((t) => t.name)));
  designList$: Observable<String[]> = this.designStoreService
    .selectAll()
    .pipe(map((design) => design.map((t) => t.name)));
  sizeList$: Observable<String[]> = this.sizeStoreService
    .selectAll()
    .pipe(map((size) => size.map((t) => t.name)));

  salesManUserList$: Observable<UserModel[]> = this.userStoreService
    .selectByRoleId()
    .pipe(
      map((qualities) => qualities.sort((a, b) => a.name.localeCompare(b.name)))
    );
  voucherList$: Observable<VoucherModel[]> =
    this.voucherStoreService.selectAll();
  feedbackList: FeedbackModel[] = [];

  // CURRENCIES LIST
  currencyList = CURRENCY_DATA;
  // COUNTRY DICT DATA
  COUNTRY_DATA: Country[] = [];
  // COUNTRIES LIST
  countriesList = G20_COUNTRY_DATA;
  // STATE LIST
  stateList: any[] = [];
  // CITY LIST
  cityList: any[] = [];

  public active = 1;
  // variable to decide nav when showing the payment information step
  public activePaymentNav: number = 1;
  // default rating
  rating: number = 1;
  // show thank you message
  showThankYou: boolean = false;
  // customer id for feedback
  customerIdAfterSale: number = 0;
  // limit minimum date in partial payment datepicker
  limitDate: NgbDate | null = this.calendar.getToday();
  // default date
  today: NgbDate = this.calendar.getToday();

  public editProduct: boolean = false;
  public editPayment: boolean = false;
  addedProducts: ProductDetails[] = [];

  paymentDetails: PartPaymentDetails[] = [];

  // check for full or partial payment
  isFullPayment: boolean = true;
  // show feedback form
  showFeedback: boolean = true;
  // for progress bar
  counter: number = 0;
  progressInterval: any;

  // SALE FORM
  saleForm: FormGroup<SaleForm> = this.formBuilder.nonNullable.group({
    id: [0],
    voucherId: [0],
    clientName: ["", Validators.required],
    emailList: this.formBuilder.array([]),
    mobileList: this.formBuilder.array([]),
    street: ["", Validators.required],
    apartment: [""],
    houseNumber: [""],
    shippingCountry: ["", Validators.required],
    shippingPinCode: ["", Validators.required],
    shippingState: ["", Validators.required],
    shippingCity: ["", Validators.required],
    salesManId: [0, Validators.required],
    details: this.formBuilder.array([]),
    saleComments: [""],
    paymentDetails: this.formBuilder.array([]),
  });

  // CLIENT DETAIL FORM
  clientDetailForm: FormGroup<ClientDetailForm> =
    this.formBuilder.nonNullable.group({
      id: [0],
      orderNumber: [""],
      isForeignSale: [false],
      customerId: [0],
      clientName: ["", Validators.required],
      emailList: this.formBuilder.array([
        this.formBuilder.control("", [
          Validators.required,
          (control: AbstractControl) => validateEmailFormat(control),
        ]),
      ]),
      mobileList: this.formBuilder.array([
        this.formBuilder.control("", Validators.required),
      ]),
      street: ["", Validators.required],
      apartment: [""],
      houseNumber: [""],
      shippingCountry: ["", Validators.required],
      shippingState: ["", Validators.required],
      shippingCity: ["", Validators.required],
      shippingPinCode: ["", Validators.required],
    });

  // ADD PRODUCT FORM
  addProductForm: FormGroup<addProductForm> =
    this.formBuilder.nonNullable.group({
      id: [0],
      masterId: [0],
      product: ["", Validators.required],
      quality: ["", Validators.required],
      colour: ["", Validators.required],
      design: ["", Validators.required],
      size: ["", Validators.required],
      shape: ["", Validators.required],
      // shape: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      stonesNb: [null],
      supplierId: [""],
      amount: [""],
      currency: ["INR"],
      primaryStone: ["", Validators.required],
      description: [""],
      salesManId: [0, [Validators.required, Validators.min(1)]],
      isHandCarry: ["false"],
      orderStatus: [0],
      expectedDeliveryDate: [""],
      paymentStatus: [0],
      isCustomized: [false],
      isFreightInclude: [true],
      productCode: [""],
      getByProductCode: [""],
      isTaxExempted: [false, Validators.required],
    });

  // CHECKOUT FORM
  checkOutForm: FormGroup<checkoutForm> = this.formBuilder.nonNullable.group({
    id: [0],
    masterOrderId: [0],
    paymentDate: [new Date()],
    amount: [""],
    comments: [""],
    saleComments: [""],
    partPaymentStatus: [false],
    orderDate: [""],
    advancePayment: [0, [Validators.min(0)]],
  });

  // FEEDBACK FORM
  feedbackForm: FormGroup<feedbackForm> = this.formBuilder.nonNullable.group({
    ans1: [0],
    ans2: [0],
    ans3: [0],
    ans4: [0],
    ans5: [""],
  });

  // GETTERS
  get id() {
    return this.clientDetailForm.get("id") as FormControl;
  }

  get orderNumber() {
    return this.clientDetailForm.get("orderNumber") as FormControl;
  }
  get isForeignSale() {
    return this.clientDetailForm.get("isForeignSale") as FormControl;
  }

  get customerId() {
    return this.clientDetailForm.get("customerId") as FormControl;
  }

  get clientName() {
    return this.clientDetailForm.get("clientName") as FormControl;
  }

  get mobileList() {
    return this.clientDetailForm.get("mobileList") as FormArray;
  }

  get emailList() {
    return this.clientDetailForm.get("emailList") as FormArray;
  }

  get street() {
    return this.clientDetailForm.get("street") as FormControl;
  }

  get apartment() {
    return this.clientDetailForm.get("apartment") as FormControl;
  }

  get houseNumber() {
    return this.clientDetailForm.get("houseNumber") as FormControl;
  }

  get shippingState() {
    return this.clientDetailForm.get("shippingState") as FormControl;
  }

  get shippingCity() {
    return this.clientDetailForm.get("shippingCity") as FormControl;
  }

  get shippingPinCode() {
    return this.clientDetailForm.get("shippingPinCode") as FormControl;
  }

  get shippingCountry() {
    return this.clientDetailForm.get("shippingCountry") as FormControl;
  }

  get ProductId() {
    return this.addProductForm.get("id") as FormControl;
  }

  get quality() {
    return this.addProductForm.get("quality") as FormControl;
  }
  get product() {
    return this.addProductForm.get("product") as FormControl;
  }

  get design() {
    return this.addProductForm.get("design") as FormControl;
  }

  get size() {
    return this.addProductForm.get("size") as FormControl;
  }
  get shape() {
    return this.addProductForm.get("shape") as FormControl;
  }

  get quantity() {
    return this.addProductForm.get("quantity") as FormControl;
  }
  get stonesNb() {
    return this.addProductForm.get("stonesNb") as FormControl;
  }

  get supplierId() {
    return this.addProductForm.get("supplierId") as FormControl;
  }

  get amount() {
    return this.addProductForm.get("amount") as FormControl;
  }

  get primaryStone() {
    return this.addProductForm.get("primaryStone") as FormControl;
  }
  // get primaryStone() {
  //   return this.addProductForm.get("primaryStone") as FormControl;
  // }
  get colour() {
    return this.addProductForm.get("colour") as FormControl;
  }

  get currency() {
    return this.addProductForm.get("currency") as FormControl;
  }

  get description() {
    return this.addProductForm.get("description") as FormControl;
  }

  get masterId() {
    return this.addProductForm.get("masterId") as FormControl;
  }

  get isHandCarry() {
    return this.addProductForm.get("isHandCarry") as FormControl;
  }

  get isCustomized() {
    return this.addProductForm.get("isCustomized") as FormControl;
  }

  get isFreightInclude() {
    return this.addProductForm.get("isFreightInclude") as FormControl;
  }

  get isTaxExempted() {
    return this.addProductForm.get("isTaxExempted") as FormControl;
  }

  get checkoutId() {
    return this.checkOutForm.get("id") as FormControl;
  }

  get checkoutAmount() {
    return this.checkOutForm.get("amount") as FormControl;
  }

  get paymentDate() {
    return this.checkOutForm.get("paymentDate") as FormControl;
  }

  get comments() {
    return this.checkOutForm.get("comments") as FormControl;
  }

  get partPaymentStatus() {
    return this.checkOutForm.get("partPaymentStatus") as FormControl;
  }

  get saleComments() {
    return this.checkOutForm.get("saleComments") as FormControl;
  }

  get masterOrderId() {
    return this.checkOutForm.get("masterOrderId") as FormControl;
  }

  get orderDate() {
    return this.checkOutForm.get("orderDate") as FormControl;
  }

  get advancePayment() {
    return this.checkOutForm.get("advancePayment") as FormControl;
  }

  get salesManId() {
    return this.addProductForm.get("salesManId") as FormControl;
  }

  get orderStatus() {
    return this.addProductForm.get("orderStatus") as FormControl;
  }

  get paymentStatus() {
    return this.addProductForm.get("paymentStatus") as FormControl;
  }

  get expectedDeliveryDate() {
    return this.addProductForm.get("expectedDeliveryDate") as FormControl;
  }

  get productCode() {
    return this.addProductForm.get("productCode") as FormControl;
  }

  get getByProductCode() {
    return this.addProductForm.get("getByProductCode") as FormControl;
  }

  addMobile() {
    let countryPhoneCode = 91; // default country code is India
    if (this.shippingCountry.value != "") {
      // set mobile number with the country code
      const selectedCountry = this.COUNTRY_DATA.find(
        (country) => country.name == this.shippingCountry.value
      );
      // if country is selected then set the country code to the mobile number
      // if (selectedCountry) {
      //   countryPhoneCode = selectedCountry.country_phone_code;
      // }
    }
    // this.mobileList.push(this.formBuilder.control(`+${countryPhoneCode} `));
    this.mobileList.push(
      this.formBuilder.control(
        `+${countryPhoneCode} `,
        this.isForeignSale.value ? Validators.required : null
      )
    );
  }

  removeMobile(index: number) {
    if (this.mobileList.length > 1) {
      this.mobileList.removeAt(index);
    }
  }

  addEmail() {
    // this.emailList.push(this.formBuilder.control(''));
    this.emailList.push(
      this.formBuilder.control(
        "",
        this.isForeignSale.value
          ? [
              Validators.required,
              (control: AbstractControl) => validateEmailFormat(control),
            ]
          : null
      )
    );
  }

  removeEmail(index: number) {
    if (this.emailList.length > 1) {
      this.emailList.removeAt(index);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: SaleStoreService,
    private saleService: SaleService,
    private roleService: RoleService,
    private productStoreService: ProductStoreService,
    private ProductService: ProductService,
    private roleStoreService: RoleStoreService,
    private qualityStoreService: QualityStoreService,
    private qualityService: QualityService,
    private colorStoreService: ColorStoreService,
    private colorService: ColorService,
    private primaryColorStoreService: PrimaryColorStoreService,
    private designStoreService: DesignStoreService,
    private designService: DesignService,
    private shapeStoreService: ShapeStoreService,
    private shapeService: ShapeService,
    private sizeStoreService: SizeStoreService,
    private sizeService: SizeService,
    private primaryColorService: PrimaryColorService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private voucherStoreService: VoucherStoreService,
    private voucherService: VoucherService,
    private invoiceService: InvoiceService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private messageService: MessageToastService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    protected dateService: DateService,
    private modalService: BsModalService,
    private _router: Router,
    private imageService: ImageService,
    private inventoryService: InventoryService,
    private inventoryStoreService: InventoryStoreService,
  ) {}

  ngOnInit(): void {
    
    // get country list
    this.getCountryList();
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.saleService.getAll(),
        this.userService.getAll(),
        this.roleService.getAll(),
        this.colorService.getAll(),
        // this.sizeService.getAll(),
        this.shapeService.getAll(),
        this.ProductService.getAll(),
        this.primaryColorService.getAll(),
        this.qualityService.getAll(),
        this.designService.getAll(),
        this.voucherService.getAll(),
        this.feedbackService.getAll(),
        this.inventoryService.getAll(),
      ])
        .pipe(
          tap(([params]) => {
            this.feedbackService.getAll().subscribe(
              (feedbackList: FeedbackModel[]) => {
                this.feedbackList = feedbackList; // Assuming group contains feedbackList
              },
              (error) => {
                console.error("Error fetching feedback:", error);
              }
            );
            // set the order number received from the sale list
            this.orderNumber.setValue(params["orderNo"]);

            this.isForeignSale.setValue(params["type"] == "foreign");

            if (params["productIds"]) {
              const productIds = params["productIds"].split(",");
              productIds.forEach((productId: any) => {
                let product = this.inventoryStoreService.getById(productId);
                if (product) {
                  this.addedProducts.push({
                    id: 0,
                    masterId: 0,
                    quality: product.qualityType,
                    product: product.product,
                    design: product.design,
                    primaryStone: product.primaryStone,
                    colour: product.primaryColor,
                    size: product.size,
                    shape: product.shape,
                    stonesNB: product.stonesNb,
                    supplierId: product.supplierId,
                    quantity: 1,
                    amount: product.sellingPrice,
                    ccyCode: this.currency.value,
                    description: "",
                    isCustomized: false,
                    isFreightInclude: true,
                    expectedDeliveryDate: this.expectedDeliveryDate.value,
                    productCode: product.productCode,
                    isTaxExempted: product.isTaxExempted,
                  });
                }
              })
              console.log(this.addedProducts);
              // set one product in form fields
              this.onEditClick(this.addedProducts.length - 1, true);
            }

            if (params["type"] == "counter") {
              // this.clientDetailForm.get("emailList")?.clearValidators();
              // this.clientDetailForm.get("mobileList")?.clearValidators();
              this.clientDetailForm.get("street")?.clearValidators();
              this.clientDetailForm.get("shippingCountry")?.clearValidators();
              this.clientDetailForm.get("shippingCity")?.clearValidators();
              this.clientDetailForm.get("shippingPinCode")?.clearValidators();

              const mobileList = this.clientDetailForm.get(
                "mobileList"
              ) as FormArray;

              // Iterate through each control in the mobileList FormArray
              mobileList.controls.forEach((control: AbstractControl) => {
                // Remove all validators from the control
                control.clearValidators();
                control.updateValueAndValidity();
              });

              const emailList = this.clientDetailForm.get(
                "emailList"
              ) as FormArray;
              emailList.controls.forEach((control: AbstractControl) => {
                // Remove all validators from the control
                control.clearValidators();
                control.updateValueAndValidity();
              });

              this.clientDetailForm.get("shippingCountry")?.setValue("India");
              this.isHandCarry.setValue("true");
            } else {
              this.clientDetailForm
                .get("street")
                ?.setValidators(Validators.required);
              this.clientDetailForm
                .get("shippingCountry")
                ?.setValidators(Validators.required);
              this.clientDetailForm
                .get("shippingCity")
                ?.setValidators(Validators.required);
              this.clientDetailForm
                .get("shippingPinCode")
                ?.setValidators(Validators.required);
            }

            // Update validators on the form controls
            this.clientDetailForm.get("clientName")?.updateValueAndValidity();
            // this.clientDetailForm.get("emailList")?.updateValueAndValidity();
            this.clientDetailForm.get("street")?.updateValueAndValidity();
            this.clientDetailForm
              .get("shippingCountry")
              ?.updateValueAndValidity();
            this.clientDetailForm
              .get("shippingState")
              ?.updateValueAndValidity();
            this.clientDetailForm.get("shippingCity")?.updateValueAndValidity();
            this.clientDetailForm
              .get("shippingPinCode")
              ?.updateValueAndValidity();
            // this.clientDetailForm.get("mobileList")?.updateValueAndValidity();

            if (params["id"] != 0) {
              // dont show feedback form
              this.showFeedback = false;

              const saleId = Number(params["id"]);

              // set masterId and masterOrderId
              this.masterId.setValue(saleId);
              this.masterOrderId.setValue(saleId);
              const sale = this.store.getById(saleId) ?? createSaleModel({});

              

              // set the nav active id for payment information stepper
              this.activePaymentNav = sale.partPayment.length > 0 ? 2 : 1;

              let clientName: string = this.userStoreService.getById(
                sale.customerId
              )!.name;
              let mobileNumberList: string[] = this.userStoreService.getById(
                sale.customerId
              )!.mobileNumberList;

              this.emailList.clear();
              // Add each email address as a separate control
              sale.emailAddressList.forEach((email) =>
                this.emailList.push(
                  this.formBuilder.control(
                    email,
                    this.isForeignSale.value
                      ? [
                          Validators.required,
                          (control: AbstractControl) =>
                            validateEmailFormat(control),
                        ]
                      : null
                  )
                )
              );

              this.mobileList.clear();
              // Add each mobile number as a separate control
              // mobileNumberList.forEach(mobile => this.mobileList.push(this.formBuilder.control(mobile)));
              mobileNumberList.forEach((mobile) =>
                this.mobileList.push(
                  this.formBuilder.control(
                    mobile,
                    this.isForeignSale.value ? Validators.required : null
                  )
                )
              );

              // adding client details
              this.clientDetailForm.setValue({
                id: sale.id,
                orderNumber: sale.orderNumber,
                isForeignSale: sale.isForeignSale,
                customerId: sale.customerId,
                clientName: clientName,
                mobileList: mobileNumberList,
                emailList: sale.emailAddressList,
                street: sale.street,
                apartment: sale.apartment,
                houseNumber: sale.houseNumber,
                shippingState: sale.state,
                shippingCountry: sale.country,
                shippingCity: sale.city,
                shippingPinCode: sale.pinCode,
              });
              // change id to 0
              // sale.details.map((product) => (product.id = 0));

              // adding product details to products array
              for (let product of sale.details) {
                this.addedProducts.push(product);
                
              }

              // set one product in form fields
              this.onEditClick(this.addedProducts.length - 1, true);

              // change id to 0
              sale.partPayment.map((payment) => (payment.id = 0));
              // adding payment details to payment array
              for (let payment of sale.partPayment) {
                this.paymentDetails.push(payment);
                if (payment.paymentType === 0) {
                  this.advancePayment.setValue(payment.amount); // Set the amount in advanceAmount field
                }
              }
              this.isHandCarry.setValue(sale.isHandCarry ? "true" : "false");
              this.masterId.setValue(sale.id);
              this.salesManId.setValue(sale.salesManId);
              this.orderStatus.setValue(sale.orderStatus);
              this.paymentStatus.setValue(sale.paymentStatus);
              this.saleComments.setValue(sale.comments);
              this.orderDate.setValue(
                this.dateService.formatDateToInput(new Date(sale.orderDate))
              );
              if (sale.expectedDeliveryDate !== null) {
                const formattedDate = this.datePipe.transform(
                  sale.expectedDeliveryDate,
                  "yyyy-MM-dd"
                );
                this.expectedDeliveryDate.setValue(formattedDate);
              }
              // call blur funtions to change the ruppe with commas
              this.amountOnBlur();
              this.remainingAmountOnBlur();
            } else {
              // if its a new sale then just check if sales man has logged in or not
              // if yeas then set salesManId from jwt token
              if (this.authService.getRole() == 2000) {
                this.salesManId.setValue(this.authService.getUserId());
              }

              // set order date
              this.orderDate.setValue(
                this.dateService.formatDateToInput(new Date())
              );
            }

          })
        )
        .subscribe()
    );

    this.progressInterval = setInterval(() => {
      this.counter = this.counter + 10;
      if (this.counter >= 100) {
        clearInterval(this.progressInterval);
      }
    }, 200);

    this.addProductForm.valueChanges.subscribe(() => {
      this.advancePaymentOnBlur();
    });

    this.advancePaymentOnBlur();
  }
  // Print Invoice
  printHTML(htmlContent: string) {
    printJS({
      printable: htmlContent,
      type: "raw-html",
      targetStyles: ["*"], // This ensures that all styles are included
    });
  }

  // submit button click
  protected uppertSale(
    isSendEmail: boolean,
    isFull: boolean,
    onlySaveAndUpdate: boolean,
    invoiceType: number
  ): void {
    if (
      this.product.value != "" ||
      this.quality.value != "" ||
      this.design.value != "" ||
      this.size.value != "" ||
      this.shape.value != "" ||
      this.primaryStone.value != "" ||
      this.colour.value != ""
    ) {
      
      this.addedProducts.push({
        id: this.ProductId.value,
        masterId: this.masterId.value,
        quality: this.quality.value,
        product: this.product.value,
        design: this.design.value,
        primaryStone: this.primaryStone.value,
        colour: this.colour.value,
        size: this.size.value,
        shape: this.shape.value,
        stonesNB: this.stonesNb.value,
        supplierId: this.supplierId.value,
        quantity: Number(this.quantity.value),
        amount: Number(
          this.amount.value
            ? this.amount.value.toString().replace(/\D/g, "")
            : null
        ), // used regular expression to remove all non digits characters,
        ccyCode: this.currency.value,
        description: this.description.value,
        isCustomized: this.isCustomized.value,
        isFreightInclude: this.isFreightInclude.value == "true" ? true : false,
        expectedDeliveryDate: this.expectedDeliveryDate.value,
        productCode: this.isCustomized.value ? null : this.productCode.value,
        isTaxExempted: this.isTaxExempted.value == "true" ? true : false,
      });

      this.clear();
    }

    let isBackDatedOrder = this.orderNumber.value == "New-Order" ? false : true;
    

    this.checkAdvancePayment();
    this.checkPartPaymentDetails();

    const sale = createSaleModel({
      id: this.id.value,
      orderNumber: this.orderNumber.value,
      customerId: this.customerId.value,
      clientName: this.clientName.value,
      isForeignSale: this.isForeignSale.value,
      emailAddressList: this.emailList.value,
      mobileNumberList: this.mobileList.value,
      street: this.street.value,
      apartment: this.apartment.value,
      houseNumber: this.houseNumber.value,
      shippingCountry: this.shippingCountry.value,
      country: this.shippingCountry.value,
      shippingState: this.shippingState.value,
      state: this.shippingState.value,
      shippingCity: this.shippingCity.value,
      city: this.shippingCity.value,
      shippingPincode: this.shippingPinCode.value,
      pinCode: this.shippingPinCode.value,
      salesManId: this.salesManId.value,
      details: this.addedProducts,
      partPayment: isFull ? [] : this.paymentDetails,
      comments: this.saleComments.value,
      orderStatus: this.orderStatus.value,
      paymentStatus: this.paymentStatus.value,
      isFullPayment: isFull,
      isHandCarry: this.isHandCarry.value == "true" ? true : false,
      orderDate: this.orderDate.value,
      expectedDeliveryDate:
        this.expectedDeliveryDate.value !== ""
          ? this.expectedDeliveryDate.value
          : null,
      isBackDatedOrder: this.orderNumber.value == "New-Order" ? false : true,
    });

    // sale is done

    this.subscriptions.push(
      combineLatest([
        this.saleService.upsertSale(sale),
        this.userService.getAll(),
      ])
        .pipe(
          tap(([response]) => {
            if (!onlySaveAndUpdate) {
              // saving customer id for feedback
              this.customerIdAfterSale = response.customerId;

              const invoiceModel = createInvoiceModel({
                masterOrderId: response.id,
                // orderNumber: response.orderNumber,
                // name: this.clientName.value,
                // address: response.formattedAddress,
                // mobileNo: this.mobileList.value[0],
                // emailAddress: response.emailAddressList,
                // products: this.addedProducts,
                // ccyCode: response.details[0].ccyCode,
                nationality: response.country,
                // invoiceDescription: this.saleComments.value,
                invoiceTransmissionMode: invoiceType,
                invoiceType: 1, // 1 for print directly 0 for getting file path
              });

              // open progress bar modal
              // const modalRef = this.modalService.show(ProgressBarComponent, {
              //   class:"modal-sm modal-dialog-centered transparent-modal",
              //   backdrop: "static"
              // })

              this.invoiceService
                .upsertInvoice(invoiceModel)
                .pipe(
                  tap((invoiceResponse) => {
                    if (invoiceResponse && invoiceType == 1) {
                      // const printWindow = window.open('', '', 'height=1000,width=800');
                      // printWindow?.document.write(invoiceResponse);
                      // printWindow?.document.close();
                      // // printWindow?.print();

                      // if(printWindow){
                      //   printWindow.onload = () => {
                      //     printWindow?.focus();
                      //     printWindow?.print();
                      //   }
                      // }
                      // printWindow!.onafterprint = () => {
                      //   printWindow?.close();
                      //   modalRef.hide()
                      // }

                      // const closeModalAndSpinner = () => {
                      //   
                      //   printWindow?.close();
                      //   modalRef.hide(); // Hide the modal and remove the spinner
                      // };
                      // printWindow!.onafterprint = closeModalAndSpinner;

                      // const interval = setInterval(() => {
                      //   if (printWindow && printWindow.closed) {
                      //     clearInterval(interval);
                      //     closeModalAndSpinner();
                      //   }
                      // }, 1000);
                      this.printHTML(invoiceResponse);
                    }
                  })
                )
                .subscribe();
            }
            this.isSaleDone = true;
            this.navigate();
            // this.saleForm.markAsPristine()
          }),
          catchError((error) => {
            if (error.error.message == "The full payment option should be used, as the total amount has already been received from the customer as an advance payment.") {
              this.allowFullPayment = true;
            }
            this.onEditClick(this.addedProducts.length - 1);
            return of(null); // Return an observable to complete the stream
          })
        )
        .subscribe()
    );
    // }
  }

  protected cancel(): void {
    //  cancel the
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // navigate to list page
  navigate() {
    this._router.navigate(["/sale"]);
  }

  clear(): void {
    this.addProductForm = this.formBuilder.nonNullable.group({
      // id: [0],
      // masterId: [this.masterId.value],
      // quality: [""],
      // product: [""],
      // design: ["", Validators.required],
      // size: ["", Validators.required],
      // shape: ["", Validators.required],
      // quantity: [1, [Validators.required, Validators.min(1)]],
      // stonesNb: [null],
      // supplierId: ["", Validators.required],
      // amount: [""],
      // currency: [this.currency.value],
      // primaryStone: ["", Validators.required],
      // colour: ["", Validators.required],
      // description: [""],
      // salesManId: [this.salesManId.value],
      // isHandCarry: [this.isHandCarry.value],
      // expectedDeliveryDate: [""],
      // orderStatus: [0],
      // paymentStatus: [0],
      // isCustomized: [false],
      // isFreightInclude: [false],
      // productCode: [''],
      // getByProductCode: [''],
      // isTaxExempted: [false],

      id: [0],
      masterId: [this.masterId.value],
      product: ["", Validators.required],
      quality: ["", Validators.required],
      colour: ["", Validators.required],
      design: ["", Validators.required],
      size: ["", Validators.required],
      shape: ["", Validators.required],
      // shape: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      stonesNb: [null],
      supplierId: [""],
      amount: [""],
      currency: [this.currency.value],
      primaryStone: ["", Validators.required],
      description: [""],
      salesManId: [this.salesManId.value],
      isHandCarry: [this.isHandCarry.value],
      orderStatus: [0],
      expectedDeliveryDate: [this.expectedDeliveryDate.value],
      paymentStatus: [0],
      isCustomized: [false],
      isFreightInclude: [true],
      productCode: [""],
      getByProductCode: [""],
      isTaxExempted: [false, Validators.required],
    });
    this.editProduct = false;
  }

  paymentClear(): void {
    this.checkOutForm.setValue({
      id: 0,
      paymentDate: new Date(),
      masterOrderId: this.masterId.value,
      amount: "",
      comments: "",
      saleComments: this.saleComments.value,
      partPaymentStatus: false,
      orderDate: this.orderDate.value,
      advancePayment: this.advancePayment.value,
    });
    this.editPayment = false;
  }

  // ADD OR UPDATE PRODUCT
  addProductClick() {
    if (this.addProductForm.invalid) {
      Object.keys(this.addProductForm.controls).forEach((key) => {
        const controlErrors = this.addProductForm.get(key)?.errors;
        if (controlErrors != null) {
          
        }
      });
      return;
    }

    this.addedProducts.push({
      id: this.ProductId.value,
      masterId: this.masterId.value,
      quality: this.quality.value,
      product: this.product.value,
      design: this.design.value,
      primaryStone: this.primaryStone.value,
      colour: this.colour.value,
      size: this.size.value,
      shape: this.shape.value,
      stonesNB: this.stonesNb.value,
      supplierId: this.supplierId.value,
      quantity: Number(this.quantity.value),
      amount: Number(
        this.amount.value
          ? this.amount.value.toString().replace(/\D/g, "")
          : "0"
      ), // used regular expression to remove all non digits characters
      ccyCode: this.currency.value,
      description: this.description.value,
      isCustomized: this.isCustomized.value,
      isFreightInclude: this.isFreightInclude.value,
      expectedDeliveryDate: this.expectedDeliveryDate.value,
      productCode: this.isCustomized.value ? null : this.productCode.value,
      isTaxExempted: this.isTaxExempted.value == "true" ? true : false,
    });
    this.clear();

    this.addProductForm.valueChanges.subscribe(() => {
      this.advancePaymentOnBlur();
    });
  }

  markAllAsTouched(): void {
    this.clientDetailForm.markAllAsTouched();
  }

  // FILL PRODUCT DETAILS TO UPDATE
  onEditClick(index: number, initial: boolean = false) {
    if (!initial && !this.addProductForm.invalid) {
      this.addProductClick();
    }

    

    this.ProductId.setValue(this.addedProducts[index].id);
    this.product.setValue(this.addedProducts[index].product);
    this.quality.setValue(this.addedProducts[index].quality);
    this.design.setValue(this.addedProducts[index].design);
    this.quantity.setValue(this.addedProducts[index].quantity);
    this.primaryStone.setValue(this.addedProducts[index].primaryStone);
    this.colour.setValue(this.addedProducts[index].colour);
    this.size.setValue(this.addedProducts[index].size);
    this.shape.setValue(this.addedProducts[index].shape);
    this.stonesNb.setValue(this.addedProducts[index].stonesNB);
    this.supplierId.setValue(this.addedProducts[index].supplierId);
    this.amount.setValue(this.addedProducts[index].amount);
    this.currency.setValue(this.addedProducts[index].ccyCode);
    this.description.setValue(this.addedProducts[index].description);
    this.isCustomized.setValue(this.addedProducts[index].isCustomized);
    this.productCode.setValue(this.addedProducts[index].productCode);
    this.isFreightInclude.setValue(this.addedProducts[index].isFreightInclude);
    this.isTaxExempted.setValue(this.addedProducts[index].isTaxExempted);
    // remove product from list before edit
    this.addedProducts.splice(index, 1);
    this.editProduct = true;
    this.amountOnBlur();

    
  }

  // DELETE ADDED PRODUCT
  onDeleteClick(index: number) {
    this.addedProducts.splice(index, 1);
  }

  checkAdvancePayment() {
    if (this.advancePayment.value) {
      let found = false;

      this.paymentDetails.forEach((paymentDetail) => {
        if (paymentDetail.paymentType === 0) {
          paymentDetail.id = 0; // hard coded bcoz no need to send
          paymentDetail.masterOrderId = this.masterOrderId.value;
          paymentDetail.amount = Number(
            this.advancePayment.value.toString().replace(/\D/g, "")
          ); // used regular expression to remove all non digits characters
          paymentDetail.ccyCode = this.currency.value;
          paymentDetail.comments = "Advance";
          found = true;
        }
      });

      if (!found) {
        this.paymentDetails.push({
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(),
          amount: Number(
            this.advancePayment.value.toString().replace(/\D/g, "")
          ), // used regular expression to remove all non digits characters
          ccyCode: this.currency.value,
          comments: "Advance",
          status: true,
          paymentType: 0,
        });
      }

      this.isFullPayment = false;

      this.sortPartPaymentList();
    }
  }

  // ADD PENDING PAYMENT DETAIL
  addPaymentClick() {
    let emptyAmountFieldExist = false;
    this.addedProducts.forEach((product) => {
      if (!product.amount) {
        emptyAmountFieldExist = true;
      }
    });

    if (
      !(
        emptyAmountFieldExist ||
        (this.addProductForm.valid && !this.amount.value)
      )
    ) {
      let paymentSum = 0,
        saleSum = 0;
      // sum of all pending payments
      this.paymentDetails.forEach((payment) => {
        paymentSum += payment.amount;
      });
      // add the new payment into sum
      (paymentSum += Number(
        this.checkoutAmount.value.toString().replace(/\D/g, "")
      )), // used regular expression to remove all non digits characters
        // sum of all products amount
        this.addedProducts.forEach((product) => {
          saleSum += product.amount;
        });
      // if addedProducts array is empty

      let isFound = false;
      this.paymentDetails.forEach((paymentDetail) => {
        if (paymentDetail.paymentType === 0) {
          isFound = true;
        }
      });

      if (!isFound) {
        paymentSum += this.advancePayment.value;
      }

      saleSum += Number(this.amount.value.toString().replace(/\D/g, "")); // used regular expression to remove all non digits characters;

      if (paymentSum <= saleSum) {
        this.paymentDetails.push({
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(
            this.today!.year,
            this.today!.month - 1,
            this.today!.day
          ),
          amount: Number(
            this.checkoutAmount.value.toString().replace(/\D/g, "")
          ), // used regular expression to remove all non digits characters,
          ccyCode: this.currency.value,
          comments: this.comments.value,
          status: this.partPaymentStatus.value,
          paymentType: 1,
        });
        this.isFullPayment = false;
        this.today = this.calendar.getToday();

        this.sortPartPaymentList();
        this.paymentClear();
      } else {
        this.messageService.error(
          `Remaining Amount Can't be Greater than Total Order Amount`
        );
      }
    } else {
      this.paymentDetails.push({
        id: 0, // hard coded bcoz no need to send
        masterOrderId: this.masterOrderId.value,
        paymentDueDate: new Date(
          this.today!.year,
          this.today!.month - 1,
          this.today!.day
        ),
        amount: Number(this.checkoutAmount.value.toString().replace(/\D/g, "")), // used regular expression to remove all non digits characters,
        ccyCode: this.currency.value,
        comments: this.comments.value,
        status: this.partPaymentStatus.value,
        paymentType: 1,
      });
      this.isFullPayment = false;
      this.today = this.calendar.getToday();

      this.sortPartPaymentList();
      this.paymentClear();
    }
  }

  // SORT PAYMENT LIST
  sortPartPaymentList() {
    this.paymentDetails.sort((a, b) => {
      const dateA = new Date(a.paymentDueDate);
      const dateB = new Date(b.paymentDueDate);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // FILL PENDING PAYMENT DETAIL TO UPDATE
  onEditPaymentClick(index: number) {
    const formattedDate = this.datePipe.transform(
      this.paymentDetails[index].paymentDueDate,
      "yyyy-MM-dd"
    );
    const year = Number(formattedDate?.split("-", 3)[0]);
    const month = Number(formattedDate?.split("-", 3)[1]);
    const day = Number(formattedDate?.split("-", 3)[2]);
    this.checkoutId.setValue(this.paymentDetails[index].id);
    // this.paymentDate.setValue(new NgbDate(year, month, day));
    this.today = new NgbDate(year, month - 1, day);
    this.comments.setValue(this.paymentDetails[index].comments);
    this.checkoutAmount.setValue(this.paymentDetails[index].amount);
    // remove product from list before edit
    this.paymentDetails.splice(index, 1);
    this.editPayment = true;
    this.remainingAmountOnBlur();
  }

  // feedback form submit
  feedbackSave() {
    if (this.customerIdAfterSale != 0) {
      const feedbackSaveModel = createFeedbackSaveModel({
        customerId: this.customerIdAfterSale,
        questionAnswer: {
          1: this.feedbackList[0].answer
            ? this.feedbackList[0].answer.toString()
            : "1",
          2: this.feedbackList[1].answer
            ? this.feedbackList[1].answer.toString()
            : "2",
          3: this.feedbackList[2].answer
            ? this.feedbackList[2].answer.toString()
            : "3",
          4: this.feedbackList[3].answer
            ? this.feedbackList[3].answer.toString()
            : "4",
          5: this.feedbackList[4].answer
            ? this.feedbackList[4].answer.toString()
            : "5",
          6: this.feedbackList[5].answer ? this.feedbackList[5].answer : "",
        },
      });
      this.feedbackService
        .upsertFeedback(feedbackSaveModel)
        .pipe(
          tap((response) => {
            this.showThankYou = true;
          })
        )
        .subscribe();
    }
  }
  // change amount with Indian Number System
  amountOnBlur() {
    if (this.amount.value) {
      this.addProductForm.patchValue({
        amount: this.currencyPipe.transform(
          this.amount.value.toString().replace(/\D/g, "").replace(/^0+/, ""),
          this.currency.value,
          "symbol",
          "1.0-0"
        )!,
      });
    }
  }

  remainingAmount = "";
  // change remaining amount with Indian Number System
  remainingAmountOnBlur() {
    if (this.checkoutAmount.value) {
      this.checkOutForm.patchValue({
        amount: this.currencyPipe.transform(
          this.checkoutAmount.value
            .toString()
            .replace(/\D/g, "")
            .replace(/^0+/, ""),
          this.currency.value,
          "symbol",
          "1.0-0"
        )!,
      });
    }
  }

  // change amount with Indian Number System
  advancePaymentOnBlur() {
    // if (this.advancePayment.value) {
    //   this.checkOutForm.patchValue({
    //     advancePayment: this.currencyPipe.transform(
    //       this.advancePayment.value
    //         .toString()
    //         .replace(/\D/g, "")
    //         .replace(/^0+/, ""),
    //       this.currency.value,
    //       "symbol",
    //       "1.0-0"
    //     )!,
    //   });
    // }

    if (!this.advancePayment.value) {
      this.advancePayment.setValue(0);
    }
    let saleSum = 0;
    // sum of all pending payments
    this.addedProducts.forEach((product) => {
      saleSum += product.amount;
    });

    if (this.addProductForm.valid && this.amount.value) {
      saleSum += Number(this.amount.value.toString().replace(/\D/g, ""));
    }

    const advancePaymentControl = this.checkOutForm.get("advancePayment");

    if (advancePaymentControl && saleSum && advancePaymentControl.valid) {
      advancePaymentControl.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(saleSum),
      ]);
      advancePaymentControl.updateValueAndValidity();

      this.remainingAmount = this.currencyPipe.transform(
        saleSum -
          Number(this.advancePayment.value.toString().replace(/\D/g, "")),
        this.currency.value,
        "symbol",
        "1.0-0"
      )!;
    } else {
      this.remainingAmount = "";
    }

    if (this.remainingAmount.startsWith("-")) {
      this.remainingAmount = "";
    }

    let noAmountFieldExist = false;
    this.addedProducts.forEach((product) => {
      if (!product.amount) {
        noAmountFieldExist = true;
      }
    });

    if (
      noAmountFieldExist ||
      (this.addProductForm.valid && !this.amount.value)
    ) {
      const advancePaymentControl = this.checkOutForm.get("advancePayment");
      if (advancePaymentControl) {
        advancePaymentControl.setValidators([]);
        advancePaymentControl.updateValueAndValidity();
      }
    }
  }
  // DELETE PENDING PAYMENT
  onDeletePaymentClick(index: number) {
    this.paymentDetails.splice(index, 1);
  }

  getCountryList() {
    this.saleService.getCountryList().subscribe(
      (response) => {
        this.COUNTRY_DATA = response;
        this.countriesList = response.map(
          (resp: any) => resp["name"]
        );
      },
      (error) => {
        console.error("Error fetching country list:", error);
      }
    );
  }

  getStateList() {
    if (this.shippingCountry.value != "") {
      // set mobile number with the country code
      const selectedCountry = this.COUNTRY_DATA.find(
        (country) => country.name == this.shippingCountry.value
      );
      // if country is selected then set the country code to the mobile number
      if (selectedCountry) {
        // const countryPhoneCode = selectedCountry.country_phone_code;
        // const updatedMobileList = this.clientDetailForm
        //   .get("mobileList")
        //   ?.value.map((mobileNumber: string) => {
        //     // Assuming mobile numbers might already contain a country code, you may want to replace or prepend the new one
        //     // For simplicity, this example just prepends the new country code
        //     return `+${countryPhoneCode} `;
        //   });

        // this.clientDetailForm.get("mobileList")?.setValue(updatedMobileList!);
      }

      if (selectedCountry && selectedCountry.id) {
        const countryId = selectedCountry.id;
  
        // Fetch states using the country ID
        this.saleService.getStateList(countryId).subscribe(
          (response) => {
            this.stateList = response
          },
          (error) => {
            console.error("Error fetching state list:", error);
          }
        );
      } else {
        console.warn("Selected country does not have a valid ID.");
      }
    } else {
      // remove country code from the mobile number
      this.stateList = []
      this.clientDetailForm.get("mobileList")?.setValue([""]);
    }
  }

  getCityList() {
    if (this.shippingState.value != "") {
      // Find the selected state object based on the state name
      const selectedState = this.stateList.find(
        (state) => state.name === this.shippingState.value
      );
  
      // Ensure the selected state exists and has a valid ID
      if (selectedState && selectedState.id) {
        const stateId = selectedState.id;
  
        // Fetch cities using the state ID
        this.saleService.getCityList(stateId).subscribe(
          (response) => {
            this.cityList = response.map((resp: any) => resp["name"]);
          },
          (error) => {
            console.error("Error fetching city list:", error);
          }
        );
      } else {
        console.warn("Selected state does not have a valid ID.");
      }
    } else {
      // Clear city list if no state is selected
      this.cityList = [];
    }
  }
  

  searchCountry = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.countriesList
          .filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase()))
          .splice(0, 10)
      )
    );

    searchState = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) =>
          this.stateList
            .filter((v) =>
              v.name.toLowerCase().startsWith(term.toLowerCase())
            )
            .slice(0, 10) 
            .map((v) => v.name)
        )
      );

  searchCity = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.cityList
          .filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase()))
          .splice(0, 10)
      )
    );

  searchQuality = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.qualityList$))
    );
  };

  searchDesign = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.designList$))
    );
  };
  searchProductName = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.productList$))
    );
  };
  searchPrimaryColor = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.primaryColorList$))
    );
  };
  searchShape = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.shapeList$))
    );
  };

  searchColour = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.colorsList$))
    );
  };

  searchSize = (text$: Observable<string>): Observable<String[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.filterAllList(term, this.sizeList$))
    );
  };

  private filterAllList(
    term: string,
    list: Observable<String[]>
  ): Observable<String[]> {
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

  @ViewChild("paymentForm") paymentForm!: ElementRef;

  // Other properties and methods...

  scrollToPaymentForm() {
    this.paymentForm.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  fetchProductByProductCode() {
    if (this.getByProductCode.value) {
      // If product code already exist in addedProducts array then show error message
      let isProductExist = this.addedProducts.some(
        (product) => product.productCode === this.getByProductCode.value
      );

      if (
        !isProductExist &&
        this.addProductForm.valid &&
        this.getByProductCode.value === this.productCode.value
      ) {
        
        this.messageService.error("Product already added");
        return;
      }

      if (isProductExist) {
        this.messageService.error("Product already added");
        return;
      }

      this.saleService.getByProductCode(this.getByProductCode.value).subscribe(
        (response) => {
          if (response) {
            const productDetail = response.data;
            this.ProductId.setValue(productDetail.id);
            this.product.setValue(productDetail.product);
            this.quality.setValue(productDetail.qualityType);
            this.design.setValue(productDetail.design);
            this.primaryStone.setValue(productDetail.primaryStone);
            this.colour.setValue(productDetail.primaryColor);
            this.size.setValue(productDetail.size);
            this.shape.setValue(productDetail.shape);
            this.stonesNb.setValue(productDetail.stonesNb);
            this.supplierId.setValue(productDetail.supplierId);
            this.amount.setValue(productDetail.sellingPrice);
            this.expectedDeliveryDate.setValue(
              this.expectedDeliveryDate.value
            );
            this.productCode.setValue(productDetail.productCode);
            this.isTaxExempted.setValue(productDetail.isTaxExempted);

            this.getByProductCode.setValue("")
          }
        },
        (error: any) => {
          console.error("Error fetching product by product code:", error);
        }
      );
    }
  }

  /**
   * Check if the part payment details are valid
   * First check if all the addedProducts have amount or not
   * Then iterate over the paymentDetails and check if one advance payment is there
   * If only advance payment is there and all products amount is available then add the remaining amount to the paymentDetails
   * If amount is not available then add the remaining amount to the paymentDetails as 0
   * 
   * 
   * 
   * Check all items are with amount or not
   * Calculate the total amount of all products
   * Calculate the amount added in part payment array
   * If the difference of above two is greater than 0 then add a new payment detail with the remaining amount
  */
  checkPartPaymentDetails() {
    let isAmountAvailable = true;
    let totalAmount = 0;
    this.addedProducts.forEach((product) => {
      if (!product.amount) {
        isAmountAvailable = false;
      }else {
        totalAmount += product.amount;
      }
    });

    let amountAdded = 0;
    this.paymentDetails.forEach((payment) => {
      amountAdded += payment.amount;
    });

    if(isAmountAvailable){
      if (totalAmount - amountAdded > 0) {
        this.paymentDetails.push({
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(),
          amount: totalAmount - amountAdded,
          ccyCode: this.currency.value,
          comments: this.comments.value,
          status: this.partPaymentStatus.value,
          paymentType: 1,
        });
        this.isFullPayment = false;

        this.sortPartPaymentList();
      }
    }else {
      if (this.paymentDetails.length == 1 && this.paymentDetails[0].paymentType === 0) {
        this.paymentDetails.push({
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(),
          amount: totalAmount - amountAdded > 0 ? totalAmount - amountAdded : 0,
          ccyCode: this.currency.value,
          comments: this.comments.value,
          status: this.partPaymentStatus.value,
          paymentType: 1,
        });
        this.isFullPayment = false;

        this.sortPartPaymentList();
      } else if (this.paymentDetails.length > 1 && totalAmount - amountAdded > 0) {
        this.paymentDetails.push({
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(),
          amount: totalAmount - amountAdded,
          ccyCode: this.currency.value,
          comments: this.comments.value,
          status: this.partPaymentStatus.value,
          paymentType: 1,
        });
        this.isFullPayment = false;

        this.sortPartPaymentList();

      }
    }
  }
}




/**
 * All amount available
 *  - Calculate total amount of all products
 *  - Calculate the amount added in part payment array
 *  - If the difference of above two is greater than 0 then add a new payment detail with the remaining amount
 * 
 * All amount not available
 *  - Calculate available amount
 *  - If only advance is present
 *    - Then add the remaining amount to the paymentDetails, if less than 0 set to 0
 *  - If advance and other payments are present
 *    - If total mismatch then add the remaining amount to the paymentDetails
 *    - If total match or added amount is greater then do nothing...
 */