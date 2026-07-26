import { useState, useEffect } from 'react';
import { Sidebar, type Page } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Pipeline } from './pages/Pipeline';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { Login, type UserRole } from './pages/Login';
import { Register } from './pages/Register';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from './components/Skeleton';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderAuth = () => {
    if (authView === 'login') {
      return (
        <Login 
          onLogin={(role) => {
            setIsAuthenticated(true);
            setUserRole(role);
          }} 
          onNavigateToRegister={() => setAuthView('register')} 
        />
      );
    }
    return (
      <Register 
        onRegister={() => setIsAuthenticated(true)} 
        onNavigateToLogin={() => setAuthView('login')} 
      />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl mt-6" />
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <Leads />;
      case 'pipeline':
        return <Pipeline />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return userRole === 'Admin' ? <Admin /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {!isAuthenticated ? (
          renderAuth()
        ) : (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            <div className="print:hidden">
              <Sidebar 
              currentPage={currentPage} 
              onNavigate={handleNavigate} 
              onLogout={() => {
                setIsAuthenticated(false);
                setCurrentPage('dashboard');
              }}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              userRole={userRole}
            />
            </div>
            
            <div className="flex-1 lg:ml-64 print:ml-0 flex flex-col min-h-screen min-w-0">
              <div className="print:hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} onNavigate={handleNavigate} />
              </div>
              
              <main className="flex-1 p-4 sm:p-8 print:p-0 overflow-auto print:overflow-visible">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
