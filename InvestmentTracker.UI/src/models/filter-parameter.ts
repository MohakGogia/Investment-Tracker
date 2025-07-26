import { SortOrder } from "../core/enums";

export interface FilterParameter {
  sortField: string;
  sortOrder: SortOrder;
  pageNumber: number;
  pageSize: number;
  filterColumn?: string;
  filterValue?: unknown;
}