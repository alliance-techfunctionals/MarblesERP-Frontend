import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root'
})
export class MessageToastService {

	constructor(private toastr: ToastrService) { }

	handleSuccess(message: string) {
		this.toastr.success(message, 'Success');
	}

	success(message: string, title?: string) {
		this.toastr.success(message, title, {
			positionClass: 'toast-top-right'
		});
	}

	error(message: string, title?: string, override?: Partial<IndividualConfig>): void {
		this.toastr.error(message, title, {
			positionClass: 'toast-top-right',
			...override
		});
	}
}
