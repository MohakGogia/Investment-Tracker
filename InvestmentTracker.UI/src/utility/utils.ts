import { InvestmentType } from "../core/enums";

export const formatName = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2');

export const InvestmentTypeLabels: Record<keyof typeof InvestmentType, string> = {
  FD: 'Fixed Deposit (FD)',
  PPF: 'Public Provident Fund (PPF)',
  MutualFunds: 'Mutual Funds (MFs)',
  Stocks: 'Indian Stocks',
  SGB: 'Sovereign Gold Bonds (SGB)',
  ETF: 'Exchange-Traded Fund (ETF)',
  CorporateBonds: 'Corporate Bonds',
  REIT: 'Real Estate Investment Trust (REIT)',
  Crypto: 'Cryptocurrency (Crypto)',
  IPO: 'Initial Public Offering (IPO)',
  USStocks: 'US Stocks',
  PhysicalGold: 'Physical Gold',
  DigitalGold: 'Digital Gold',
  Silver: 'Silver',
};

export const InvestmentTypeLabelsShort: Record<keyof typeof InvestmentType, string> = {
  FD: 'FD',
  PPF: 'PPF',
  MutualFunds: 'MFs',
  Stocks: 'Indian Stocks',
  SGB: 'SGB',
  ETF: 'ETF',
  CorporateBonds: 'Corp Bonds',
  REIT: 'REIT',
  Crypto: 'Crypto',
  IPO: 'IPO',
  USStocks: 'US Stocks',
  PhysicalGold: 'Physical Gold',
  DigitalGold: 'Digital Gold',
  Silver: 'Silver',
};