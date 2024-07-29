import { AbstractControl } from '@angular/forms';

export function numberValidator(control: AbstractControl, message: string): { [key: string]: any } | null {
    return control?.value > 0 ? null : { message: `${message} is required` }
}
