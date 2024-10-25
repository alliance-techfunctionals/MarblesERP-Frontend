import { CurrencyPipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PrimeNGConfig } from "primeng/api";
import { combineLatest, map, Observable, Subscription, tap } from "rxjs";
import { OrderStatusService } from "src/app/shared/service/order-status.service";
import { PaymentStatusService } from "src/app/shared/service/payment-status.service";
import { DesignService } from "src/app/shared/store/design/design.service";
import { QualityService } from "src/app/shared/store/quality/quality.service";
import { RoleService } from "src/app/shared/store/role/role.service";
import { SaleModel } from "src/app/shared/store/sales/sale.model";
import { SaleService } from "src/app/shared/store/sales/sale.service";
import { SaleStoreService } from "src/app/shared/store/sales/sale.store";
import { UserModel } from "src/app/shared/store/user/user.model";
import { UserService } from "src/app/shared/store/user/user.service";
import { UserStoreService } from "src/app/shared/store/user/user.store";
import { VoucherModel } from "src/app/shared/store/voucher/voucher.model";
import { VoucherService } from "src/app/shared/store/voucher/voucher.service";
import { VoucherStoreService } from "src/app/shared/store/voucher/voucher.store";

const MONTH = 30 * 24 * 60 * 60 * 1000; // Define MONTH constant

@Component({
  selector: "app-sale-analysis",
  templateUrl: "./sale-analysis.component.html",
  styleUrls: ["./sale-analysis.component.scss"],
})
export default class SaleAnalysisComponent implements OnInit {
  analysisForm: FormGroup;
  showDateFields = true;
  showYearField = false;
  comparisonChartData: any;
  chartOptions: any;

  basicData: any;
  lineBasicData: any;
  basicOptions: any;

  saleList$: Observable<SaleModel[]> = combineLatest([
    this.store.selectAll(),
    this.userStoreService.selectAll(),
    this.voucherStoreService.selectAll(),
  ]).pipe(
    map(([sales, users, vouchers]) => {
      return sales
        .map((sale) => {
          sales.forEach((sale) => {
            sale.salesManName =
              users.find((user) => user.id === sale.salesManId)?.name || "N/A";
            sale.voucherCode =
              vouchers.find((voucher) => voucher.id === sale.voucherId)
                ?.voucherCode || "N/A";
            sale.customerName =
              users.find((user) => user.id === sale.customerId)?.name || "N/A";
            sale.orderStatusName =
              this.orderStatusService.getOrderStatusDisplayName(
                sale.orderStatus
              );
            sale.paymentStatusName =
              this.paymentStatusService.getPaymentStatusDisplayName(
                sale.paymentStatus
              );
            sale.mobileNumberList =
              users.find((user) => user.id === sale.customerId)
                ?.mobileNumberList || [];
          });
          return sale;
        })
        .sort((a, b) => {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        }); // sort desc by id
    })
  );

  voucherList$: Observable<VoucherModel[]> = combineLatest([
    this.voucherStoreService.selectAll(),
    this.userStoreService.selectAll(),
  ]).pipe(
    map(([vouchers, users]) => {
      return vouchers
        .map((voucher) => {
          const user = users.find((user) => user.id == voucher.salesManId);
          if (user) {
            voucher.salesManName = user.name;
          }
          return voucher;
        })
        .sort((a, b) => {
          const dateA = new Date(a.voucherDate);
          const dateB = new Date(b.voucherDate);
          return dateB.getTime() - dateA.getTime();
        }); // sort desc by voucherDate
    })
  );

  // users List
  userList$: Observable<UserModel[]> =
    this.userStoreService.selectByRoleId(2000);

  constructor(
    private store: SaleStoreService,
    private userStoreService: UserStoreService,
    private voucherStoreService: VoucherStoreService,
    private orderStatusService: OrderStatusService,
    private paymentStatusService: PaymentStatusService,
    private fb: FormBuilder,
    private saleService: SaleService,
    private roleService: RoleService,
    private designService: DesignService,
    private qualityService: QualityService,
    private voucherService: VoucherService,
    private userService: UserService,
    private primengConfig: PrimeNGConfig,
    private cd: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe
  ) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startFinancialYear =
      today.getMonth() >= 3 ? currentYear : currentYear - 1;
    const startDate = new Date(startFinancialYear, 3, 1); // April 1st

    const endDate = today;
    // Manually format the startDate to YYYY-MM-DD
    const formattedStartDate = `${startDate.getFullYear()}-${String(
      startDate.getMonth() + 1
    ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;

    this.analysisForm = this.fb.group({
      typeOfChart: ["0"],
      startDate: [formattedStartDate], // Format as YYYY-MM-DD
      endDate: [endDate.toISOString().split("T")[0]], // Format as YYYY-MM-DD
      numberOfYears: [1],
    });
  }
  // Sale Overview
  currentMonthSalesCount = 0;
  previousMonthSalesCount = 0;
  salePercentageChange = 0;
  // Voucher Overview
  currentMonthVouchersCount = 0;
  previousMonthVouchersCount = 0;
  voucherPercentageChange = 0;
  // Linked Sale Overview
  currentMonthSalesWithVoucherCount = 0;
  previousMonthSalesWithVoucherCount = 0;
  linkedSalePercentageChange = 0;
  // Cancelled Sale Overview
  currentMonthCanceledSalesCount = 0;
  previousMonthCanceledSalesCount = 0;
  cancelledPercentageChange = 0;
  // Revenue Overview
  currentMonthRevenue = 0;
  previousMonthRevenue = 0;

  currentMonthRevenueString = "";
  previousMonthRevenueString = "";
  revenuePercentageChange = 0;

  // Country Name Overview
  currentMonthCountry = "";
  previousMonthCountry = "";

  generateOverviewData(sales: SaleModel[], vouchers: VoucherModel[]): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    let currentMonthSalesCount = 0;
    let previousMonthSalesCount = 0;
    let currentMonthVouchersCount = 0;
    let previousMonthVouchersCount = 0;
    let currentMonthSalesWithVoucherCount = 0;
    let previousMonthSalesWithVoucherCount = 0;
    let currentMonthCanceledSalesCount = 0;
    let previousMonthCanceledSalesCount = 0;

    sales.forEach((sale) => {
      const saleDate = new Date(sale.orderDate);
      const saleMonth = saleDate.getMonth();
      const saleYear = saleDate.getFullYear();

      if (saleYear === currentYear && saleMonth === currentMonth) {
        currentMonthSalesCount++;
        if (sale.voucherId !== null) {
          currentMonthSalesWithVoucherCount++;
        }
        // if (sale.isCancelled) {
        //   currentMonthCanceledSalesCount++;
        // }
      } else if (saleYear === previousYear && saleMonth === previousMonth) {
        previousMonthSalesCount++;
        if (sale.voucherId !== null) {
          previousMonthSalesWithVoucherCount++;
        }
        // if (sale.isCancelled) {
        //   previousMonthCanceledSalesCount++;
        // }
      }
    });

    vouchers.forEach((voucher) => {
      const voucherDate = new Date(voucher.voucherDate);
      const voucherMonth = voucherDate.getMonth();
      const voucherYear = voucherDate.getFullYear();

      if (voucherYear === currentYear && voucherMonth === currentMonth) {
        currentMonthVouchersCount++;
      } else if (
        voucherYear === previousYear &&
        voucherMonth === previousMonth
      ) {
        previousMonthVouchersCount++;
      }
    });

    this.currentMonthSalesCount = currentMonthSalesCount;
    this.previousMonthSalesCount = previousMonthSalesCount;
    this.salePercentageChange = parseFloat(
      (
        (Math.abs(currentMonthSalesCount - previousMonthSalesCount) /
          previousMonthSalesCount) *
        100
      ).toFixed(1)
    );

    this.salePercentageChange =
      isNaN(this.salePercentageChange) || !isFinite(this.salePercentageChange)
        ? 0
        : this.salePercentageChange;

    this.currentMonthVouchersCount = currentMonthVouchersCount;
    this.previousMonthVouchersCount = previousMonthVouchersCount;

    this.voucherPercentageChange = parseFloat(
      (
        (Math.abs(currentMonthVouchersCount - previousMonthVouchersCount) /
          previousMonthVouchersCount) *
        100
      ).toFixed(1)
    );

    this.voucherPercentageChange =
      isNaN(this.voucherPercentageChange) ||
      !isFinite(this.voucherPercentageChange)
        ? 0
        : this.voucherPercentageChange;

    this.currentMonthSalesWithVoucherCount = currentMonthSalesWithVoucherCount;
    this.previousMonthSalesWithVoucherCount =
      previousMonthSalesWithVoucherCount;

    this.linkedSalePercentageChange = parseFloat(
      (
        (Math.abs(
          currentMonthSalesWithVoucherCount - previousMonthSalesWithVoucherCount
        ) /
          previousMonthSalesWithVoucherCount) *
        100
      ).toFixed(1)
    );

    this.linkedSalePercentageChange =
      isNaN(this.linkedSalePercentageChange) ||
      !isFinite(this.linkedSalePercentageChange)
        ? 0
        : this.linkedSalePercentageChange;

    this.currentMonthCanceledSalesCount = currentMonthCanceledSalesCount;
    this.previousMonthCanceledSalesCount = previousMonthCanceledSalesCount;

    this.cancelledPercentageChange = parseFloat(
      (
        (Math.abs(
          currentMonthCanceledSalesCount - previousMonthCanceledSalesCount
        ) /
          previousMonthCanceledSalesCount) *
        100
      ).toFixed(1)
    );

    this.cancelledPercentageChange =
      isNaN(this.cancelledPercentageChange) ||
      !isFinite(this.cancelledPercentageChange)
        ? 0
        : this.cancelledPercentageChange;

    this.revenueOverviewDataHelper(sales);
    this.countryOverviewHelper(sales);
  }

  revenueOverviewDataHelper(sales: SaleModel[]) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();

    let currentMonthRevenue = 0;
    let previousMonthRevenue = 0;

    sales.forEach((sale) => {
      sale.details.forEach((detail) => {
        const saleDate = new Date(sale.orderDate); // Assuming sale.date is a valid date string or Date object
        const saleMonth = saleDate.getMonth();
        const saleYear = saleDate.getFullYear();

        if (saleYear === currentYear && saleMonth === currentMonth) {
          currentMonthRevenue += detail.amount || 0;
        } else if (
          saleYear === previousMonthYear &&
          saleMonth === previousMonth
        ) {
          previousMonthRevenue += detail.amount || 0;
        }
      });
    });

    this.currentMonthRevenue = currentMonthRevenue;
    this.previousMonthRevenue = previousMonthRevenue;

    this.currentMonthRevenue = Math.round(currentMonthRevenue);
    this.previousMonthRevenue = Math.round(previousMonthRevenue);

    this.currentMonthRevenueString = this.currencyPipe.transform(
      this.currentMonthRevenue,
      "₹",
      "symbol",
      "1.0-0"
    )!;

    this.previousMonthRevenueString = this.currencyPipe.transform(
      this.previousMonthRevenue,
      "₹",
      "symbol",
      "1.0-0"
    )!;

    this.revenuePercentageChange = parseFloat(
      (
        (Math.abs(currentMonthRevenue - previousMonthRevenue) /
          previousMonthRevenue) *
        100
      ).toFixed(1)
    );

    this.revenuePercentageChange =
      isNaN(this.revenuePercentageChange) ||
      !isFinite(this.revenuePercentageChange)
        ? 0
        : this.revenuePercentageChange;
  }

  countryOverviewHelper(sales: SaleModel[]) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();

    const currentMonthSalesByCountry: { [country: string]: number } = {};
    const previousMonthSalesByCountry: { [country: string]: number } = {};

    sales.forEach((sale) => {
      const saleDate = new Date(sale.orderDate); // Assuming sale.date is a valid date string or Date object
      const saleMonth = saleDate.getMonth();
      const saleYear = saleDate.getFullYear();
      const country = sale.country; // Assuming sale.country contains the country name

      if (saleYear === currentYear && saleMonth === currentMonth) {
        if (!currentMonthSalesByCountry[country]) {
          currentMonthSalesByCountry[country] = 0;
        }
        currentMonthSalesByCountry[country]++;
      } else if (
        saleYear === previousMonthYear &&
        saleMonth === previousMonth
      ) {
        if (!previousMonthSalesByCountry[country]) {
          previousMonthSalesByCountry[country] = 0;
        }
        previousMonthSalesByCountry[country]++;
      }
    });

    const maxCurrentMonthCountry = Object.keys(
      currentMonthSalesByCountry
    ).reduce(
      (a, b) =>
        currentMonthSalesByCountry[a] > currentMonthSalesByCountry[b] ? a : b,
      ""
    );

    const maxPreviousMonthCountry = Object.keys(
      previousMonthSalesByCountry
    ).reduce(
      (a, b) =>
        previousMonthSalesByCountry[a] > previousMonthSalesByCountry[b] ? a : b,
      ""
    );

    this.currentMonthCountry = maxCurrentMonthCountry;
    this.previousMonthCountry = maxPreviousMonthCountry;
  }

  // subscription
  subscriptions: Subscription[] = [];
  monthlySalesData: { monthYear: string; noOfSales: number }[] = [];

  generateSalesChartData(sales: SaleModel[]): void {
    const salesCountByMonth: { monthYear: string; noOfSales: number }[] = [];

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = salesCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfSales++;
      } else {
        salesCountByMonth.push({ monthYear, noOfSales: 1 });
      }
    });

    this.monthlySalesData = salesCountByMonth;

    // Create arrays for months and noOfSales
    const months = this.monthlySalesData
      .map((data) => data.monthYear)
      .reverse();
    const noOfSales = this.monthlySalesData
      .map((data) => data.noOfSales)
      .reverse();

    this.basicData.datasets = [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];
    this.lineBasicData.datasets = [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];

    this.basicData.labels = months;
    this.lineBasicData.labels = months;
    this.basicData.datasets[0].data = noOfSales;
    this.lineBasicData.datasets[0].data = noOfSales;
    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Month";

    // Trigger change detection
    this.cd.detectChanges();

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };
  }

  generateVoucherChartData(vouchers: VoucherModel[]) {
    const vouchersCountByMonth: { monthYear: string; noOfVouchers: number }[] =
      [];

    vouchers.forEach((voucher) => {
      const date = new Date(voucher.voucherDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = vouchersCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfVouchers++;
      } else {
        vouchersCountByMonth.push({ monthYear, noOfVouchers: 1 });
      }
    });

    // Create arrays for months and noOfSales
    const months = vouchersCountByMonth.map((data) => data.monthYear).reverse();
    const noOfSales = vouchersCountByMonth
      .map((data) => data.noOfVouchers)
      .reverse();

    this.basicData.datasets = [
      {
        label: "Vouchers",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];
    this.lineBasicData.datasets = [
      {
        label: "Vouchers",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];

    this.basicData.labels = months;
    this.basicData.datasets[0].data = noOfSales;

    this.lineBasicData.labels = months;
    this.lineBasicData.datasets[0].data = noOfSales;
    this.basicOptions.scales.y.title.text = "No of Vouchers";
    this.basicOptions.scales.x.title.text = "Month";

    // Trigger change detection
    this.cd.detectChanges();

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };
  }

  generateCompareChartData(sales: SaleModel[], vouchers: VoucherModel[]) {
    const vouchersCountByMonth: { monthYear: string; noOfVouchers: number }[] =
      [];
    const salesCountByMonth: { monthYear: string; noOfSales: number }[] = [];

    vouchers.forEach((voucher) => {
      const date = new Date(voucher.voucherDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = vouchersCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfVouchers++;
      } else {
        vouchersCountByMonth.push({ monthYear, noOfVouchers: 1 });
      }
    });

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = salesCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfSales++;
      } else {
        salesCountByMonth.push({ monthYear, noOfSales: 1 });
      }
    });

    // Extract unique month-year combinations from both datasets
    const allMonthYears = Array.from(
      new Set([
        ...vouchersCountByMonth.map((data) => data.monthYear),
        ...salesCountByMonth.map((data) => data.monthYear),
      ])
    );

    // Ensure both datasets have entries for all unique month-year combinations
    allMonthYears.forEach((monthYear) => {
      if (!vouchersCountByMonth.find((data) => data.monthYear === monthYear)) {
        vouchersCountByMonth.push({ monthYear, noOfVouchers: 0 });
      }
      if (!salesCountByMonth.find((data) => data.monthYear === monthYear)) {
        salesCountByMonth.push({ monthYear, noOfSales: 0 });
      }
    });

    // Sort datasets by month-year in reverse order
    vouchersCountByMonth.sort(
      (a, b) =>
        new Date(`1 ${b.monthYear}`).getTime() -
        new Date(`1 ${a.monthYear}`).getTime()
    );
    salesCountByMonth.sort(
      (a, b) =>
        new Date(`1 ${b.monthYear}`).getTime() -
        new Date(`1 ${a.monthYear}`).getTime()
    );

    // Create arrays for month-year labels and counts
    const monthYears = vouchersCountByMonth
      .map((data) => data.monthYear)
      .reverse();
    const noOfVouchers = vouchersCountByMonth
      .map((data) => data.noOfVouchers)
      .reverse();
    const noOfSales = salesCountByMonth.map((data) => data.noOfSales).reverse();

    this.basicData.labels = monthYears;
    this.lineBasicData.labels = monthYears;
    this.basicOptions.scales.y.title.text = "No of Transactions";
    this.basicOptions.scales.x.title.text = "Month";

    this.basicData.datasets = [
      {
        label: "Vouchers",
        data: noOfVouchers,
        fill: true,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: noOfSales,
        fill: true,
        borderColor: "#69CEAD",
        backgroundColor: "#69CEAD",
        borderWidth: 1,
      },
    ];

    this.lineBasicData.datasets = [
      {
        label: "Vouchers",
        data: noOfVouchers,
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: noOfSales,
        fill: false,
        borderColor: "#69CEAD",
        backgroundColor: "#69CEAD",
        borderWidth: 1,
      },
    ];

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };
    this.cd.detectChanges();
  }

  // Year on Year comparison chart
  generateYOYSaleComparisonChartData(
    sales: SaleModel[],
    selectedYears: number
  ): void {
    const salesCountByMonthYear: { monthYear: string; noOfSales: number }[] =
      [];

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = salesCountByMonthYear.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfSales++;
      } else {
        salesCountByMonthYear.push({ monthYear, noOfSales: 1 });
      }
    });

    // Ensure all months from April to March are included
    const allMonths = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    // Generate data for the selected number of years
    const datasets = [];
    for (let i = 0; i < selectedYears; i++) {
      const startYear = new Date().getFullYear() - i;
      const endYear = startYear + 1;
      const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;
      const data = allMonths.map((month) => {
        const monthYear =
          month === "Jan" || month === "Feb" || month === "Mar"
            ? `${month} ${endYear}`
            : `${month} ${startYear}`;
        const monthData = salesCountByMonthYear.find(
          (data) => data.monthYear === monthYear
        );
        return monthData ? monthData.noOfSales : 0;
      });

      datasets.push({
        label: financialYear,
        data,
        fill: true,
        borderColor: this.getColor(i),
        backgroundColor: this.getColor(i),
        borderWidth: 1,
      });
    }

    this.basicData.labels = allMonths;
    this.basicData.datasets = datasets;

    datasets.forEach((dataset: any) => {
      dataset.fill = false;
    });
    this.lineBasicData.labels = allMonths;
    this.lineBasicData.datasets = datasets;
    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Month";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    this.cd.detectChanges();
  }

  getColor(index: number): string {
    const colors = ["#42A5F5", "#69CEAD", "#FFA726", "#FF6384"];
    return colors[index % colors.length];
  }

  generateYOYVoucherComparisonChartData(
    vouchers: VoucherModel[],
    selectedYears: number
  ): void {
    const vouchersCountByMonthYear: {
      monthYear: string;
      noOfVouchers: number;
    }[] = [];

    vouchers.forEach((voucher) => {
      const date = new Date(voucher.voucherDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = vouchersCountByMonthYear.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        existingMonthData.noOfVouchers++;
      } else {
        vouchersCountByMonthYear.push({ monthYear, noOfVouchers: 1 });
      }
    });

    // Ensure all months from April to March are included
    const allMonths = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    // Generate data for the selected number of years
    const datasets = [];
    for (let i = 0; i < selectedYears; i++) {
      const startYear = new Date().getFullYear() - i;
      const endYear = startYear + 1;
      const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;
      const data = allMonths.map((month) => {
        const monthYear =
          month === "Jan" || month === "Feb" || month === "Mar"
            ? `${month} ${endYear}`
            : `${month} ${startYear}`;
        const monthData = vouchersCountByMonthYear.find(
          (data) => data.monthYear === monthYear
        );
        return monthData ? monthData.noOfVouchers : 0;
      });

      datasets.push({
        label: financialYear,
        data,
        fill: true,
        borderColor: this.getColor(i),
        backgroundColor: this.getColor(i),
        borderWidth: 1,
      });
    }

    this.basicData.labels = allMonths;
    this.basicData.datasets = datasets;

    datasets.forEach((dataset: any) => {
      dataset.fill = false;
    });

    this.lineBasicData.labels = allMonths;
    this.lineBasicData.datasets = datasets;
    this.basicOptions.scales.y.title.text = "No of Vouchers";
    this.basicOptions.scales.x.title.text = "Month";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    this.cd.detectChanges();
  }

  generateSalesBySalesmanChartData(
    sales: SaleModel[],
    users: UserModel[]
  ): void {
    const salesCountBySalesman: { salesManId: number; noOfSales: number }[] =
      [];

    sales.forEach((sale) => {
      const existingSalesmanData = salesCountBySalesman.find(
        (data) => data.salesManId === sale.salesManId
      );

      if (existingSalesmanData) {
        existingSalesmanData.noOfSales++;
      } else {
        salesCountBySalesman.push({
          salesManId: sale.salesManId,
          noOfSales: 1,
        });
      }
    });

    const salesBySalesman = salesCountBySalesman
      .map((salesmanData) => {
        const user = users.find((user) => user.id === salesmanData.salesManId);
        if (!user) {
          // Log the order numbers of sales made by unknown users
          const unknownSales = sales.filter(
            (sale) => sale.salesManId === salesmanData.salesManId
          );
          unknownSales.forEach((sale) => {
            console.log(`Unknown Salesman for Order No: ${sale.orderNumber}`);
          });
          return null; // Exclude sales with no valid salesman
        }
        return {
          name: user.name,
          noOfSales: salesmanData.noOfSales,
        };
      })
      .filter(
        (data): data is { name: string; noOfSales: number } => data !== null
      );

    const labels = salesBySalesman.map((data) => data.name);
    const data = salesBySalesman.map((data) => data.noOfSales);

    this.basicData.labels = labels;
    this.basicData.datasets = [
      {
        label: "Sales by Salesman",
        data,
        fill: true,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.lineBasicData.labels = labels;
    this.lineBasicData.datasets = [
      {
        label: "Sales by Salesman",
        data,
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Salesman Name";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    this.cd.detectChanges();
  }

  generateVouchersBySalesmanChartData(
    sales: VoucherModel[],
    users: UserModel[]
  ): void {
    const vouchersCountBySalesman: {
      salesManId: number;
      noOfVouchers: number;
    }[] = [];

    sales.forEach((sale) => {
      const existingSalesmanData = vouchersCountBySalesman.find(
        (data) => data.salesManId === sale.salesManId
      );

      if (existingSalesmanData) {
        existingSalesmanData.noOfVouchers++;
      } else {
        vouchersCountBySalesman.push({
          salesManId: sale.salesManId,
          noOfVouchers: 1,
        });
      }
    });

    const salesBySalesman = vouchersCountBySalesman
      .map((salesmanData) => {
        const user = users.find((user) => user.id === salesmanData.salesManId);
        if (!user) {
          // Log the order numbers of sales made by unknown users
          const unknownSales = sales.filter(
            (sale) => sale.salesManId === salesmanData.salesManId
          );
          unknownSales.forEach((sale) => {
            console.log(`Unknown Salesman for Voucher No: ${sale.voucherCode}`);
          });
          return null; // Exclude sales with no valid salesman
        }
        return {
          name: user.name,
          noOfVouchers: salesmanData.noOfVouchers,
        };
      })
      .filter(
        (data): data is { name: string; noOfVouchers: number } => data !== null
      );

    const labels = salesBySalesman.map((data) => data.name);
    const data = salesBySalesman.map((data) => data.noOfVouchers);

    this.basicData.labels = labels;
    this.basicData.datasets = [
      {
        label: "Vouchers by Salesman",
        data,
        fill: true,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.lineBasicData.labels = labels;
    this.lineBasicData.datasets = [
      {
        label: "Vouchers by Salesman",
        data,
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.basicOptions.scales.y.title.text = "No of Vouchers";
    this.basicOptions.scales.x.title.text = "Salesman Name";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };
    this.cd.detectChanges();
  }

  generateSalesAndVouchersBySalesmanChartData(
    sales: SaleModel[],
    vouchers: VoucherModel[],
    users: UserModel[]
  ): void {
    const salesCountBySalesman: { salesManId: number; noOfSales: number }[] =
      [];
    const vouchersCountBySalesman: {
      salesManId: number;
      noOfVouchers: number;
    }[] = [];

    // Count sales by salesman
    sales.forEach((sale) => {
      const existingSalesmanData = salesCountBySalesman.find(
        (data) => data.salesManId === sale.salesManId
      );

      if (existingSalesmanData) {
        existingSalesmanData.noOfSales++;
      } else {
        salesCountBySalesman.push({
          salesManId: sale.salesManId,
          noOfSales: 1,
        });
      }
    });

    // Count vouchers by salesman
    vouchers.forEach((voucher) => {
      const existingSalesmanData = vouchersCountBySalesman.find(
        (data) => data.salesManId === voucher.salesManId
      );

      if (existingSalesmanData) {
        existingSalesmanData.noOfVouchers++;
      } else {
        vouchersCountBySalesman.push({
          salesManId: voucher.salesManId,
          noOfVouchers: 1,
        });
      }
    });

    // Combine sales and vouchers data by salesman
    const combinedData = users.map((user) => {
      const salesData = salesCountBySalesman.find(
        (data) => data.salesManId === user.id
      );
      const vouchersData = vouchersCountBySalesman.find(
        (data) => data.salesManId === user.id
      );

      return {
        name: user.name,
        noOfSales: salesData ? salesData.noOfSales : 0,
        noOfVouchers: vouchersData ? vouchersData.noOfVouchers : 0,
      };
    });

    const labels = combinedData.map((data) => data.name);
    const salesData = combinedData.map((data) => data.noOfSales);
    const vouchersData = combinedData.map((data) => data.noOfVouchers);

    this.basicData.labels = labels;
    this.basicData.datasets = [
      {
        label: "Vouchers",
        data: vouchersData,
        fill: true,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: salesData,
        fill: true,
        borderColor: "#69CEAD",
        backgroundColor: "#69CEAD",
        borderWidth: 1,
      },
    ];

    this.lineBasicData.labels = labels;
    this.lineBasicData.datasets = [
      {
        label: "Vouchers",
        data: vouchersData,
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: salesData,
        fill: false,
        borderColor: "#69CEAD",
        backgroundColor: "#69CEAD",
        borderWidth: 1,
      },
    ];

    this.basicOptions.scales.y.title.text = "No of Transactions";
    this.basicOptions.scales.x.title.text = "Salesman Name";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    this.cd.detectChanges();
  }

  generateTypesOfSalesChartData(sales: SaleModel[]): void {
    const salesCountByMonth: {
      monthYear: string;
      handCarrySales: number;
      textileSales: number;
      remainingSales: number;
    }[] = [];

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = salesCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        if (sale.isHandCarry) {
          existingMonthData.handCarrySales++;
          // } else if (sale.isTextile) {
          //   existingMonthData.textileSales++;
        } else {
          existingMonthData.remainingSales++;
        }
      } else {
        salesCountByMonth.push({
          monthYear,
          handCarrySales: sale.isHandCarry ? 1 : 0,
          // textileSales: sale.isTextile ? 1 : 0,
          textileSales: 0,
          // remainingSales: !sale.isHandCarry && !sale.isTextile ? 1 : 0
          remainingSales: !sale.isHandCarry ? 1 : 0,
        });
      }
    });

    const monthlySalesData: {
      monthYear: string;
      handCarrySales: number;
      textileSales: number;
      remainingSales: number;
    }[] = salesCountByMonth;

    // Create arrays for monthYear and sales counts
    const monthYears = monthlySalesData.map((data) => data.monthYear).reverse();
    const handCarrySales = monthlySalesData
      .map((data) => data.handCarrySales)
      .reverse();
    const textileSales = monthlySalesData
      .map((data) => data.textileSales)
      .reverse();
    const remainingSales = monthlySalesData
      .map((data) => data.remainingSales)
      .reverse();

    this.basicData.labels = monthYears;
    this.basicData.datasets = [
      {
        label: "Remaining Sales",
        data: remainingSales,
        backgroundColor: this.getColor(0),
      },
      {
        label: "Hand Carry Sales",
        data: handCarrySales,
        backgroundColor: this.getColor(1),
      },
      {
        label: "Textile Sales",
        data: textileSales,
        backgroundColor: this.getColor(2),
      },
    ];

    this.lineBasicData.labels = monthYears;
    this.lineBasicData.datasets = [
      {
        label: "Remaining Sales",
        data: remainingSales,
        backgroundColor: this.getColor(0),
        fill: false,
      },
      {
        label: "Hand Carry Sales",
        data: handCarrySales,
        backgroundColor: this.getColor(1),
        fill: false,
      },
      {
        label: "Textile Sales",
        data: textileSales,
        backgroundColor: this.getColor(2),
        fill: false,
      },
    ];
    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Month";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    // Trigger change detection
    this.cd.detectChanges();
  }

  // generateCancelledSalesChartData(sales: SaleModel[]): void {
  //   const salesCountByMonth: {
  //     monthYear: string;
  //     totalSales: number;
  //     canceledSales: number;
  //   }[] = [];

  //   sales.forEach((sale) => {
  //     const date = new Date(sale.orderDate);
  //     const month = date.toLocaleString("default", { month: "short" });
  //     const year = date.getFullYear();
  //     const monthYear = `${month} ${year}`;
  //     const existingMonthData = salesCountByMonth.find(
  //       (data) => data.monthYear === monthYear
  //     );

  //     if (existingMonthData) {
  //       existingMonthData.totalSales++;
  //       if (sale.isCancelled) {
  //         existingMonthData.canceledSales++;
  //       }
  //     } else {
  //       salesCountByMonth.push({
  //         monthYear,
  //         totalSales: 1,
  //         canceledSales: sale.isCancelled ? 1 : 0,
  //       });
  //     }
  //   });
  
  // const monthlySalesData: {
  //     monthYear: string;
  //     totalSales: number;
  //     canceledSales: number;
  //   }[] = salesCountByMonth;

  //   // Create arrays for monthYear and sales counts
  //   const monthYears = monthlySalesData.map((data) => data.monthYear).reverse();
  //   const totalSales = monthlySalesData
  //     .map((data) => data.totalSales)
  //     .reverse();
  //   const canceledSales = monthlySalesData
  //     .map((data) => data.canceledSales)
  //     .reverse();
  //   // Update the existing chart data

  //   this.basicOptions.scales.y.title.text = "No of Sales";
  //   this.basicOptions.scales.x.title.text = "Month";

  //   // Create a new chart for total and canceled sales
  //   this.basicData.labels = monthYears;
  //   this.basicData.datasets = [
  //     {
  //       label: "Total Sales",
  //       data: totalSales,
  //       backgroundColor: this.getColor(0),
  //     },
  //     {
  //       label: "Cancelled Sales",
  //       data: canceledSales,
  //       backgroundColor: this.getColor(1),
  //     },
  //   ];

  //   this.lineBasicData.labels = monthYears;
  //   this.lineBasicData.datasets = [
  //     {
  //       label: "Total Sales",
  //       data: totalSales,
  //       backgroundColor: this.getColor(0),
  //       fill: false,
  //     },
  //     {
  //       label: "Cancelled Sales",
  //       data: canceledSales,
  //       backgroundColor: this.getColor(1),
  //       fill: false,
  //     },
  //   ];

  //   this.basicData = { ...this.basicData };
  //   this.lineBasicData = { ...this.lineBasicData };
  //   // Trigger change detection
  //   this.cd.detectChanges();
  // }

  generateOrderStatusChartData(sales: SaleModel[]): void {
    const orderStatusCountByMonth: {
      monthYear: string;
      underProcess: number;
      toBeShipped: number;
      underShipment: number;
      delivered: number;
    }[] = [];

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = orderStatusCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      if (existingMonthData) {
        switch (sale.orderStatus) {
          case 5:
            existingMonthData.underProcess++;
            break;
          case 6:
            existingMonthData.toBeShipped++;
            break;
          case 7:
            existingMonthData.underShipment++;
            break;
          case 8:
            existingMonthData.delivered++;
            break;
          default:
            break;
        }
      } else {
        orderStatusCountByMonth.push({
          monthYear,
          underProcess: sale.orderStatus === 5 ? 1 : 0,
          toBeShipped: sale.orderStatus === 6 ? 1 : 0,
          underShipment: sale.orderStatus === 7 ? 1 : 0,
          delivered: sale.orderStatus === 8 ? 1 : 0,
        });
      }
    });

    const monthYears = orderStatusCountByMonth
      .map((data) => data.monthYear)
      .reverse();
    const underProcessCounts = orderStatusCountByMonth
      .map((data) => data.underProcess)
      .reverse();
    const toBeShippedCounts = orderStatusCountByMonth
      .map((data) => data.toBeShipped)
      .reverse();
    const underShipmentCounts = orderStatusCountByMonth
      .map((data) => data.underShipment)
      .reverse();
    const deliveredCounts = orderStatusCountByMonth
      .map((data) => data.delivered)
      .reverse();

    this.basicData.labels = monthYears;
    this.basicData.datasets = [
      {
        label: "Under Process",
        data: underProcessCounts,
        backgroundColor: this.getColor(0),
      },
      {
        label: "To Be Shipped",
        data: toBeShippedCounts,
        backgroundColor: this.getColor(1),
      },
      {
        label: "Under Shipment",
        data: underShipmentCounts,
        backgroundColor: this.getColor(2),
      },
      {
        label: "Delivered",
        data: deliveredCounts,
        backgroundColor: this.getColor(3),
      },
    ];

    this.lineBasicData.labels = monthYears;
    this.lineBasicData.datasets = [
      {
        label: "Under Process",
        data: underProcessCounts,
        backgroundColor: this.getColor(0),
        fill: false,
      },
      {
        label: "To Be Shipped",
        data: toBeShippedCounts,
        backgroundColor: this.getColor(1),
        fill: false,
      },
      {
        label: "Under Shipment",
        data: underShipmentCounts,
        backgroundColor: this.getColor(2),
        fill: false,
      },
      {
        label: "Delivered",
        data: deliveredCounts,
        backgroundColor: this.getColor(3),
        fill: false,
      },
    ];

    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Months";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    // Trigger change detection
    this.cd.detectChanges();
  }

  generateRevenueGeneratedChartData(sales: SaleModel[]) {
    const salesCountByMonth: { monthYear: string; revenueGenerated: number }[] =
      [];

    sales.forEach((sale) => {
      const date = new Date(sale.orderDate);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      const existingMonthData = salesCountByMonth.find(
        (data) => data.monthYear === monthYear
      );

      let amount = 0;
      sale.details.forEach((detail) => {
        if (detail.amount) {
          amount += Math.floor(detail.amount);
          console.log(
            `Order no - ${sale.orderNumber}, Amount - ${detail.amount}, Total -> ${amount}`
          );
        }
      });

      if (existingMonthData) {
        existingMonthData.revenueGenerated += amount;
      } else {
        salesCountByMonth.push({ monthYear, revenueGenerated: amount });
      }
    });

    let monthlySalesData = salesCountByMonth;

    // Create arrays for months and revenueGenerated
    const months = monthlySalesData.map((data) => data.monthYear);
    const revenueGenerated = monthlySalesData.map(
      (data) => data.revenueGenerated
    );

    this.basicData.datasets = [
      {
        label: "Revenue",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];
    this.lineBasicData.datasets = [
      {
        label: "Revenue",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#69AFFF",
        backgroundColor: "#69AFFF",
        borderWidth: 1,
      },
    ];

    this.basicData.labels = months;
    this.lineBasicData.labels = months;
    this.basicData.datasets[0].data = revenueGenerated;
    this.lineBasicData.datasets[0].data = revenueGenerated;
    this.basicOptions.scales.y.title.text = "Revenue Generated";
    this.basicOptions.scales.x.title.text = "Month";

    // Trigger change detection
    this.cd.detectChanges();

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };
  }

  generateCountryWiseSaleChartData(sales: SaleModel[]) {
    const salesCountByCountry: { country: string; noOfSales: number }[] = [];

    sales.forEach((sale) => {
      const existingCountryData = salesCountByCountry.find(
        (data) => data.country === sale.country
      );

      if (existingCountryData) {
        existingCountryData.noOfSales++;
      } else {
        salesCountByCountry.push({
          country: sale.country,
          noOfSales: 1,
        });
      }
    });

    const salesInCountry = salesCountByCountry;

    const labels = salesInCountry.map((data) => data.country);
    const data = salesInCountry.map((data) => data.noOfSales);

    this.basicData.labels = labels;
    this.basicData.datasets = [
      {
        label: "Sales in Country",
        data,
        fill: true,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.lineBasicData.labels = labels;
    this.lineBasicData.datasets = [
      {
        label: "Sales in Country",
        data,
        fill: false,
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        borderWidth: 1,
      },
    ];

    this.basicOptions.scales.y.title.text = "No of Sales";
    this.basicOptions.scales.x.title.text = "Country Name";

    this.basicData = { ...this.basicData };
    this.lineBasicData = { ...this.lineBasicData };

    this.cd.detectChanges();
  }

  filterData(formValue: any): void {
    let selectedOption = formValue.typeOfChart;
    let noOfYears = formValue.numberOfYears;
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);

    // if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) && (selectedOption != '3' || selectedOption!= '4')) {
    //   console.error('Invalid date format');
    // }
    combineLatest([
      this.saleList$,
      this.voucherList$,
      this.userList$,
    ]).subscribe(([sales, vouchers, users]) => {
      const filteredSales = sales.filter(
        (sale) =>
          new Date(sale.orderDate) >= startDate &&
          new Date(sale.orderDate) <= endDate
      );
      const filteredVouchers = vouchers.filter(
        (voucher) =>
          new Date(voucher.voucherDate) >= startDate &&
          new Date(voucher.voucherDate) <= endDate
      );

      if (selectedOption == "0") {
        this.generateSalesChartData(filteredSales);
      } else if (selectedOption == "1") {
        this.generateVoucherChartData(filteredVouchers);
      } else if (selectedOption == "2") {
        this.generateCompareChartData(filteredSales, filteredVouchers);
      } else if (selectedOption == "3") {
        this.generateYOYSaleComparisonChartData(sales, noOfYears);
      } else if (selectedOption == "4") {
        this.generateYOYVoucherComparisonChartData(vouchers, noOfYears);
      } else if (selectedOption == "5") {
        this.generateSalesBySalesmanChartData(filteredSales, users);
      } else if (selectedOption == "6") {
        this.generateVouchersBySalesmanChartData(filteredVouchers, users);
      } else if (selectedOption == "7") {
        this.generateSalesAndVouchersBySalesmanChartData(
          filteredSales,
          filteredVouchers,
          users
        );
      } else if (selectedOption == "8") {
        this.generateTypesOfSalesChartData(filteredSales);
      } else if (selectedOption == "9") {
        // this.generateCancelledSalesChartData(filteredSales);
      } else if (selectedOption == "10") {
        this.generateOrderStatusChartData(filteredSales);
      } else if (selectedOption == "11") {
        this.generateRevenueGeneratedChartData(filteredSales);
      } else if (selectedOption == "12") {
        this.generateCountryWiseSaleChartData(filteredSales);
      }
    });
  }

  updateChart() {
    let formValue = this.analysisForm.value;
    let selectedOption = formValue.typeOfChart;

    this.filterData(formValue);

    // if(selectedOption == '0'){
    //   this.saleList$.subscribe(sales => {
    //     this.generateSalesChartData(sales);
    //   });
    // }else if(selectedOption == '1'){
    //   this.voucherList$.subscribe(vouchers => {
    //     this.generateVoucherChartData(vouchers);
    //   });
    // }else if (selectedOption == '2'){
    //   combineLatest([this.saleList$, this.voucherList$]).subscribe(([sales, vouchers]) => {
    //     this.generateCompareChartData(sales, vouchers);
    //   });
    // }else if (selectedOption == '3'){
    //   this.saleList$.subscribe(sales => {
    //     this.generateYOYSaleComparisonChartData(sales, 1);
    //   });
    // }else if (selectedOption == '4'){
    //   this.voucherList$.subscribe(vouchers => {
    //     this.generateYOYVoucherComparisonChartData(vouchers, 1);
    //   });
    // }else if (selectedOption == '5'){
    //   combineLatest([this.saleList$, this.userList$]).subscribe(([sales, users]) => {
    //     this.generateSalesBySalesmanChartData(sales, users);
    //   });
    // }
    // else if (selectedOption == '6'){
    //   combineLatest([this.voucherList$, this.userList$]).subscribe(([vouchers, users]) => {
    //     this.generateVouchersBySalesmanChartData(vouchers, users);
    //   })
    // }else if (selectedOption == '7'){
    //   combineLatest([this.saleList$, this.voucherList$, this.userList$]).subscribe(([sales, vouchers, users]) => {
    //     this.generateSalesAndVouchersBySalesmanChartData(sales, vouchers, users);
    //   })
    // }
  }

  ngOnInit(): void {
    this.store.resetSaleStore();
    this.userStoreService.resetUserStore();
    this.subscriptions.push(
      combineLatest([
        this.saleService.getOrderNo(),
        this.saleService.getAll(), // Removed .subscribe()
        this.roleService.getAll(), // Removed .subscribe()
        this.qualityService.getAll(), // Removed .subscribe()
        this.designService.getAll(), // Removed .subscribe()
        this.voucherService.getAll(), // Removed .subscribe()
        this.userService.getAll(), // Removed .subscribe()
      ])
        .pipe(
          tap(
            ([orderNo, sales, roles, qualities, designs, vouchers, users]) => {
              // this.orderNo.setValue(orderNo);
              // You can now use sales, roles, qualities, designs, vouchers, and users as needed
            }
          )
        )
        .subscribe()
    );

    this.basicData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "2024",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: "#69AFFF",
          backgroundColor: "#69AFFF",
          borderWidth: 1,
        },
      ],
    };
    this.lineBasicData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "2024",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "#69AFFF",
          backgroundColor: "#69AFFF",
          borderWidth: 1,
        },
      ],
    };
    this.basicOptions = {
      title: {
        display: true,
        text: "Article Views",
        fontSize: 32,
        position: "top",
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Sales",
          },
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    let formValue = this.analysisForm.value;
    this.filterData(formValue);

    this.analysisForm
      .get("typeOfChart")
      ?.valueChanges.subscribe((value: string) => {
        if (value == "3" || value == "4") {
          this.showYearField = true;
          this.showDateFields = false;
        } else {
          this.showYearField = false;
          this.showDateFields = true;
        }
      });

    combineLatest([this.saleList$, this.voucherList$]).subscribe(
      ([sales, vouchers]) => {
        this.generateOverviewData(sales, vouchers);
      }
    );
  }
}
