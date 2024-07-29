import { FormArray, FormControl } from '@angular/forms';
import { Role, createRoleModel } from '../role/role.model';

export interface UserModel {
  id: number;
  name: string;
  gender: string;
  mobileNumberList: string[];
  residentialAddress: string;
  country: string;
  city: string;
  isDeleted: boolean;
  createdOn: Date;
  roleId: number;
  pinCode: string;
  emailAddressList: string[];
  state: string;
  password: string;
}


export function createUserModel({
  id = 0,
  name = '',
  gender = 'M',
  mobileNumberList = [],
  residentialAddress = '',
  country = 'India',
  city = 'Agra',
  roleId = 0,
  emailAddressList = [],
  pinCode = '',
  state = '',
  password = '',
  isDeleted = false,
  createdOn = new Date()
}: Partial<UserModel>) {
  return {
    id,
    name,
    gender,
    mobileNumberList,
    residentialAddress,
    country,
    city,
    roleId,
    emailAddressList,
    pinCode,
    state,
    password,
    isDeleted,
    createdOn
  } as UserModel;
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
