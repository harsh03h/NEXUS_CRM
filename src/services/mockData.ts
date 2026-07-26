import { Lead, Deal, StatMetric } from '../types';
import { subDays, format } from 'date-fns';

const today = new Date();

export const mockStats: StatMetric[] = [
  { title: 'Total Revenue', value: '₹124,500', change: 12.5, trend: 'up' },
  { title: 'Active Deals', value: 45, change: 5.2, trend: 'up' },
  { title: 'New Leads', value: 128, change: -2.4, trend: 'down' },
  { title: 'Win Rate', value: '68%', change: 8.1, trend: 'up' },
];

export const mockLeads: Lead[] = [
  { id: '1', name: 'Ram Prakash', company: 'TechCorp Inc.', email: 'rampraksh@techcorp.com', phone: '(+91) 887588601', status: 'New', value: 15000, lastContact: format(subDays(today, 1), 'MMM dd, yyyy'), createdAt: format(subDays(today, 5), 'yyyy-MM-dd') },
  { id: '2', name: 'Rohan Sharma', company: 'Global Logistics', email: 'rohan.s@globallogistics.com', phone: '(555) 987-6543', status: 'Contacted', value: 45000, lastContact: format(subDays(today, 2), 'MMM dd, yyyy'), createdAt: format(subDays(today, 10), 'yyyy-MM-dd') },
  { id: '3', name: 'Vikram Patel', company: 'FinTech Solutions', email: 'vikram.p@fintech.io', phone: '(555) 456-7890', status: 'Qualified', value: 85000, lastContact: format(today, 'MMM dd, yyyy'), createdAt: format(subDays(today, 15), 'yyyy-MM-dd') },
  { id: '4', name: 'Priya Singh', company: 'Amazonia Retail', email: 'priya.s@amazonia.com', phone: '(555) 321-0987', status: 'Proposal', value: 120000, lastContact: format(subDays(today, 5), 'MMM dd, yyyy'), createdAt: format(subDays(today, 20), 'yyyy-MM-dd') },
  { id: '5', name: 'Aditya Kumar', company: 'Wright Aviation', email: 'aditya.k@wrightaviation.net', phone: '(555) 654-3210', status: 'Won', value: 250000, lastContact: format(subDays(today, 10), 'MMM dd, yyyy'), createdAt: format(subDays(today, 30), 'yyyy-MM-dd') },
  { id: '6', name: 'Neha Gupta', company: 'Shamrock Co.', email: 'neha.g@shamrock.com', phone: '(555) 789-0123', status: 'Lost', value: 5000, lastContact: format(subDays(today, 45), 'MMM dd, yyyy'), createdAt: format(subDays(today, 60), 'yyyy-MM-dd') },
  { id: '7', name: 'Manish Desai', company: 'Mad Max Fury', email: 'manish.d@mmfury.com', phone: '(555) 234-5678', status: 'New', value: 32000, lastContact: 'Never', createdAt: format(subDays(today, 1), 'yyyy-MM-dd') },
  { id: '8', name: 'Anjali Joshi', company: 'Hufflepuff Tech', email: 'anjali.j@hufflepuff.edu', phone: '(555) 876-5432', status: 'Qualified', value: 65000, lastContact: format(subDays(today, 3), 'MMM dd, yyyy'), createdAt: format(subDays(today, 12), 'yyyy-MM-dd') },
];

export const mockDeals: Deal[] = [
  { id: 'D1', title: 'Enterprise License', company: 'TechCorp Inc.', amount: 15000, stage: 'Lead In', expectedCloseDate: format(subDays(today, -30), 'MMM dd, yyyy'), probability: 20 },
  { id: 'D2', title: 'Q3 Software Upgrade', company: 'Global Logistics', amount: 45000, stage: 'Contact Made', expectedCloseDate: format(subDays(today, -15), 'MMM dd, yyyy'), probability: 40 },
  { id: 'D3', title: 'API Integration Project', company: 'FinTech Solutions', amount: 85000, stage: 'Needs Defined', expectedCloseDate: format(subDays(today, -45), 'MMM dd, yyyy'), probability: 60 },
  { id: 'D4', title: 'Cloud Migration', company: 'Amazonia Retail', amount: 120000, stage: 'Proposal Made', expectedCloseDate: format(subDays(today, -10), 'MMM dd, yyyy'), probability: 80 },
  { id: 'D5', title: 'Security Audit', company: 'Stark Industries', amount: 55000, stage: 'Negotiations', expectedCloseDate: format(subDays(today, -5), 'MMM dd, yyyy'), probability: 90 },
  { id: 'D6', title: 'Mobile App Development', company: 'Wayne Enterprises', amount: 200000, stage: 'Lead In', expectedCloseDate: format(subDays(today, -90), 'MMM dd, yyyy'), probability: 10 },
  { id: 'D7', title: 'Data Warehouse Setup', company: 'Pied Piper', amount: 75000, stage: 'Needs Defined', expectedCloseDate: format(subDays(today, -60), 'MMM dd, yyyy'), probability: 50 },
];

export const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 59000 },
  { name: 'Jun', revenue: 75000 },
  { name: 'Jul', revenue: 82000 },
  { name: 'Aug', revenue: 95000 },
  { name: 'Sep', revenue: 105000 },
  { name: 'Oct', revenue: 98000 },
  { name: 'Nov', revenue: 110000 },
  { name: 'Dec', revenue: 124500 },
];


export const conversionData = [
  { name: 'Jan', ratio: 2.1 },
  { name: 'Feb', ratio: 2.4 },
  { name: 'Mar', ratio: 2.2 },
  { name: 'Apr', ratio: 2.8 },
  { name: 'May', ratio: 3.2 },
  { name: 'Jun', ratio: 3.5 },
  { name: 'Jul', ratio: 3.8 },
  { name: 'Aug', ratio: 4.1 },
  { name: 'Sep', ratio: 4.5 },
  { name: 'Oct', ratio: 4.2 },
  { name: 'Nov', ratio: 4.8 },
  { name: 'Dec', ratio: 5.2 },
];

export const avgDealValueData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 13500 },
  { name: 'Mar', value: 12800 },
  { name: 'Apr', value: 14200 },
  { name: 'May', value: 15500 },
  { name: 'Jun', value: 16800 },
  { name: 'Jul', value: 16200 },
  { name: 'Aug', value: 17500 },
  { name: 'Sep', value: 18200 },
  { name: 'Oct', value: 17800 },
  { name: 'Nov', value: 19500 },
  { name: 'Dec', value: 21000 },
];
