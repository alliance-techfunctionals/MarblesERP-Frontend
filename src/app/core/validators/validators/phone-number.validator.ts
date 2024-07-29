import { AbstractControl } from '@angular/forms';

export function validatePhoneNumberFormat(control: AbstractControl): { [key: string]: any } | null {
    if (control.value !== '') {
        const phoneNumberRegExp = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/);
        const isValid: boolean = phoneNumberRegExp.test(control.value);
        return isValid ? null : { message: 'Please enter a valid phone number' };
    }
    return null;
}