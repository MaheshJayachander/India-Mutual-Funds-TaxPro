
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'primary';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, icon, variant = 'default' }) => {
  const styles = {
    default: 'bg-white border-slate-200',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    danger: 'bg-rose-50 border-rose-100 text-rose-900',
    warning: 'bg-amber-50 border-amber-100 text-amber-900',
    primary: 'bg-blue-50 border-blue-100 text-blue-900'
  };

  return (
    <div className={`p-5 rounded-2xl border ${styles[variant]} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-70 mb-1">{label}</p>
          <h3 className="text-2xl font-bold leading-tight">{value}</h3>
          {subValue && <p className="text-xs mt-1 opacity-60">{subValue}</p>}
        </div>
        {icon && <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
