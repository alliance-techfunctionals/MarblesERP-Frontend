import { Injectable } from '@angular/core';
import { ColDef, IDateFilterParams } from 'ag-grid-community';

@Injectable({
    providedIn: 'root'
})
export class AgGridService {

  constructor(
  ){}

  public defaultColDef: ColDef = {
    enableValue: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };

  filterParams: IDateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      //console.log(filterLocalDateAtMidnight, cellValue);
      if(cellValue == null || cellValue == undefined || cellValue == "")
          return -1;

        // Adjust the filterLocalDateAtMidnight to local time zone
        const timezoneOffset = filterLocalDateAtMidnight.getTimezoneOffset() * 60000; // Convert offset to milliseconds
        const adjustedDate = new Date(filterLocalDateAtMidnight.getTime() - timezoneOffset);
        const filterDateAsString = adjustedDate.toISOString().split('T')[0];

      // Assuming callValue is a string in ISO format
      const cellValueDate = new Date(cellValue);
      const cellValueDateAsString = cellValueDate.toISOString().split('T')[0];

      if (filterDateAsString === cellValueDateAsString) {
        return 0;
      }
      else if(cellValueDate < filterLocalDateAtMidnight){
        return -1;
      }
      else{
        return 1;
      }
    },
    minValidYear: 2000,
    maxValidYear: 3021,
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };
  
}