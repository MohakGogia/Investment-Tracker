import { InvestmentType, InvestmentStatus } from "../core/enums";

export type IFormInput = {
	amount: number;
	type: InvestmentType;
	purchasedDate: Date;
	sellDate?: Date | null;
	description?: string;
	status: InvestmentStatus;
};