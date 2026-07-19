import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, Trello, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockLeads, mockDeals } from '../services/mockData';
import { cn } from '../utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredLeads = query.trim() === '' ? [] : mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(query.toLowerCase()) || 
    lead.company.toLowerCase().includes(query.toLowerCase()) ||
    lead.email.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredDeals = query.trim() === '' ? [] : mockDeals.filter(deal => 
    deal.title.toLowerCase().includes(query.toLowerCase()) || 
    deal.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4 pb-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none px-3 py-1 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            placeholder="Search leads, deals, or companies..."
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold px-2">
            ESC
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
              <Search className="mb-4 opacity-20" size={40} />
              <p className="text-sm">Start typing to search across your CRM.</p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium">Leads</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium">Deals</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium">Customers</span>
              </div>
            </div>
          ) : filteredLeads.length === 0 && filteredDeals.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {filteredLeads.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Leads & Customers
                  </div>
                  {filteredLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        onNavigate('leads');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Users size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{lead.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{lead.company} • {lead.email}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
                        View
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredDeals.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Deals
                  </div>
                  {filteredDeals.map(deal => (
                    <button
                      key={deal.id}
                      onClick={() => {
                        onNavigate('pipeline');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Trello size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{deal.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{deal.company} • ₹{deal.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-400 group-hover:text-purple-500 transition-colors">
                        View
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Press <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 font-mono shadow-sm">ESC</kbd> to close</span>
          <span>Navigate to view details</span>
        </div>
      </motion.div>
    </div>
  );
}
