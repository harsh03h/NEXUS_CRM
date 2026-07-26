import { LayoutDashboard, Users, Trello, Settings, LogOut, X } from 'lucide-react';
import { cn } from '../utils';

export type Page = 'dashboard' | 'leads' | 'pipeline' | 'admin' | 'profile';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isOpen, onClose, userRole }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Customers', icon: Users },
    { id: 'pipeline', label: 'Sales Pipeline', icon: Trello },
    ...(userRole === 'Admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed top-0 left-0 flex-shrink-0 z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Nexus CRM</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                isActive 
                  ? "bg-slate-800 text-white" 
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('profile')}
          className={cn(
            "flex items-center gap-3 text-left p-1.5 -ml-1.5 rounded-md transition-colors",
            currentPage === 'profile' ? "bg-slate-800" : "hover:bg-slate-800"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center text-white">
            {localStorage.getItem('nexus-avatar') ? (
              <img src={localStorage.getItem('nexus-avatar') || undefined} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'block'; }} className="w-full h-full object-cover" alt="User" />
            ) : null}
            <span className={localStorage.getItem('nexus-avatar') ? "hidden font-bold" : "font-bold"}>H</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-white">Harsh Gupta</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Sales Director</div>
          </div>
        </button>
        <button onClick={onLogout} className="text-slate-400 hover:text-white p-1 rounded-md transition-colors" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
    </>
  );
}
