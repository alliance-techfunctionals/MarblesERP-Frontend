import { FormArray, FormControl } from '@angular/forms';
import { Role, createRoleModel } from '../role/role.model';

export interface DeliveryPartnerModel {
  id: number;
  name: string;
  url: string;
  redirectUrl: string;
  createdOn: Date;
}


export function createDeliveryPartnerModel({
  id = 0,
  name = '',
  url = '',
  redirectUrl = '',
  createdOn = new Date(),
}: Partial<DeliveryPartnerModel>) {
  return {
    id,
    name,
    url,
    redirectUrl,
    createdOn,
  } as DeliveryPartnerModel;
}


export interface UserForm {
  id: FormControl<number>;
  name: FormControl<string>;
  roleId: FormControl<number>;
  gender: FormControl<string>;
  mobileNumberList: FormArray;
  residentialAddress: FormControl<string>;
  country: FormControl<string>;
  city: FormControl<string>;
  pinCode: FormControl<string>;
  state: FormControl<string>;
  password: FormControl<string>;
  emailAddressList: FormArray;
}
