import { Component, OnDestroy, OnInit } from '@angular/core';
import { VoucherModel, dateFilterForm } from 'src/app/shared/store/voucher/voucher.model';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DateService } from 'src/app/shared/service/date.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { ColDef, IDateFilterParams } from 'ag-grid-community'; // Column Definition Type Interface
import {AgCustomButtonComponent} from 'src/app/shared/components/Button/ag-custom-button/ag-custom-button.component';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { environment } from 'src/environments/environment';
import { AgGridService } from 'src/app/shared/service/ag-grid.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export default class VoucherListComponent implements OnInit, OnDestroy {

  colDefs: ColDef[] = [
    {
      headerName: "Voucher Date",
      field: "voucherDate",
      filter: "agDateColumnFilter",
      floatingFilter: true,
      valueFormatter: params => {
        if (!params.value) return "N/A"; // Check if the date is null or undefined
        const date = new Date(params.value); // Convert the string date to a Date object
        return date.toLocaleString('en-US', {
          month: 'short', // "Jul"
          day: 'numeric', // "4"
          year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric', // "2024"
          hour: 'numeric', // "3"
          minute: 'numeric', // "39"
          hour12: true // Use 12-hour format
        });
      },
      minWidth: 200,
      filterParams: this.agGridService.filterParams
    },
    { headerName: "Voucher No.", field: "voucherCode", filter: true, floatingFilter: true },
    { headerName: "Company Name", field: "companyName", filter: true, floatingFilter: true },
    { headerName: "Guide", field: "guideName", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A" },
    { headerName: "Vehicle No.", field: "vehicleNumber", filter: true, floatingFilter: true, valueFormatter: params => params.value ? params.value : "N/A" },
    { headerName: "Salesman", field: "salesManName", filter: true, floatingFilter: true },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: AgCustomButtonComponent,
      cellRendererParams: {
        buttonsToShow: ['edit', 'delete' ,'view'],
        onEditClick: this.onEditClicked.bind(this),
        onDeleteClick: this.onDeleteClicked.bind(this),
        onViewClick: this.onViewClicked.bind(this),
      }
    }
  ];

  paginationPageSize = environment.tableRecordSize;

  onEditClicked(e: any) {
    console.log("hello", e.rowData);
    this.navigateVoucher(e.rowData.id);
  }

  onDeleteClicked(e: any) {
    this.openDeleteConfirmationModal(e.rowData);
  }
  onViewClicked(e: any) {
    this.router.navigate(['voucher/view', e.rowData.id]);
  }

  // subscription
  subscriptions: Subscription[] = [];
  // pagination config
  pagingConfig: Pagination = createPagination({});

  // vouhcers List
  voucherList$: Observable<VoucherModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll()
  ]).pipe(
    map(([vouchers, users]) => {
      return vouchers.map(voucher => {
        const user = users.find(user => user.id == voucher.salesManId);
        if(user){
          voucher.salesManName = user.name;
        }
        return voucher;
      }).sort((a, b) => {
        const dateA = new Date(a.voucherDate);
        const dateB = new Date(b.voucherDate);
        return dateB.getTime() - dateA.getTime();
      }); // sort desc by voucherDate
    })
  );

  // flag to show or dont show list of vouchers
  isUserAdmin: boolean = false; 

  dateFilterForm: FormGroup<dateFilterForm> = this.formBuilder.nonNullable.group({
    fromDate: [new Date(), Validators.required],
    toDate: [new Date(), Validators.required]
  });

  get fromDate(){
    return this.dateFilterForm.get('fromDate') as FormControl
  }

  get toDate(){
    return this.dateFilterForm.get('toDate') as FormControl
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: VoucherStoreService,
    private service: VoucherService,
    private authService: AuthService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private modalService: BsModalService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    protected dateService: DateService,
    private datePipe: DatePipe,
    public agGridService: AgGridService
  ) { }

  ngOnInit() {
    // check user admin or not
    this.isUserAdmin = this.authService.getRole() == 8000? false: true;
    this.subscriptions.push(
      this.service.getAll().subscribe(),
      this.userService.getAll().subscribe()
    )
  }

  // navigate to voucher
  protected navigateVoucher(id: number = 0): void {
    this.router.navigate(['voucher', id]);
  }

  openDeleteConfirmationModal(item: VoucherModel) {
    const initialState = {
      item,
      message: `delete voucher: ${item.voucherCode}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.service.deleteVoucher(item);
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  hoveredDate: NgbDate | null = null;
	fromDate1: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 10);
	toDate1: NgbDate | null = this.calendar.getToday();
  limitDate: NgbDate | null = this.calendar.getToday();
  
  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate1 = date;
		} else if (this.fromDate1 && !this.toDate1 && date   && (date.after(this.fromDate1) || date.equals(this.fromDate1))) {
			this.toDate1 = date;
		} else {
			this.toDate1 = null;
			this.fromDate1 = date;
		}
	}

  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate1) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate1) && date.before(this.toDate1);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate1) ||
			(this.toDate && date.equals(this.toDate1)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  filterClick(): void{
    this.fromDate.setValue(new Date(this.fromDate1!.year,this.fromDate1!.month - 1, this.fromDate1!.day))
    this.fromDate.setValue(this.datePipe.transform(this.fromDate.value,'yyyy-MM-ddTHH:mm:ss.SSSS'));
    this.toDate.setValue(new Date(this.toDate1!.year,this.toDate1!.month - 1, this.toDate1!.day, 23, 59, 59, 999))
    this.toDate.setValue(this.datePipe.transform(this.toDate.value,'yyyy-MM-ddTHH:mm:ss.SSSS'));
    
    if(this.dateFilterForm.valid || this.dateFilterForm.disabled){      
      this.voucherList$ = this.store.filterByDateRange(this.fromDate.value, this.toDate.value);
    }
  }

  resetClick(): void{
    this.voucherList$ = this.store.selectAll();
    this.fromDate.setValue(new Date());
    this.toDate.setValue(new Date());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
