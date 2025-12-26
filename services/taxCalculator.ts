
import { ResidencyStatus, InvestmentType, FundType, CalculationInput, TaxResults } from '../types';

/**
 * Calculations based on Finance Act 2024 (Budget 2024) updates
 * Equity STCG: 20%
 * Equity LTCG: 12.5% (Exemption of 1.25 Lakh per year)
 * Debt: Taxed at Slab rates (no LTCG benefit for investments after April 2023)
 */

const EQUITY_STCG_RATE = 0.20;
const EQUITY_LTCG_RATE = 0.125;
const LTCG_EXEMPTION_LIMIT = 125000;

export const calculateMFTax = (input: CalculationInput): TaxResults => {
  const { residency, fundType, investmentType, amount, durationYears, expectedReturnRate, taxSlabRate } = input;
  const r = expectedReturnRate / 100;
  const n = durationYears;
  
  let totalInvestment = 0;
  let totalValue = 0;
  let stcgGains = 0;
  let ltcgGains = 0;

  if (investmentType === InvestmentType.LUMPSUM) {
    totalInvestment = amount;
    totalValue = amount * Math.pow(1 + r, n);
    const gains = totalValue - totalInvestment;
    
    // Holding period logic: > 1 year for Equity is LTCG, > 3 years was for Debt (but now Debt is slab-taxed)
    if (fundType === FundType.EQUITY) {
      if (n >= 1) {
        ltcgGains = gains;
      } else {
        stcgGains = gains;
      }
    } else {
      // Debt funds are essentially all taxed at slab rates now
      stcgGains = gains;
    }
  } else {
    // SIP Calculation (Monthly)
    const monthlyRate = r / 12;
    const totalMonths = n * 12;
    totalInvestment = amount * totalMonths;
    
    // Calculate each installment's value and category
    for (let i = 1; i <= totalMonths; i++) {
      const remainingMonths = totalMonths - i;
      const installmentFinalValue = amount * Math.pow(1 + monthlyRate, remainingMonths);
      const installmentGains = installmentFinalValue - amount;
      
      totalValue += installmentFinalValue;
      
      if (fundType === FundType.EQUITY) {
        // For equity, an installment must be held for 12 months (1 year) to be LTCG
        if (remainingMonths >= 12) {
          ltcgGains += installmentGains;
        } else {
          stcgGains += installmentGains;
        }
      } else {
        // Debt funds taxed at slab
        stcgGains += installmentGains;
      }
    }
  }

  let stcgTax = 0;
  let ltcgTax = 0;
  let tds = 0;

  if (fundType === FundType.EQUITY) {
    stcgTax = stcgGains * EQUITY_STCG_RATE;
    // LTCG Exemption: 1.25 Lakhs per year. Since this is a projection, we apply it to the final lump sum.
    const taxableLTCG = Math.max(0, ltcgGains - LTCG_EXEMPTION_LIMIT);
    ltcgTax = taxableLTCG * EQUITY_LTCG_RATE;
  } else {
    // Debt fund gains are taxed at income tax slab
    stcgTax = stcgGains * (taxSlabRate / 100);
  }

  // TDS for NRIs
  if (residency === ResidencyStatus.NRI) {
    if (fundType === FundType.EQUITY) {
      // TDS on STCG (20%) and LTCG (12.5% - usually without exemption benefit for TDS deduction)
      tds = (stcgGains * 0.20) + (ltcgGains * 0.125);
    } else {
      // TDS on Debt for NRIs is typically 30% or treaty rate. We use slabRate as proxy.
      tds = (stcgGains + ltcgGains) * (taxSlabRate / 100);
    }
  }

  const totalGains = stcgGains + ltcgGains;
  const netReturns = totalValue - (stcgTax + ltcgTax);

  return {
    totalInvestment,
    totalValue,
    totalGains,
    stcgGains,
    ltcgGains,
    stcgTax,
    ltcgTax,
    tds,
    netReturns,
    isEquity: fundType === FundType.EQUITY
  };
};
