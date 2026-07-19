import React from 'react';
import { StatMetric } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../utils';

export const StatCard: React.FC<StatMetric> = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      <div className={cn(
        "text-xs mt-2 font-medium",
        trend === 'up' && "text-green-600",
        trend === 'down' && "text-red-600",
        trend === 'neutral' && "text-slate-400"
      )}>
        {trend === 'up' && '+'}
        {trend === 'down' && '-'}
        {Math.abs(change)}% {trend !== 'neutral' && 'from last month'}
      </div>
    </div>
  );
}
