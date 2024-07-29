import { AbstractControl } from '@angular/forms';

export function validatePincodeFormat(control: AbstractControl): { [key: string]: any } | null {
    if (control.value !== '') {
        const pinCodeRegExp = new RegExp(/^[1-9][0-9]{5}$/);
        const isValid: boolean = pinCodeRegExp.test(control.value);
        return isValid ? null : { message: 'Please enter a valid pincode' };
    }
    return null;
}