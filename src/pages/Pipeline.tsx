import React from 'react';
import { useState, useEffect } from 'react';
import { mockDeals } from '../services/mockData';
import { PipelineStage, Deal } from '../types';
import { formatCurrency, cn } from '../utils';
import { Plus, MoreVertical, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const STAGES: PipelineStage[] = ['Lead In', 'Contact Made', 'Needs Defined', 'Proposal Made', 'Negotiations'];

const stageColors: Record<PipelineStage, { title: string; border: string; cardBg: string; text: string }> = {
  'Lead In': { title: 'text-slate-400', border: 'border-slate-200 dark:border-slate-800', cardBg: 'bg-white dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100' },
  'Contact Made': { title: 'text-blue-500', border: 'border-l-4 border-l-blue-500 border-slate-200 dark:border-slate-800', cardBg: 'bg-white dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100' },
  'Needs Defined': { title: 'text-purple-500', border: 'border-l-4 border-l-purple-500 border-slate-200 dark:border-slate-800', cardBg: 'bg-white dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100' },
  'Proposal Made': { title: 'text-orange-500', border: 'border-l-4 border-l-orange-500 border-slate-200 dark:border-slate-800', cardBg: 'bg-white dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100' },
  'Negotiations': { title: 'text-green-600', border: 'border-green-100 dark:border-green-900', cardBg: 'bg-green-50 dark:bg-green-950', text: 'text-green-800 dark:text-green-100' },
};

export function Pipeline() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('nexus-deals');
    return saved ? JSON.parse(saved) : mockDeals;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ stage: 'Lead In', amount: 0 });
  const [error, setError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('nexus-deals', JSON.stringify(deals));
  }, [deals]);

  const getDealsByStage = (stage: PipelineStage) => deals.filter((d: Deal) => d.stage === stage);
  const getTotalValue = (stageDeals: Deal[]) => stageDeals.reduce((sum, deal) => sum + deal.amount, 0);

  const moveDeal = (dealId: string, targetStage: PipelineStage) => {
    const deal = deals.find((d: Deal) => d.id === dealId);
    if (deal && deal.stage !== targetStage) {
      setDeals((prevDeals: Deal[]) => prevDeals.map((d: Deal) => 
        d.id === dealId ? { ...d, stage: targetStage } : d
      ));
      showToast(`Deal moved to ${targetStage}`, 'success');
    }
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;
    moveDeal(dealId, targetStage);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newDeal.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!newDeal.company?.trim()) {
      setError('Company is required');
      return;
    }

    const deal: Deal = {
      id: `D${Date.now()}`,
      title: newDeal.title,
      company: newDeal.company,
      amount: newDeal.amount || 0,
      stage: newDeal.stage as PipelineStage || 'Lead In',
      probability: 50,
      expectedCloseDate: new Date().toISOString().split('T')[0]
    };
    
    setDeals([deal, ...deals]);
    setIsModalOpen(false);
    setNewDeal({ stage: 'Lead In', amount: 0 });
    showToast(`Deal "${deal.title}" created successfully!`, 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Sales Pipeline</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Drag and drop deals to update their stage.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} />
          Add Deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {STAGES.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const totalValue = getTotalValue(stageDeals);
          const colors = stageColors[stage];

          return (
            <div 
              key={stage} 
              className="flex-shrink-0 w-72 flex flex-col bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-xl">
                <div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest", colors.title)}>
                    {stage} ({stageDeals.length})
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(totalValue)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {stageDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={cn("p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative", colors.cardBg, colors.border)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("text-xs font-bold", colors.text)}>{deal.title}</h4>
                      <select 
                        className="text-[10px] bg-transparent text-slate-400 hover:text-slate-700 dark:text-slate-300 outline-none cursor-pointer absolute top-2 right-2 opacity-0 md:group-hover:opacity-100 sm:opacity-100 transition-opacity appearance-none"
                        value={deal.stage}
                        onChange={(e) => moveDeal(deal.id, e.target.value as PipelineStage)}
                        title="Move deal"
                      >
                        {STAGES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button onClick={() => {
                        if (confirm('Delete this deal?')) {
                          setDeals((prev: Deal[]) => prev.filter((d: Deal) => d.id !== deal.id));
                          showToast('Deal deleted', 'success');
                        }
                      }} className="text-slate-400 hover:text-red-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1 md:block hidden">
                        <X size={14} />
                      </button>
                    </div>
                    
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {formatCurrency(deal.amount)} • {deal.company}
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-sm text-slate-400">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Add New Deal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddDeal} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Deal Title</label>
                <input required type="text" value={newDeal.title || ''} onChange={e => setNewDeal({...newDeal, title: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Enterprise License" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input required type="text" value={newDeal.company || ''} onChange={e => setNewDeal({...newDeal, company: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Company name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Value (₹)</label>
                  <input type="number" value={newDeal.amount ?? ''} onChange={e => setNewDeal({...newDeal, amount: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Stage</label>
                  <select value={newDeal.stage} onChange={e => setNewDeal({...newDeal, stage: e.target.value as PipelineStage})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
