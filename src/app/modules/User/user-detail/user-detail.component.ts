import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest, tap } from 'rxjs';
import { numberValidator } from 'src/app/core/validators/validators/numberValidator';
import { Role } from 'src/app/shared/store/role/role.model';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { UserForm, createUserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export default class UserDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  roleList$: Observable<Role[]> = this.roleStoreService.selectAll();

  userForm: FormGroup<UserForm> = this.formBuilder.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    roleId: [0, [Validators.required, (control: AbstractControl) => numberValidator(control, 'Role')]],
    gender: ['M', Validators.required],
    emailAddressList: this.formBuilder.array([
      this.formBuilder.control('')
    ]),
    mobileNumberList: this.formBuilder.array([
      this.formBuilder.control('', Validators.required)
    ]),
    residentialAddress: [''],
    country: ['India'],
    city: ['Agra'],
    pinCode: [''],
    state: ['UP'],
    password: [''],
    supplierCode: ['']
    
  });

  showSupplierCode:boolean=false;

  
  get userFormControl() {
    return this.userForm.controls;
  }

  get id() {
    return this.userForm.get('id') as FormControl;
  }

  get name() {
    return this.userForm.get('name') as FormControl;
  }

  get roleId() {
    return this.userForm.get('roleId') as FormControl;
  }

  get gender() {
    return this.userForm.get('gender') as FormControl;
  }

  get mobileNumberList() {
    return this.userForm.get('mobileNumberList') as FormArray;
  }

  get residentialAddress() {
    return this.userForm.get('residentialAddress') as FormControl;
  }

  get country() {
    return this.userForm.get('country') as FormControl;
  }

  get city() {
    return this.userForm.get('city') as FormControl;
  }

  get pinCode() {
    return this.userForm.get('pinCode') as FormControl;
  }

  get state() {
    return this.userForm.get('state') as FormControl;
  }

  get emailAddressList() {
    return this.userForm.get('emailAddressList') as FormArray;
  }

  get password() {
    return this.userForm.get('password') as FormControl;
  }
  get supplierCode(){
    return this.userForm.get('supplierCode') as FormControl;
  }
 

  addMobile() {
    this.mobileNumberList.push(this.formBuilder.control(''));
  }
  
  removeMobile(index: number) {
    if(this.mobileNumberList.length > 1){
      this.mobileNumberList.removeAt(index);
    }
  }

  addEmail() {
    this.emailAddressList.push(this.formBuilder.control(''));
  }
  
  removeEmail(index: number) {
    if(this.emailAddressList.length > 1){
      this.emailAddressList.removeAt(index);
    }
  }

  

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: UserStoreService,
    private userService: UserService,
    private roleService: RoleService,
    private roleStoreService: RoleStoreService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // get user role

    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.userService.getAll(),
        this.roleService.getAll()
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != 0) {
            const userId = Number(params['id']);
            const user = this.store.getById(userId) ?? createUserModel({});
            if(user.roleId == 5000){
              this.showSupplierCode = true;
            }else {
              this.showSupplierCode = false;
            }

            this.emailAddressList.clear();
            // Add each email address as a separate control
            user.emailAddressList.forEach(email => this.emailAddressList.push(this.formBuilder.control(email)));

            this.mobileNumberList.clear();
            // Add each mobile number as a separate control
            user.mobileNumberList.forEach(mobile => this.mobileNumberList.push(this.formBuilder.control(mobile)));
            this.userForm.setValue({
              id: user.id,
              city: user.city,
              country: user.country,
              gender: user.gender,
              mobileNumberList: user.mobileNumberList,
              name: user.name,
              pinCode: user.pinCode,
              residentialAddress: user.residentialAddress,
              roleId: user.roleId,
              state: 'UP',
              emailAddressList: user.emailAddressList,
              password: user.password,
              supplierCode: ''
            })
          }
        })
      ).subscribe()
    );

    this.roleId.valueChanges.subscribe(value => {
      if(value==5000){
        this.showSupplierCode =true;
      }else{
        this.showSupplierCode = false;

      }
    })

  }

  // submit button click
  protected uppertUser(): void {
    const user = createUserModel({
      id: this.id.value,
      city: this.city.value,
      country: this.country.value,
      gender: this.gender.value,
      emailAddressList: this.emailAddressList.value,
      mobileNumberList: this.mobileNumberList.value,
      name: this.name.value,
      pinCode: this.pinCode.value,
      residentialAddress: this.residentialAddress.value,
      roleId: this.roleId.value,
      state: "UP",
      password: this.password.value
    });

    if (this.userForm.valid || this.userForm.disabled) {
      this.subscriptions.push(
        this.userService.upsertUser(user).pipe(
          tap(() => {
            this.userForm.markAsPristine(),
            this.navigate();
          })
        ).subscribe()
      );
    }
  }

  protected cancel(): void {
    //  cancel the
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // navigate to list page
  navigate() {
    this._router.navigate(['/users']);
  }
}
