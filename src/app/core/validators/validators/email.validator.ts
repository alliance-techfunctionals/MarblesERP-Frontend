import { AbstractControl } from '@angular/forms';

export function validateEmailFormat(control: AbstractControl): { [key: string]: any } | null {
	if (control.value !== '') {
		const emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		const isValid: boolean = emailRegExp.test(control.value);
		return isValid ? null : { message: 'Please enter a valid email address' };
	}
	return null;
}
