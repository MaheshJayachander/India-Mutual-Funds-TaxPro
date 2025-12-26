
export enum ResidencyStatus {
  RESIDENT = 'RESIDENT',
  NRI = 'NRI'
}

export enum InvestmentType {
  SIP = 'SIP',
  LUMPSUM = 'LUMPSUM'
}

export enum FundType {
  EQUITY = 'EQUITY',
  DEBT = 'DEBT'
}

export interface TaxResults {
  totalInvestment: number;
  totalValue: number;
  totalGains: number;
  stcgGains: number;
  ltcgGains: number;
  stcgTax: number;
  ltcgTax: number;
  tds: number;
  netReturns: number;
  isEquity: boolean;
}

export interface CalculationInput {
  residency: ResidencyStatus;
  fundType: FundType;
  investmentType: InvestmentType;
  amount: number;
  durationYears: number;
  expectedReturnRate: number;
  taxSlabRate: number; // Relevant for Debt funds (taxed at slab)
}
