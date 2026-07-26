import { Search, Bell, User, Menu, Moon, Sun, Monitor, CheckCircle, XCircle, Info, Trash2, CheckCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { CommandPalette } from './CommandPalette';

interface HeaderProps {
  onMenuClick?: () => void;
  onNavigate?: (page: string) => void;
}

export function Header({ onMenuClick, onNavigate }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { showToast, notifications, unreadCount, markAllAsRead, clearNotifications } = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center flex-1 max-w-xl gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative group flex-1 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
            <Search size={18} />
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-full sm:w-64 pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>Search leads, deals...</span>
            <span className="hidden sm:inline-block text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-sm text-slate-400">
              ⌘K
            </span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 ml-4">
        <button 
          onClick={cycleTheme}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          title={`Current theme: ${theme}`}
        >
          {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
        </button>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              if (!isNotificationsOpen && unreadCount > 0) {
                markAllAsRead();
              }
            }} 
            className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-900 text-[8px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={markAllAsRead}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                    <button 
                      onClick={clearNotifications}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <Bell className="mx-auto mb-2 opacity-50" size={24} />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notification.type === 'success' && <CheckCircle className="text-green-500" size={16} />}
                            {notification.type === 'error' && <XCircle className="text-red-500" size={16} />}
                            {notification.type === 'info' && <Info className="text-blue-500" size={16} />}
                          </div>
                          <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-900">
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        showToast('Viewing all notifications is coming soon', 'info');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      View All
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Harsh Gupta</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sales Director</p>
          </div>
          <button onClick={() => onNavigate ? onNavigate('profile') : showToast('Go to sidebar for profile', 'info')} className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors overflow-hidden">
            {localStorage.getItem('nexus-avatar') ? (
              <img src={localStorage.getItem('nexus-avatar') || undefined} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'block'; }} className="w-full h-full object-cover" alt="User" />
            ) : null}
            <span className={localStorage.getItem('nexus-avatar') ? "hidden" : ""}>
              <User size={18} />
            </span>
          </button>
        </div>
      </div>
      
      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={onNavigate || (() => {})} 
      />
    </header>
  );
}
