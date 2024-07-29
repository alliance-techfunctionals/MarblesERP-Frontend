import { environment } from "src/environments/environment";

export interface Pagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  tableSize: number[];
}

export function createPagination({
  totalItems = 0,
  itemsPerPage = environment.recordsPerPage,
  currentPage = 1,
  tableSize = environment.tableRecordSize,
}): Pagination {
  return {
    totalItems,
    itemsPerPage,
    currentPage,
    tableSize
  }
}
