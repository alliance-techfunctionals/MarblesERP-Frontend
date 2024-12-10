import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest, tap } from 'rxjs';
import { numberValidator } from 'src/app/core/validators/validators/numberValidator';
import { validateVehicleNumberFormat } from 'src/app/core/validators/validators/vehicle-number.validator';
import { DateService } from 'src/app/shared/service/date.service';
import { Role } from 'src/app/shared/store/role/role.model';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { VoucherForm, createVoucherModel } from 'src/app/shared/store/voucher/voucher.model';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';

@Component({
  selector: 'app-view-voucher',
  templateUrl: './view-voucher.component.html',
  styleUrls: ['./view-voucher.component.scss']
})
export class ViewVoucherComponent implements OnInit{

  subscriptions: Subscription[] = [];
  salesManUserList$: Observable<UserModel[]> = this.userStoreService.selectByRoleId();

  voucherForm: FormGroup<VoucherForm> = this.formBuilder.nonNullable.group({
    id: [{ value: 0, disabled: true }],
    companyName: [{ value: '', disabled: true }, Validators.required],
    driverName: [{ value: '', disabled: true }, Validators.required],
    guideName: [{ value: '', disabled: true }],
    comments: [{ value: '', disabled: true }],
    salesManId: [{ value: 0, disabled: true }, [Validators.required, (control: AbstractControl) => numberValidator(control, 'Sales Man')]],
    vehicleNumber: [{ value: '', disabled: true }],
    voucherCode: [{ value: '', disabled: true }, Validators.required],
    voucherDate: [{ value: '', disabled: true }, Validators.required]
  });

  get id() {
    return this.voucherForm.get('id') as FormControl;
  }

  get companyName() {
    return this.voucherForm.get('companyName') as FormControl;
  }

  get guideName() {
    return this.voucherForm.get('guideName') as FormControl;
  }

  get vehicleNumber() {
    return this.voucherForm.get('vehicleNumber') as FormControl;
  }

  get driverName() {
    return this.voucherForm.get('driverName') as FormControl;
  }

  get comments() {
    return this.voucherForm.get('comments') as FormControl;
  }

  get salesManId() {
    return this.voucherForm.get('salesManId') as FormControl;
  }

  get voucherCode() {
    return this.voucherForm.get('voucherCode') as FormControl;
  }

  get voucherDate() {
    return this.voucherForm.get('voucherDate') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: VoucherStoreService,
    private voucherService: VoucherService,
    private roleService: RoleService,
    private roleStoreService: RoleStoreService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private dateService: DateService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // get user role

    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.voucherService.getVoucherNo(),
        this.voucherService.getAll(),
        this.roleService.getAll(),
        this.userService.getAll(),
      ]).pipe(
        tap(([params, voucherCode]) => {
          if (params['id']) {
            const voucherId = Number(params['id']);
            // console.log(voucherCode);
            const voucher = this.store.getById(voucherId) ?? createVoucherModel({voucherCode: voucherCode});
            
            this.voucherForm.setValue({
              id: voucher.id,
              companyName: voucher.companyName,
              driverName: voucher.driverName,
              guideName: voucher.guideName,
              vehicleNumber: voucher.vehicleNumber,
              salesManId: voucher.salesManId,
              comments: voucher.comments,
              voucherCode: voucher.voucherCode,
              voucherDate: this.dateService.formatDateToInput(new Date(voucher.voucherDate))
            })
          }
        })
      ).subscribe()
    );
  }
}
