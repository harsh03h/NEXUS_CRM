import React, { useState, useEffect } from 'react';
import { X, Mail, Send, ChevronDown } from 'lucide-react';
import { Lead } from '../types';
import { useToast } from '../context/ToastContext';

interface EmailComposerProps {
  lead: Lead;
  onClose: () => void;
  onSend: (emailData: { subject: string; body: string }) => void;
}

const EMAIL_TEMPLATES = [
  {
    id: 'intro',
    name: 'Introduction',
    subject: 'Introduction from Nexus CRM',
    body: 'Hi {lead_name},\n\nI noticed that {company_name} is doing some great work. I wanted to reach out and see if you might be open to a quick call this week to discuss how we could help you scale.\n\nBest,\n[Your Name]'
  },
  {
    id: 'followup',
    name: 'Follow Up',
    subject: 'Following up on our last conversation',
    body: 'Hi {lead_name},\n\nI hope you are doing well. I wanted to follow up on our last conversation regarding {company_name}\'s needs. Let me know if you have any questions or if you would like to schedule another call.\n\nBest,\n[Your Name]'
  },
  {
    id: 'proposal',
    name: 'Proposal Attached',
    subject: 'Proposal for {company_name}',
    body: 'Hi {lead_name},\n\nPlease find the attached proposal for {company_name}. Let me know if you have any questions or if you would like to discuss it further.\n\nBest,\n[Your Name]'
  }
];

export function EmailComposer({ lead, onClose, onSend }: EmailComposerProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  
  const { showToast } = useToast();

  useEffect(() => {
    const savedDraft = localStorage.getItem(`nexus-email-draft-${lead.id}`);
    if (savedDraft) {
      try {
        const { subject: savedSubject, body: savedBody } = JSON.parse(savedDraft);
        setSubject(savedSubject || '');
        setBody(savedBody || '');
      } catch (e) {
        // ignore
      }
    }
  }, [lead.id]);

  useEffect(() => {
    localStorage.setItem(`nexus-email-draft-${lead.id}`, JSON.stringify({ subject, body }));
  }, [subject, body, lead.id]);

  const applyTemplate = (templateId: string) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const parsedSubject = template.subject
        .replace(/{lead_name}/g, lead.name)
        .replace(/{company_name}/g, lead.company);
        
      const parsedBody = template.body
        .replace(/{lead_name}/g, lead.name)
        .replace(/{company_name}/g, lead.company);

      setSubject(parsedSubject);
      setBody(parsedBody);
      setSelectedTemplate(templateId);
      setShowTemplates(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      showToast('Please enter both subject and body', 'error');
      return;
    }
    
    // Clear draft on send
    localStorage.removeItem(`nexus-email-draft-${lead.id}`);
    
    onSend({ subject, body });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Mail className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Compose Email to {lead.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSend} className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium">To:</span> {lead.email}
            </div>
            
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Use Template
                <ChevronDown size={14} />
              </button>
              
              {showTemplates && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10">
                  {EMAIL_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex-1 min-h-[250px] flex flex-col relative">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here... Use {lead_name} or {company_name} for variables."
              className="w-full flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none"
            />
            {(subject || body) && (
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                Draft auto-saved
              </div>
            )}
          </div>
        </form>
        
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Variables: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">{'{lead_name}'}</code> <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">{'{company_name}'}</code>
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend} 
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              <Send size={16} /> Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
