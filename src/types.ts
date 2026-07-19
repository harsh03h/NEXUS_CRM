export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Interaction {
  id: string;
  date: string;
  note: string;
  type: 'Note' | 'Call' | 'Email' | 'Meeting';
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  lastContact: string;
  createdAt: string;
  interactions?: Interaction[];
}

export type PipelineStage = 'Lead In' | 'Contact Made' | 'Needs Defined' | 'Proposal Made' | 'Negotiations';

export interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  stage: PipelineStage;
  expectedCloseDate: string;
  probability: number; // 0-100
}

export interface UserSettings {
  name: string;
  email: string;
  role: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface StatMetric {
  title: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}
