import { Injectable } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})
export class DateService {

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ){}

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  formatDateToInput(date: Date): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
}
