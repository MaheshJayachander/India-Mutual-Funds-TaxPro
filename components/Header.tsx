
import React from 'react';
import { Calculator, ShieldCheck, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              India MF <span className="text-blue-600">TaxPro</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Calculator</a>
            <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Compliance
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Help
            </a>
          </nav>
          <div className="flex items-center">
             <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 uppercase tracking-wider">
               Budget 2024 Updated
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
