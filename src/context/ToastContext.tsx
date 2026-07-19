import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';
import { cn } from '../utils';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface Notification {
  id: string;
  message: string;
  type: ToastType;
  date: string;
  read: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('nexus-notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nexus-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Add to notifications as well
    setNotifications(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        date: new Date().toISOString(),
        read: false
      },
      ...prev
    ].slice(0, 50)); // keep last 50
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ToastContext.Provider value={{ showToast, notifications, unreadCount, markAllAsRead, clearNotifications }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 min-w-[250px] bg-white dark:bg-slate-900"
            >
              {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
              {toast.type === 'error' && <XCircle className="text-red-500" size={20} />}
              {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
