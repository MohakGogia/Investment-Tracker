import { InvestmentType, InvestmentStatus } from "../core/enums";

export type IFormInput = {
	amount: number;
	type: InvestmentType;
	purchasedDate: Date;
	status: InvestmentStatus;
	sellDate?: Date | null;
	description?: string;
};