import React from 'react';
import { StatCard } from '../components/StatCard';
import { mockStats, revenueData, conversionData, avgDealValueData } from '../services/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { formatCurrency } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export function Dashboard() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const tooltipStyle = { 
    borderRadius: '8px', 
    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', 
    backgroundColor: isDark ? '#0f172a' : '#fff',
    color: isDark ? '#f8fafc' : '#0f172a',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
  };
  
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const cursorColor = isDark ? '#1e293b' : '#f1f5f9';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Performance Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your sales performance and metrics.</p>
        </div>
        <button onClick={() => showToast('Report generation started...', 'success')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} trend={stat.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Revenue Overview</h3>
            <select className="dark:bg-slate-900 text-sm border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400 py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis 
                  tickFormatter={(val) => `₹${val / 1000}k`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={tooltipStyle}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6">Pipeline Value by Stage</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Lead', value: 230000 },
                { name: 'Contact', value: 185000 },
                { name: 'Needs', value: 125000 },
                { name: 'Proposal', value: 340000 },
                { name: 'Negotiation', value: 95000 },
              ]} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  cursor={{fill: cursorColor}}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Conversion Ratio</h3>
            <select className="dark:bg-slate-900 text-sm border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400 py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis 
                  tickFormatter={(val) => `${val}%`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Conversion Ratio']}
                  contentStyle={tooltipStyle}
                />
                <Area type="monotone" dataKey="ratio" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRatio)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Average Deal Value</h3>
            <select className="dark:bg-slate-900 text-sm border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400 py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={avgDealValueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvgValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis 
                  tickFormatter={(val) => `₹${val / 1000}k`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Avg Deal Value']}
                  contentStyle={tooltipStyle}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAvgValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
