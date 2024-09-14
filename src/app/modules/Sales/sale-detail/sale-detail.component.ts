import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IConfig } from 'ngx-countries-dropdown';
import { Observable, Subscription, combineLatest, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { ImageService } from 'src/app/core/service/Image.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { validateEmailFormat } from 'src/app/core/validators/validators/email.validator';
import { validatePincodeFormat } from 'src/app/core/validators/validators/pincode.validators';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { G20_COUNTRY_DATA } from 'src/app/shared/DataBase/countryList';
import { CURRENCY_DATA } from 'src/app/shared/DataBase/currencyList';
import { STATE_DATA } from 'src/app/shared/DataBase/stateList';
import { DateService } from 'src/app/shared/service/date.service';
import { City, Country, State } from 'src/app/shared/service/open-source-data.service';
import { ColorService } from 'src/app/shared/store/color/color.service';
import { ColorStoreService } from 'src/app/shared/store/color/color.store';
import { DesignService } from 'src/app/shared/store/design/design.service';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { createFeedbackModel, createFeedbackSaveModel, feedbackForm, FeedbackModel } from 'src/app/shared/store/feedback-form/feedback-form.model';
import { FeedbackService } from 'src/app/shared/store/feedback-form/feedback-form.service';
import { createInvoiceModel } from 'src/app/shared/store/invoice/invoice.model';
import { InvoiceService } from 'src/app/shared/store/invoice/invoice.service';
import { QualityService } from 'src/app/shared/store/quality/quality.service';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { ClientDetailForm, PartPaymentDetails, ProductDetails, SaleForm, addProductForm, checkoutForm, createSaleModel } from 'src/app/shared/store/sales/sale.model';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SizeService } from 'src/app/shared/store/size/size.service';
import { SizeStoreService } from 'src/app/shared/store/size/size.store';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { VoucherModel } from 'src/app/shared/store/voucher/voucher.model';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export default class SaleDetailComponent implements OnInit, OnDestroy {
  isSaleDone: boolean = false;

  subscriptions: Subscription[] = [];
  // sort salesmans by name
  salesManList$: Observable<UserModel[]> = this.userStoreService.selectAll().pipe(
    map(qualities => qualities.sort((a, b) => a.name.localeCompare(b.name)))
  );
  qualityList$: Observable<String[]> = this.qualityStoreService.selectAll().pipe(
    map((quality) => quality.map((t) => t.name))
  );
  colorsList$: Observable<String[]> = this.colorStoreService.selectAll().pipe(
    map((color) => color.map((t) => t.name))
  );
  designList$: Observable<String[]> = this.designStoreService.selectAll().pipe(
    map((design) => design.map((t) => t.name))
  );
  sizeList$: Observable<String[]> = this.sizeStoreService.selectAll().pipe(
    map((size) => size.map((t) => t.name))
  );

  salesManUserList$: Observable<UserModel[]> = this.userStoreService.selectByRoleId().pipe(
    map(qualities => qualities.sort((a, b) => a.name.localeCompare(b.name)))
  );
  voucherList$: Observable<VoucherModel[]> = this.voucherStoreService.selectAll();
  feedbackList: FeedbackModel[] = [];

  // CURRENCIES LIST
  currencyList = CURRENCY_DATA;
  // COUNTRY DICT DATA
  COUNTRY_DATA: Country[] = [];
  // COUNTRIES LIST
  countriesList = G20_COUNTRY_DATA;
  // STATE LIST
  stateList: string[] = [];
  // CITY LIST
  cityList: string[] = [];

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
    clientName: ['', Validators.required],
    emailList: this.formBuilder.array([]),
    mobileList: this.formBuilder.array([]),
    street: ['', Validators.required],
    apartment: [''],
    houseNumber: [''],
    shippingCountry: ['', Validators.required],
    shippingPinCode: ['', Validators.required],
    shippingState: ['', Validators.required],
    shippingCity: ['', Validators.required],
    salesManId: [0, Validators.required],
    details: this.formBuilder.array([]),
    saleComments: [''],
    paymentDetails: this.formBuilder.array([]),
  });

  // CLIENT DETAIL FORM
  clientDetailForm: FormGroup<ClientDetailForm> = this.formBuilder.nonNullable.group({
    id: [0],
    orderNumber: [''],
    customerId: [0],
    clientName: ['', Validators.required],
    emailList: this.formBuilder.array([
      this.formBuilder.control('', [
        Validators.required,
        (control: AbstractControl) => validateEmailFormat(control)
      ])
    ]),
    mobileList: this.formBuilder.array([
      // this.formBuilder.control('', Validators.required)
      this.formBuilder.control('', [
        Validators.required,
        // Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/) // Adjust the pattern as needed
      ])
    ]),
    street: ['', Validators.required],
    apartment: [''],
    houseNumber: [''],
    shippingCountry: ['', Validators.required],
    shippingState: ['', Validators.required],
    shippingCity: ['', Validators.required],
    shippingPinCode: ['', Validators.required],
  });

  // ADD PRODUCT FORM
  addProductForm: FormGroup<addProductForm> = this.formBuilder.nonNullable.group({
    id: [0],
    masterId: [0],
    quality: ['', Validators.required],
    design: ['', Validators.required],
    size: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    amount: [''],
    currency: ['INR'],
    color: ['', Validators.required],
    description: [''],
    salesManId: [0, [Validators.required, Validators.min(1)]],
    isHandCarry: ['false'],
    orderStatus: [0],
    paymentStatus: [0],
    isCustomized: [false],
    isFreightInclude: [true],
  });

  // CHECKOUT FORM
  checkOutForm: FormGroup<checkoutForm> = this.formBuilder.nonNullable.group({
    id: [0],
    masterOrderId: [0],
    paymentDate: [new Date()],
    amount: [''],
    comments: [''],
    saleComments: [''],
    partPaymentStatus: [false],
    orderDate:['']
  })

  // FEEDBACK FORM
  feedbackForm: FormGroup<feedbackForm> = this.formBuilder.nonNullable.group({
    ans1: [0],
    ans2: [0],
    ans3: [0],
    ans4: [0],
    ans5: ['']
  })

  // GETTERS
  get id() {
    return this.clientDetailForm.get('id') as FormControl;
  }

  get orderNumber() {
    return this.clientDetailForm.get('orderNumber') as FormControl;
  }

  get customerId() {
    return this.clientDetailForm.get('customerId') as FormControl;
  }

  get clientName() {
    return this.clientDetailForm.get('clientName') as FormControl;
  }

  get mobileList() {
    return this.clientDetailForm.get('mobileList') as FormArray;
  }

  get emailList() {
    return this.clientDetailForm.get('emailList') as FormArray;
  }

  get street() {
    return this.clientDetailForm.get('street') as FormControl;
  }

  get apartment() {
    return this.clientDetailForm.get('apartment') as FormControl;
  }

  get houseNumber() {
    return this.clientDetailForm.get('houseNumber') as FormControl;
  }

  get shippingState() {
    return this.clientDetailForm.get('shippingState') as FormControl;
  }

  get shippingCity() {
    return this.clientDetailForm.get('shippingCity') as FormControl;
  }

  get shippingPinCode() {
    return this.clientDetailForm.get('shippingPinCode') as FormControl;
  }

  get shippingCountry() {
    return this.clientDetailForm.get('shippingCountry') as FormControl;
  }

  get ProductId() {
    return this.addProductForm.get('id') as FormControl;
  }

  get quality() {
    return this.addProductForm.get('quality') as FormControl;
  }

  get design() {
    return this.addProductForm.get('design') as FormControl;
  }

  get size() {
    return this.addProductForm.get('size') as FormControl;
  }

  get quantity() {
    return this.addProductForm.get('quantity') as FormControl;
  }

  get amount() {
    return this.addProductForm.get('amount') as FormControl;
  }

  get color() {
    return this.addProductForm.get('color') as FormControl;
  }

  get currency() {
    return this.addProductForm.get('currency') as FormControl;
  }

  get description() {
    return this.addProductForm.get('description') as FormControl;
  }

  get masterId() {
    return this.addProductForm.get('masterId') as FormControl;
  }

  get isHandCarry() {
    return this.addProductForm.get('isHandCarry') as FormControl;
  }

  get isCustomized() {
    return this.addProductForm.get('isCustomized') as FormControl;
  }

  get isFreightInclude() {
    return this.addProductForm.get('isFreightInclude') as FormControl;
  }

  get checkoutId() {
    return this.checkOutForm.get('id') as FormControl;
  }

  get checkoutAmount() {
    return this.checkOutForm.get('amount') as FormControl;
  }

  get paymentDate() {
    return this.checkOutForm.get('paymentDate') as FormControl;
  }

  get comments() {
    return this.checkOutForm.get('comments') as FormControl;
  }

  get partPaymentStatus() {
    return this.checkOutForm.get('partPaymentStatus') as FormControl;
  }

  get saleComments() {
    return this.checkOutForm.get('saleComments') as FormControl;
  }

  get masterOrderId() {
    return this.checkOutForm.get('masterOrderId') as FormControl;
  }

  get orderDate() {
    return this.checkOutForm.get('orderDate') as FormControl;
  }

  get salesManId() {
    return this.addProductForm.get('salesManId') as FormControl;
  }

  get orderStatus() {
    return this.addProductForm.get('orderStatus') as FormControl;
  }

  get paymentStatus() {
    return this.addProductForm.get('paymentStatus') as FormControl;
  }

  addMobile() {
    let countryPhoneCode = 91; // default country code is India
    if(this.shippingCountry.value != ''){
      // set mobile number with the country code
      const selectedCountry = this.COUNTRY_DATA.find((country) => country.country_name == this.shippingCountry.value);
      // if country is selected then set the country code to the mobile number
      if (selectedCountry) {
        countryPhoneCode = selectedCountry.country_phone_code;
      } 
    }
    // this.mobileList.push(this.formBuilder.control(`+${countryPhoneCode} `));
    this.mobileList.push(this.formBuilder.control(`+${countryPhoneCode} `, [
      Validators.required,
      // Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/) // Adjust the pattern as needed
    ]));
  }

  removeMobile(index: number) {
    if (this.mobileList.length > 1) {
      this.mobileList.removeAt(index);
    }
  }

  addEmail() {
    // this.emailList.push(this.formBuilder.control(''));
    this.emailList.push(this.formBuilder.control('', [
      Validators.required,
      (control: AbstractControl) => validateEmailFormat(control)
    ]));
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
    private roleStoreService: RoleStoreService,
    private qualityStoreService: QualityStoreService,
    private qualityService: QualityService,
    private colorStoreService: ColorStoreService,
    private colorService: ColorService,
    private designStoreService: DesignStoreService,
    private designService: DesignService,
    private sizeStoreService: SizeStoreService,
    private sizeService: SizeService,
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
    private imageService: ImageService
  ) { }

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
        this.qualityService.getAll(),
        this.designService.getAll(),
        this.voucherService.getAll(),
        this.feedbackService.getAll(),
      ]).pipe(
        tap(([params]) => {
          this.feedbackService.getAll().subscribe(
            (feedbackList: FeedbackModel[]) => {
              this.feedbackList = feedbackList; // Assuming group contains feedbackList
            },
            (error) => {
              console.error('Error fetching feedback:', error);
            }
          );
          // set the order number received from the sale list
          this.orderNumber.setValue(params['orderNo']);

          if (params['id'] != 0) {
            // dont show feedback form
            this.showFeedback = false;

            const saleId = Number(params['id']);
            
            // set masterId and masterOrderId
            this.masterId.setValue(saleId);
            this.masterOrderId.setValue(saleId);
            const sale = this.store.getById(saleId) ?? createSaleModel({})

            console.log(sale);
            
            // set the nav active id for payment information stepper
            this.activePaymentNav = sale.partPayment.length > 0? 2: 1;
            
            let clientName: string = this.userStoreService.getById(sale.customerId)!.name;
            let mobileNumberList: string[] = this.userStoreService.getById(sale.customerId)!.mobileNumberList;

            this.emailList.clear();
            // Add each email address as a separate control
            sale.emailAddressList.forEach(email => this.emailList.push(this.formBuilder.control(email, [
              Validators.required,
              (control: AbstractControl) => validateEmailFormat(control)
            ])));

            this.mobileList.clear();
            // Add each mobile number as a separate control
            // mobileNumberList.forEach(mobile => this.mobileList.push(this.formBuilder.control(mobile)));
            mobileNumberList.forEach(mobile => this.mobileList.push(this.formBuilder.control(mobile, [
              Validators.required,
              // Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/) // Adjust the pattern as needed
            ])));

            // adding client details
            this.clientDetailForm.setValue({
              id: sale.id,
              orderNumber: sale.orderNumber,
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
            sale.details.map((product) => product.id = 0);

            // adding product details to products array
            for (let product of sale.details) {
              this.addedProducts.push(product);
            }

            // set one product in form fields
            this.onEditClick(this.addedProducts.length - 1);  

            // change id to 0
            sale.partPayment.map((payment) => payment.id = 0);
            // adding payment details to payment array
            for (let payment of sale.partPayment) {
              this.paymentDetails.push(payment);
            }

            this.isHandCarry.setValue(sale.isHandCarry? 'true' : 'false');
            this.masterId.setValue(sale.id);
            this.salesManId.setValue(sale.salesManId);
            this.orderStatus.setValue(sale.orderStatus);
            this.paymentStatus.setValue(sale.paymentStatus);
            this.saleComments.setValue(sale.comments);
            this.orderDate.setValue(this.dateService.formatDateToInput(new Date(sale.orderDate)))
            // call blur funtions to change the ruppe with commas
            this.amountOnBlur();
            this.remainingAmountOnBlur();
          }
          else{
            // if its a new sale then just check if sales man has logged in or not
            // if yeas then set salesManId from jwt token
            if (this.authService.getRole() == 2000){
              this.salesManId.setValue(this.authService.getUserId())
            }

            // set order date
            this.orderDate.setValue(this.dateService.formatDateToInput(new Date()))
          }
        })
      ).subscribe()
    );

    this.progressInterval = setInterval(() => {  
      this.counter = this.counter + 10;  
      if (this.counter >= 100) {  
          clearInterval(this.progressInterval);  
      }  
  }, 200); 

  }

  // submit button click
  protected uppertSale(isSendEmail: boolean, isFull: boolean, onlySaveAndUpdate: boolean, invoiceType: number): void {
    if (this.quality.value != '' || this.design.value != '' || this.size.value != '' || this.color.value != '') {
      this.addedProducts.push(
        {
          id: this.ProductId.value,
          masterId: this.masterId.value,
          quality: this.quality.value,
          design: this.design.value,
          colour: this.color.value,
          size: this.size.value,
          quantity: Number(this.quantity.value),
          amount: Number(this.amount.value? this.amount.value.toString().replace(/\D/g,''): null), // used regular expression to remove all non digits characters,
          ccyCode: this.currency.value,
          description: this.description.value,
          isCustomized: this.isCustomized.value,
          isFreightInclude: this.isFreightInclude.value
        }
      );
    }

    let orderDateValue = new Date(this.orderDate.value);
    orderDateValue.setHours(orderDateValue.getHours() - 5);
    orderDateValue.setMinutes(orderDateValue.getMinutes() - 30);
    
    const sale = createSaleModel({
      id: this.id.value,
      orderNumber: this.orderNumber.value,
      customerId: this.customerId.value,
      clientName: this.clientName.value,
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
      partPayment: isFull? []: this.paymentDetails,
      comments: this.saleComments.value,
      orderStatus: this.orderStatus.value,
      paymentStatus: this.paymentStatus.value,
      isFullPayment: isFull,
      isHandCarry: this.isHandCarry.value == 'true' ? true : false,
      orderDate: orderDateValue
    });

    // sale is done
    this.isSaleDone = true;

    this.subscriptions.push(
      combineLatest([
        this.saleService.upsertSale(sale),
        this.userService.getAll()
      ]).pipe(
        tap(([response]) => {
          if(!onlySaveAndUpdate){
            // saving customer id for feedback
            this.customerIdAfterSale = response.customerId;
            
            const invoiceModel = createInvoiceModel({
              masterOrderId: response.id,
              orderNumber: response.orderNumber,
              name: this.clientName.value,
              address: response.formattedAddress,
              mobileNo: this.mobileList.value[0],
              emailAddress: response.emailAddressList,
              products: this.addedProducts,
              ccyCode: response.details[0].ccyCode,
              nationality: response.country,
              invoiceDescription: this.saleComments.value,
              invoiceType: invoiceType
            })

            // open progress bar modal
            const modalRef = this.modalService.show(ProgressBarComponent, {
              class:"modal-sm modal-dialog-centered transparent-modal",
              backdrop: "static"
            })

            this.invoiceService.upsertInvoice(invoiceModel).pipe(
              tap((invoiceResponse) => {
                if (invoiceResponse && invoiceType == 1){
                  const printWindow = window.open('', '', 'height=1000,width=800');
                  printWindow?.document.write(invoiceResponse);
                  printWindow?.document.close();
                  // printWindow?.print();

                  if(printWindow){
                    printWindow.onload = () => {
                      printWindow?.focus();
                      printWindow?.print();
                    }
                  }
                  // printWindow!.onafterprint = () => {
                  //   printWindow?.close();
                  //   modalRef.hide()
                  // }

                  const closeModalAndSpinner = () => {
                    console.log("Modal closed");
                    printWindow?.close();
                    modalRef.hide(); // Hide the modal and remove the spinner
                  };
                  printWindow!.onafterprint = closeModalAndSpinner;


                  const interval = setInterval(() => {
                    if (printWindow && printWindow.closed) {
                      clearInterval(interval);
                      closeModalAndSpinner();
                    }
                  }, 1000);
                }
                else{
                  // hide the progress bar as response received
                  modalRef.hide()
                }
              })
            ).subscribe()
          }
          this.navigate()
          this.saleForm.markAsPristine()
        })
      ).subscribe()
    );
    // }
  }

  protected cancel(): void {
    //  cancel the
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // navigate to list page
  navigate() {
    this._router.navigate(['/sale']);
  }

  clear(): void {
    this.addProductForm = this.formBuilder.nonNullable.group({
      id: [0],
      masterId: [this.masterId.value],
      quality: ['', Validators.required],
      design: ['', Validators.required],
      size: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [''],
      currency: [this.currency.value],
      color: ['', Validators.required],
      description: [''],
      salesManId: [this.salesManId.value],
      isHandCarry: [this.isHandCarry.value],
      orderStatus: [0],
      paymentStatus: [0],
      isCustomized: [false],
      isFreightInclude: [false]
    })
    this.editProduct = false;
  }

  paymentClear(): void {
    this.checkOutForm.setValue({
      id: 0,
      paymentDate: new Date(),
      masterOrderId: this.masterId.value,
      amount: '',
      comments: '',
      saleComments: this.saleComments.value,
      partPaymentStatus: false,
      orderDate: this.orderDate.value
    });
    this.editPayment = false;
  }


  // ADD OR UPDATE PRODUCT
  addProductClick() {
    this.addedProducts.push(
      {
        id: this.ProductId.value,
        masterId: this.masterId.value,
        quality: this.quality.value,
        design: this.design.value,
        colour: this.color.value,
        size: this.size.value,
        quantity: Number(this.quantity.value),
        amount: Number(this.amount.value?this.amount.value.toString().replace(/\D/g,''): '0'), // used regular expression to remove all non digits characters
        ccyCode: this.currency.value,
        description: this.description.value,
        isCustomized: this.isCustomized.value,
        isFreightInclude: this.isFreightInclude.value
      }
    );
    this.clear();
  }

  // FILL PRODUCT DETAILS TO UPDATE
  onEditClick(index: number) {
    this.ProductId.setValue(this.addedProducts[index].id);
    this.quality.setValue(this.addedProducts[index].quality);
    this.design.setValue(this.addedProducts[index].design);
    this.quantity.setValue(this.addedProducts[index].quantity);
    this.color.setValue(this.addedProducts[index].colour);
    this.size.setValue(this.addedProducts[index].size);
    this.amount.setValue(this.addedProducts[index].amount);
    this.currency.setValue(this.addedProducts[index].ccyCode);
    this.description.setValue(this.addedProducts[index].description);
    this.isCustomized.setValue(this.addedProducts[index].isCustomized);
    // remove product from list before edit
    this.addedProducts.splice(index, 1);
    this.editProduct = true;
    this.amountOnBlur();
  }

  // DELETE ADDED PRODUCT
  onDeleteClick(index: number) {
    this.addedProducts.splice(index, 1);
  }

  // ADD PENDING PAYMENT DETAIL
  addPaymentClick() {
    if(this.amount.value){
      let paymentSum = 0, saleSum = 0;
      // sum of all pending payments
      this.paymentDetails.forEach(payment => {
        paymentSum += payment.amount;
      });
      // add the new payment into sum
      paymentSum += Number(this.checkoutAmount.value.toString().replace(/\D/g,'')), // used regular expression to remove all non digits characters
  
      // sum of all products amount
      this.addedProducts.forEach(product => {
        saleSum += product.amount;
      })
      // if addedProducts array is empty
      
      saleSum += Number(this.amount.value.toString().replace(/\D/g,'')); // used regular expression to remove all non digits characters;
      
      if(paymentSum <= saleSum){
        
        this.paymentDetails.push(
          {
    
            id: 0, // hard coded bcoz no need to send
            masterOrderId: this.masterOrderId.value,
            paymentDueDate: new Date(this.today!.year,this.today!.month - 1, this.today!.day),
            amount: Number(this.checkoutAmount.value.toString().replace(/\D/g,'')), // used regular expression to remove all non digits characters,
            ccyCode: this.currency.value,
            comments: this.comments.value,
            status: this.partPaymentStatus.value
          }
        );
        this.isFullPayment = false;
        this.today = this.calendar.getToday();
        
        this.sortPartPaymentList();
        this.paymentClear();
      }
      else{
        this.messageService.error(`Remaining Amount Can't be Greater than Total Order Amount`);
      }
    }
    else{
      this.paymentDetails.push(
        {
  
          id: 0, // hard coded bcoz no need to send
          masterOrderId: this.masterOrderId.value,
          paymentDueDate: new Date(this.today!.year,this.today!.month - 1, this.today!.day),
          amount: Number(this.checkoutAmount.value.toString().replace(/\D/g,'')), // used regular expression to remove all non digits characters,
          ccyCode: this.currency.value,
          comments: this.comments.value,
          status: this.partPaymentStatus.value
        }
      );
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
    const formattedDate = this.datePipe.transform(this.paymentDetails[index].paymentDueDate, 'yyyy-MM-dd')
    const year = Number(formattedDate?.split('-',3)[0]);
    const month = Number(formattedDate?.split('-',3)[1]);
    const day = Number(formattedDate?.split('-',3)[2]);
    this.checkoutId.setValue(this.paymentDetails[index].id);
    // this.paymentDate.setValue(new NgbDate(year, month, day));
    this.today = new NgbDate(year, month - 1, day);
    this.comments.setValue(this.paymentDetails[index].comments);
    this.checkoutAmount.setValue(this.paymentDetails[index].amount);
    // remove product from list before edit
    this.paymentDetails.splice(index, 1);
    this.editPayment = true;
    this.remainingAmountOnBlur()
  }

  // feedback form submit
  feedbackSave() {
      if(this.customerIdAfterSale != 0){
        const feedbackSaveModel = createFeedbackSaveModel({
          customerId: this.customerIdAfterSale,
          questionAnswer: {
            1: this.feedbackList[0].answer? this.feedbackList[0].answer.toString(): '1',
            2: this.feedbackList[1].answer? this.feedbackList[1].answer.toString(): '2',
            3: this.feedbackList[2].answer? this.feedbackList[2].answer.toString(): '3',
            4: this.feedbackList[3].answer? this.feedbackList[3].answer.toString(): '4',
            5: this.feedbackList[4].answer? this.feedbackList[4].answer.toString(): '5',
            6: this.feedbackList[5].answer? this.feedbackList[5].answer: '',
          }
        })
        this.feedbackService.upsertFeedback(feedbackSaveModel).pipe(
          tap((response) => {
            
            this.showThankYou = true;
          })
        ).subscribe();
      }
  }
  // change amount with Indian Number System
  amountOnBlur(){
      if(this.amount.value){
        this.addProductForm.patchValue({
          amount: this.currencyPipe.transform(this.amount.value.toString().replace(/\D/g,'').replace(/^0+/,''),this.currency.value,'symbol','1.0-0')!
        })
        
      }
  }
  // change remaining amount with Indian Number System
  remainingAmountOnBlur(){
    if(this.checkoutAmount.value){
      this.checkOutForm.patchValue({
        amount: this.currencyPipe.transform(this.checkoutAmount.value.toString().replace(/\D/g,'').replace(/^0+/,''),this.currency.value,'symbol','1.0-0')!
      })
      
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
        this.countriesList = response.map((resp: Country) => resp['country_name']);
      },
      (error) => {
        console.error('Error fetching country list:', error);
      }
    );
  }

  getStateList() {
    if(this.shippingCountry.value != ''){
      // set mobile number with the country code
      const selectedCountry = this.COUNTRY_DATA.find((country) => country.country_name == this.shippingCountry.value);
      // if country is selected then set the country code to the mobile number
      if (selectedCountry) {
        const countryPhoneCode = selectedCountry.country_phone_code;
        const updatedMobileList = this.clientDetailForm.get('mobileList')?.value.map((mobileNumber: string) => {
          // Assuming mobile numbers might already contain a country code, you may want to replace or prepend the new one
          // For simplicity, this example just prepends the new country code
          return `+${countryPhoneCode} `;
        });
      
        this.clientDetailForm.get('mobileList')?.setValue(updatedMobileList!);
      } 

      this.saleService.getStateList(this.shippingCountry.value).subscribe(
        (response) => {
          this.stateList = response.map((resp: State) => resp['state_name']);
        },
        (error) => {
          console.error('Error fetching state list:', error);
        }
      );
    }
    else{
      // remove country code from the mobile number
      this.clientDetailForm.get('mobileList')?.setValue(['']);
    }
  }

  getCityList() {
    if(this.shippingState.value != ''){
      this.saleService.getCityList(this.shippingState.value).subscribe(
        (response) => {
          this.cityList = response.map((resp: City) => resp['city_name']);
        },
        (error) => {
          console.error('Error fetching city list:', error);
        }
      );
    }
  }

  searchCountry = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				this.countriesList.filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10),
			),
		);

  searchState = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.stateList.filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10),
      ),
    );

  searchCity = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.cityList.filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10),
      ),
    );
}

