import { SortOrder } from "../core/enums";

export interface FilterParameter {
  sortField: string;
  sortOrder: SortOrder;
  filterColumn?: string;
  filterValue?: unknown;
  pageNumber: number;
  pageSize: number;
}