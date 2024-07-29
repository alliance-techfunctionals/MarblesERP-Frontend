import { FormArray, FormControl } from '@angular/forms';
import { Role, createRoleModel } from '../role/role.model';

export interface SignInModel {
  mobileNumber: string;
  password: string;
}


export function createSignInModel({
  mobileNumber = '',
  password = ''
}: Partial<SignInModel>) {
  return {
    mobileNumber,
    password
  } as SignInModel;
}


export interface SignInForm {
  mobileNo: FormControl<string>;
  password: FormControl<string>;
}
