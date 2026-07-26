import React from 'react';
import { useState } from 'react';
import { Save, User, Shield, BellRing, Palette, Users } from 'lucide-react';
import { UserSettings } from '../types';
import { cn } from '../utils';
import { useToast } from '../context/ToastContext';

const mockUsers = [
  { id: '1', name: 'Harsh Gupta', email: 'harsh.gupta@nexuscrm.com', role: 'Sales Director', status: 'Active', lastActive: '2 mins ago' },
  { id: '2', name: 'Rajesh Iyer', email: 'rajesh.i@nexuscrm.com', role: 'Manager', status: 'Active', lastActive: '1 hr ago' },
  { id: '3', name: 'Sneha Reddy', email: 'sneha.r@nexuscrm.com', role: 'Sales', status: 'Offline', lastActive: 'Yesterday' },
  { id: '4', name: 'Arjun Nair', email: 'arjun.n@nexuscrm.com', role: 'Sales', status: 'Active', lastActive: '5 mins ago' },
  { id: '5', name: 'Karan Desai', email: 'karan.d@nexuscrm.com', role: 'Admin', status: 'Active', lastActive: 'Just now' },
];

export function Admin() {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'security' | 'notifications' | 'appearance'>('profile');
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Harsh Gupta',
    email: 'harsh.gupta@nexuscrm.com',
    role: 'Sales Director',
    notificationsEnabled: true,
    theme: 'system',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!settings.name.trim()) {
      setError('Full Name is required');
      return;
    }

    if (!settings.email.trim()) {
      setError('Email Address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.email)) {
      setError('Please enter a valid email address');
      return;
    }

    localStorage.setItem('nexus-profile', JSON.stringify({ name: settings.name, email: settings.email, phone: '+91 98765 43210', location: 'Mumbai, India', department: 'Sales', joinDate: 'Jan 2024', bio: 'Passionate about building client relationships and driving revenue growth. Over 10 years of experience in enterprise sales.' }));
    window.dispatchEvent(new Event('storage'));
    showToast('Profile settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Admin & Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-1">
          <nav className="flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors", activeTab === 'profile' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950")}
            >
              <User size={18} />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors", activeTab === 'users' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950")}
            >
              <Users size={18} />
              User Management
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors", activeTab === 'security' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950")}
            >
              <Shield size={18} />
              Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors", activeTab === 'notifications' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950")}
            >
              <BellRing size={18} />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors", activeTab === 'appearance' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950")}
            >
              <Palette size={18} />
              Appearance
            </button>
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">Personal Information</h3>
                
                {error && (
                  <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 max-w-xl">
                    {error}
                  </div>
                )}

                <div className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <input 
                      type="text" 
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className="w-full bg-white dark:bg-slate-900  px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input 
                      type="email" 
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="w-full bg-white dark:bg-slate-900  px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role / Title</label>
                    <input 
                      type="text" 
                      value={settings.role}
                      disabled
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 rounded-md shadow-sm text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contact your system administrator to change your role.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end max-w-xl">
                  <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-w-xl">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Email Notifications</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily summaries and deal alerts.</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                        settings.notificationsEnabled ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow ring-0 transition duration-200 ease-in-out",
                        settings.notificationsEnabled ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Theme</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Select your interface color scheme.</p>
                    </div>
                    <select 
                      value={settings.theme}
                      onChange={(e) => setSettings({...settings, theme: e.target.value as any})}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">User Management</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage team members and roles.</p>
                </div>
                <button onClick={() => showToast('User management coming soon', 'info')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50">
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="px-6 py-3 font-bold tracking-wider">User</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Role</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-3 font-bold tracking-wider text-right">Last Active</th>
                      <th className="px-6 py-3 font-bold tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {mockUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                            user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400')}></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500 dark:text-slate-400 text-xs">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button onClick={() => showToast('Edit user coming soon', 'info')} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {['security', 'notifications', 'appearance'].includes(activeTab) && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Settings Category</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">This section is available in the full enterprise version of Nexus CRM.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
