
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import { 
  TrendingUp, 
  Wallet, 
  Percent, 
  PieChart as PieIcon, 
  ArrowRight, 
  Info, 
  Sparkles,
  RefreshCw,
  Scale
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { calculateMFTax } from './services/taxCalculator';
import { getTaxAdvice } from './services/geminiService';
import { ResidencyStatus, InvestmentType, FundType, CalculationInput, TaxResults } from './types';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInput>({
    residency: ResidencyStatus.RESIDENT,
    fundType: FundType.EQUITY,
    investmentType: InvestmentType.SIP,
    amount: 10000,
    durationYears: 10,
    expectedReturnRate: 12,
    taxSlabRate: 30
  });

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const results = useMemo(() => calculateMFTax(inputs), [inputs]);

  const handleInputChange = (field: keyof CalculationInput, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = [
    { name: 'STCG Tax', value: results.stcgTax, color: '#f43f5e' },
    { name: 'LTCG Tax', value: results.ltcgTax, color: '#fbbf24' },
    { name: 'Net Profit', value: results.totalGains - (results.stcgTax + results.ltcgTax), color: '#10b981' },
  ].filter(d => d.value > 0);

  const comparisonData = [
    { name: 'Investment', amount: results.totalInvestment },
    { name: 'Pre-Tax Value', amount: results.totalValue },
    { name: 'Post-Tax Value', amount: results.netReturns },
  ];

  const fetchAiAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getTaxAdvice(inputs, results);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Inputs */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Investment Parameters
              </h2>

              <div className="space-y-5">
                {/* Residency */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Residency Status</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                    {Object.values(ResidencyStatus).map(status => (
                      <button
                        key={status}
                        onClick={() => handleInputChange('residency', status)}
                        className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                          inputs.residency === status 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fund Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fund Category</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                    {Object.values(FundType).map(type => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('fundType', type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                          inputs.fundType === type 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reference Rates Info Box */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Scale className="w-3 h-3" /> Applicable Tax Rates (FY 24-25)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">STCG Rate</p>
                      <p className="text-sm font-bold text-slate-900">
                        {inputs.fundType === FundType.EQUITY ? '20%' : `Slab (${inputs.taxSlabRate}%)`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">LTCG Rate</p>
                      <p className="text-sm font-bold text-slate-900">
                        {inputs.fundType === FundType.EQUITY ? '12.5%' : `Slab (${inputs.taxSlabRate}%)`}
                      </p>
                    </div>
                  </div>
                  {inputs.fundType === FundType.EQUITY && (
                    <p className="mt-2 text-[10px] text-blue-600 font-medium">
                      * ₹1.25 Lakh annual LTCG exemption applies.
                    </p>
                  )}
                </div>

                {/* Investment Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Investment Model</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                    {Object.values(InvestmentType).map(type => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('investmentType', type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                          inputs.investmentType === type 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {inputs.investmentType === InvestmentType.SIP ? 'Monthly SIP Amount (₹)' : 'One-time Investment (₹)'}
                  </label>
                  <input
                    type="number"
                    value={inputs.amount}
                    onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="e.g. 10000"
                  />
                  <input
                    type="range"
                    min="500"
                    max="1000000"
                    step="500"
                    value={inputs.amount}
                    onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                    className="w-full mt-2 accent-blue-600"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Horizon (Years)</label>
                  <div className="flex items-center gap-4">
                     <input
                      type="number"
                      value={inputs.durationYears}
                      onChange={(e) => handleInputChange('durationYears', Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={inputs.durationYears}
                      onChange={(e) => handleInputChange('durationYears', Number(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                  </div>
                </div>

                {/* Returns */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expected Return (%)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={inputs.expectedReturnRate}
                      onChange={(e) => handleInputChange('expectedReturnRate', Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={inputs.expectedReturnRate}
                      onChange={(e) => handleInputChange('expectedReturnRate', Number(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                  </div>
                </div>

                {/* Tax Slab */}
                {inputs.fundType === FundType.DEBT && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Income Tax Slab (%)</label>
                    <select
                      value={inputs.taxSlabRate}
                      onChange={(e) => handleInputChange('taxSlabRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                      <option value={20}>20%</option>
                      <option value={30}>30%</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1 italic">
                      Note: Debt funds are now taxed as per your slab regardless of duration.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: Results */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                label="Maturity Value" 
                value={`₹${results.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subValue={`Invested: ₹${results.totalInvestment.toLocaleString()}`}
                icon={<TrendingUp className="text-blue-600" />}
                variant="primary"
              />
              <MetricCard 
                label="Total Tax Liability" 
                value={`₹${(results.stcgTax + results.ltcgTax).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subValue={`Effective Rate: ${((results.stcgTax + results.ltcgTax) / results.totalGains * 100 || 0).toFixed(1)}%`}
                icon={<Percent className="text-rose-600" />}
                variant="danger"
              />
              <MetricCard 
                label="Net Post-Tax Profit" 
                value={`₹${(results.totalGains - (results.stcgTax + results.ltcgTax)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                subValue={`Actual Gains realized`}
                icon={<RefreshCw className="text-emerald-600" />}
                variant="success"
              />
            </div>

            {/* Visual Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <PieIcon className="w-4 h-4 text-blue-500" /> Gain Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                  Value Analysis
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                         {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : index === 1 ? '#3b82f6' : '#10b981'} />
                          ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Tax Breakup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Comprehensive Tax Breakdown</h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">FA 2024 REGIME</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600 text-sm">STCG Portion</span>
                      <span className="font-semibold text-slate-900">₹{results.stcgGains.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600 text-sm">STCG Tax ({results.isEquity ? '20%' : `${inputs.taxSlabRate}%`})</span>
                      <span className="font-bold text-rose-600">₹{results.stcgTax.toLocaleString()}</span>
                    </div>
                    {results.isEquity && (
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-600 text-sm">LTCG Portion</span>
                        <span className="font-semibold text-slate-900">₹{results.ltcgGains.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {results.isEquity && (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-slate-600 text-sm flex items-center gap-1">
                            LTCG Exemption <Info className="w-3 h-3 text-slate-400" />
                          </span>
                          <span className="font-semibold text-emerald-600">- ₹{Math.min(results.ltcgGains, 125000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">LTCG Tax (12.5%)</span>
                          <span className="font-bold text-amber-600">₹{results.ltcgTax.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    {inputs.residency === ResidencyStatus.NRI && (
                      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <span className="text-blue-700 text-sm font-bold flex items-center gap-1">
                          Estimated TDS (to be deducted)
                        </span>
                        <span className="font-bold text-blue-800">₹{results.tds.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advisor Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Sparkles className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <h2 className="text-2xl font-bold">MF Tax Advisor</h2>
                  </div>
                  <p className="text-blue-100 mb-8 max-w-2xl leading-relaxed">
                    Get personalized tax planning strategies based on your current investment profile and the latest Indian income tax regulations.
                  </p>
                  
                  {!aiAdvice ? (
                    <button 
                      onClick={fetchAiAdvice}
                      disabled={isAiLoading}
                      className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {isAiLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                      Analyze My Tax Strategy
                    </button>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-sm leading-relaxed mb-6 font-medium text-blue-50 italic">
                        "{aiAdvice}"
                      </p>
                      <button 
                        onClick={() => setAiAdvice(null)}
                        className="text-xs font-bold text-white/60 hover:text-white transition-colors"
                      >
                        Clear Advice
                      </button>
                    </div>
                  )}
               </div>
            </div>

          </section>
        </div>
      </main>

      {/* Sticky Mobile Summary */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Post-Tax Value</p>
           <p className="text-lg font-bold text-blue-600">₹{results.netReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200"
        >
          Edit Inputs
        </button>
      </div>
    </div>
  );
};

export default App;
