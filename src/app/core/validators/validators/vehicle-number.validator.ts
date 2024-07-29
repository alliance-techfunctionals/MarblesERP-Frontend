import { AbstractControl } from '@angular/forms';

export function validateVehicleNumberFormat(control: AbstractControl): { [key: string]: any } | null {
    if (control.value !== '') {
        const vehicleNumberRegExp = new RegExp(/^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/);
        const isValid: boolean = vehicleNumberRegExp.test(control.value);
        return isValid ? null : { message: 'Please enter a valid Vehicle Number' };
    }
    return null;
}