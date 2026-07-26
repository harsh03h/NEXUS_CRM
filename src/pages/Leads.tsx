import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { mockLeads } from '../services/mockData';
import { LeadStatus, Lead } from '../types';
import { formatCurrency, cn } from '../utils';
import { Filter, Download, Plus, MoreHorizontal, X, MessageSquare, Save, Mail, Printer } from 'lucide-react';
import { EmailComposer } from '../components/EmailComposer';
import { ExportModal } from '../components/ExportModal';
import { useToast } from '../context/ToastContext';

const statusColors: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-yellow-100 text-yellow-700',
  'Qualified': 'bg-purple-100 text-purple-700',
  'Proposal': 'bg-orange-100 text-orange-700',
  'Won': 'bg-green-100 text-green-700',
  'Lost': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

export function Leads() {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>(() => {
    try {
      const saved = localStorage.getItem('nexus-lead-form');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load lead form from localStorage', e);
    }
    return { status: 'New', value: 0 };
  });
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [emailingLead, setEmailingLead] = useState<Lead | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [draftNote, setDraftNote] = useState('');
  
  useEffect(() => {
    if (editingLead) {
      const saved = localStorage.getItem(`nexus-draft-${editingLead.id}`);
      if (saved) {
        setDraftNote(saved);
      } else {
        setDraftNote('');
      }
    }
  }, [editingLead]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const note = e.target.value;
    setDraftNote(note);
    if (editingLead) {
      localStorage.setItem(`nexus-draft-${editingLead.id}`, note);
    }
  };

  
  const handleSendEmail = (emailData: { subject: string; body: string }) => {
    if (!emailingLead) return;
    
    // Log the interaction
    const newInteractions = [
      {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        note: `Email Sent: ${emailData.subject}`,
        type: 'Email' as const
      },
      ...(emailingLead.interactions || [])
    ];
    
    const updatedLead = { ...emailingLead, interactions: newInteractions };
    setLeads(leads.map(l => l.id === emailingLead.id ? updatedLead : l));
    setEmailingLead(null);
    showToast('Mock email sent successfully and logged in interactions!', 'success');
  };


  const handleUpdateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    let newInteractions = editingLead.interactions || [];
    if (draftNote.trim()) {
      newInteractions = [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          note: draftNote.trim(),
          type: 'Note'
        },
        ...newInteractions
      ];
      localStorage.removeItem(`nexus-draft-${editingLead.id}`);
    }

    const updatedLead = { ...editingLead, interactions: newInteractions };
    setLeads(leads.map(l => l.id === editingLead.id ? updatedLead : l));
    setEditingLead(null);
    setDraftNote('');
    showToast('Lead updated successfully', 'success');
  };

  useEffect(() => {
    try {
      localStorage.setItem('nexus-lead-form', JSON.stringify(newLead));
    } catch (e) {
      console.error('Failed to save lead form to localStorage', e);
    }
  }, [newLead]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredLeads = useMemo(() => leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  ), [leads, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newLead.name?.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!newLead.company?.trim()) {
      setError('Company is required');
      return;
    }

    if (newLead.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newLead.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    if (newLead.value !== undefined && newLead.value < 0) {
      setError('Value cannot be negative');
      return;
    }
    
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLead.name,
      company: newLead.company,
      email: newLead.email || '',
      phone: newLead.phone || '',
      status: newLead.status as LeadStatus || 'New',
      value: Number(newLead.value) || 0,
      lastContact: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setLeads([lead, ...leads]);
    setIsModalOpen(false);
    setNewLead({ status: 'New', value: 0 });
    setError('');
    showToast(`Lead for ${lead.name} created successfully!`, 'success');
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const deletedLead = leads.find(l => l.id === id);
      setLeads(leads.filter(l => l.id !== id));
      if (deletedLead) {
        showToast(`Deleted ${deletedLead.name}`, 'info');
      }
    }
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${editingLead ? "print:hidden" : ""}`}>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Leads & Customers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your contacts, track their status, and deal value.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => showToast('Advanced filtering is coming soon', 'info')} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col ${editingLead ? "print:hidden" : ""}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 pl-3 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredLeads.length}</span> leads
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1 min-h-[300px]">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50 sticky top-0">
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-2 font-bold tracking-wider">Contact</th>
                <th className="px-4 py-2 font-bold tracking-wider">Company</th>
                <th className="px-4 py-2 font-bold tracking-wider">Status</th>
                <th className="px-4 py-2 font-bold tracking-wider text-right">Est. Value</th>
                <th className="px-4 py-2 font-bold tracking-wider text-right">Last Contact</th>
                <th className="px-4 py-2 font-bold tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:bg-slate-950 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{lead.name}</span>
                      <span className="text-[10px] text-slate-400">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {lead.company}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      statusColors[lead.status]
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-900 dark:text-slate-100 text-right font-medium">
                    {formatCurrency(lead.value)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-right">
                    {lead.lastContact}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingLead(lead)} className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="Edit Lead">
                        <MoreHorizontal size={16} />
                      </button>
                      <button onClick={() => setEmailingLead(lead)} className="text-slate-400 hover:text-green-600 transition-colors p-1" title="Send Email">
                        <Mail size={16} />
                      </button>
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div>Page {currentPage} of {totalPages}</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:static print:bg-white print:p-0 print:block">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Add New Lead</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input required type="text" value={newLead.name || ''} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input required type="text" value={newLead.company || ''} onChange={e => setNewLead({...newLead, company: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" value={newLead.email || ''} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Value (₹)</label>
                  <input type="number" value={newLead.value ?? ''} onChange={e => setNewLead({...newLead, value: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">Create Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:shadow-none print:border-none print:max-h-none print:h-auto">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Edit Lead: {editingLead.name}</h3>
              
              <div className="flex items-center gap-4">
                <button type="button" onClick={handlePrint} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors print:hidden">
                  <Printer size={18} />
                  <span className="text-sm font-semibold hidden sm:inline">Print</span>
                </button>
                <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 print:hidden">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateLead} className="flex-1 overflow-y-auto print:overflow-visible p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select 
                    value={editingLead.status} 
                    onChange={e => setEditingLead({...editingLead, status: e.target.value as LeadStatus})}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Interaction Log</label>
                  <div className="space-y-3 mt-2">
                    {editingLead.interactions && editingLead.interactions.length > 0 ? (
                      editingLead.interactions.map(interaction => (
                        <div key={interaction.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{interaction.type}</span>
                            <span className="text-[10px] text-slate-400">{new Date(interaction.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">{interaction.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500 dark:text-slate-400 italic">No interactions logged yet.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">New Interaction Note (Draft Auto-saves)</label>
                <textarea 
                  value={draftNote}
                  onChange={handleDraftChange}
                  placeholder="Type notes here... (Draft is automatically saved to local storage)"
                  className="w-full flex-1 min-h-[150px] p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/50 rounded-md focus:ring-2 focus:ring-blue-500 text-sm resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                {draftNote && (
                  <p className="text-[10px] text-slate-500 mt-1 flex justify-end">Draft saved in session</p>
                )}
              </div>
            </form>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-950/50 print:hidden">
              <button type="button" onClick={() => setEditingLead(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">Close</button>
              <button onClick={handleUpdateLead} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {isExportModalOpen && (
        <ExportModal 
          onClose={() => setIsExportModalOpen(false)} 
          leads={filteredLeads} 
        />
      )}
      {emailingLead && (
        <EmailComposer
          lead={emailingLead}
          onClose={() => setEmailingLead(null)}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
}
