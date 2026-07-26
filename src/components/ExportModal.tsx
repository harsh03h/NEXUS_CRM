import React, { useState } from 'react';
import { X, Download, Calendar } from 'lucide-react';
import { Lead } from '../types';
import { useToast } from '../context/ToastContext';

interface ExportModalProps {
  onClose: () => void;
  leads: Lead[];
}

const ALL_COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'company', label: 'Company' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'status', label: 'Status' },
  { id: 'value', label: 'Value' },
  { id: 'lastContact', label: 'Last Contact' },
  { id: 'createdAt', label: 'Created At' }
];

export function ExportModal({ onClose, leads }: ExportModalProps) {
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set(ALL_COLUMNS.map(c => c.id)));
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const { showToast } = useToast();

  const toggleColumn = (id: string) => {
    const newCols = new Set(selectedCols);
    if (newCols.has(id)) {
      if (newCols.size > 1) {
        newCols.delete(id);
      } else {
        showToast('You must select at least one column', 'error');
        return;
      }
    } else {
      newCols.add(id);
    }
    setSelectedCols(newCols);
  };

  const handleExport = () => {
    let filteredLeads = [...leads];
    
    // Filter by date
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (dateRange === '7d') cutoff.setDate(now.getDate() - 7);
      if (dateRange === '30d') cutoff.setDate(now.getDate() - 30);
      if (dateRange === '90d') cutoff.setDate(now.getDate() - 90);
      
      filteredLeads = filteredLeads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= cutoff;
      });
    }

    if (filteredLeads.length === 0) {
      showToast('No leads found for this date range', 'error');
      return;
    }

    const orderedSelectedCols = ALL_COLUMNS.filter(c => selectedCols.has(c.id));
    const headers = orderedSelectedCols.map(c => c.label);
    
    const csvRows = filteredLeads.map(lead => {
      return orderedSelectedCols.map(col => {
        const val = lead[col.id as keyof Lead];
        if (col.id === 'value') return val?.toString() || '0';
        return `"${val || ''}"`;
      }).join(',');
    });
    
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    showToast(`Successfully exported ${filteredLeads.length} leads`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Download className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Export Leads Data</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Date Range (Created At)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Time' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '90d', label: 'Last 90 Days' },
              ].map(range => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id as any)}
                  className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors ${
                    dateRange === range.id 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Columns to Export
              </h4>
              <button 
                onClick={() => setSelectedCols(new Set(ALL_COLUMNS.map(c => c.id)))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {ALL_COLUMNS.map(col => (
                <label 
                  key={col.id} 
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center w-5 h-5 text-blue-600 dark:text-blue-500">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={selectedCols.has(col.id)}
                      onChange={() => toggleColumn(col.id)}
                    />
                    <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded peer-checked:border-blue-600 peer-checked:bg-blue-600 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500 transition-colors" />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                    {col.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-950/50">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleExport} 
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
