
import { GoogleGenAI } from "@google/genai";
import { TaxResults, CalculationInput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTaxAdvice = async (input: CalculationInput, results: TaxResults) => {
  try {
    const prompt = `
      Act as an expert Indian Tax Consultant. Based on the following Mutual Fund investment scenario, provide a brief (max 200 words) strategic advice on tax planning.
      
      User Profile: ${input.residency === 'NRI' ? 'Non-Resident Indian (NRI)' : 'Resident Indian'}
      Fund Type: ${input.fundType}
      Investment Type: ${input.investmentType}
      Duration: ${input.durationYears} years
      Amount: ${input.amount} ${input.investmentType === 'SIP' ? 'per month' : 'one-time'}
      
      Calculated Results:
      Total Gains: ₹${results.totalGains.toLocaleString()}
      STCG Tax: ₹${results.stcgTax.toLocaleString()}
      LTCG Tax: ₹${results.ltcgTax.toLocaleString()}
      TDS (Estimated): ₹${results.tds.toLocaleString()}
      
      Mention specifics about:
      1. Finance Act 2024 changes (Equity STCG 20%, LTCG 12.5%, 1.25L exemption).
      2. Tax harvesting strategies if applicable.
      3. Repatriation (if NRI).
      4. Debt fund tax parity with slab rates.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate AI advice at this moment. Please check your connection and API key.";
  }
};
