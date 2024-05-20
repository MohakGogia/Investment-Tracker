import { InvestmentStatus, InvestmentType } from "../core/enums";

export interface Investment {
  id: number;
  createdOn: Date;
  modifiedOn: Date;
  amount: number;
  type: InvestmentType;
  purchasedDate: Date;
  sellDate: Date | null;
  duration: number;
  description?: string;
  status: InvestmentStatus;
}