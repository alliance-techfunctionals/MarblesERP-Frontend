import { FormControl } from "@angular/forms";
import { Role, createRoleModel } from "../role/role.model";

export interface voucher{
  id: number;
  voucherCode: string;
}

export interface VoucherModel {
  id: number;
  companyName: string;
  driverName: string;
  guideName: string;
  vehicleNumber: string;
  createdOn: Date;
  salesManId: number;
  comments: string;
  voucherCode: string;
  voucherDate: Date;

  // columns for ag-grid
  salesManName: string;
}

export function createVoucherModel({
  id = 0,
  companyName = '',
  driverName = '',
  guideName = '',
  vehicleNumber = '',
  createdOn = new Date(),
  salesManId = 0,
  comments = '',
  voucherCode = '',
  voucherDate = new Date()
}: Partial<VoucherModel>) {
  return {
    id,
    companyName,
    driverName,
    guideName,
    vehicleNumber,
    createdOn,
    salesManId,
    comments,
    voucherCode,
    voucherDate
  } as VoucherModel;
}

export interface VoucherForm {
  companyName: FormControl<string>,
  id: FormControl<number>,
  driverName: FormControl<string>,
  vehicleNumber: FormControl<string>,
  salesManId: FormControl<number>,
  comments: FormControl<string>,
  guideName: FormControl<string>,
  voucherCode:FormControl<string>,
  voucherDate: FormControl<string>
}

export interface dateFilterForm {
  fromDate: FormControl<Date>,
  toDate: FormControl<Date>
}