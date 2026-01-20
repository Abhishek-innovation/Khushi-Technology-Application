
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Language, Theme, UserRole, User, AppView, Project, InventoryItem, Task, ProjectStatus } from './types';
import { translations } from './translations';
import AdminDashboard from './views/AdminDashboard';
import StaffHome from './views/StaffHome';
import StaffCreation from './views/StaffCreation';
import ProjectsView from './views/ProjectsView';
import InventoryView from './views/InventoryView';
import ReportsView from './views/ReportsView';
import CommunicationView from './views/CommunicationView';
import Login from './views/Login';
import Navigation from './components/Navigation';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import SettingsView from './views/SettingsView';

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (l: Language) => void;
  setTheme: (t: Theme) => void;
  activeView: AppView;
  setActiveView: (v: AppView) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  t: (key: string) => string;
  isDark: boolean;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  staff: User[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  tasks: Task[];
  triggerKeySelection: () => Promise<void>;
  isOffline: boolean;
  syncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('khushi-language');
    return (saved === Language.EN || saved === Language.HI) ? (saved as Language) : Language.EN;
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('khushi-theme');
    if (saved === Theme.DARK || saved === Theme.LIGHT) return saved as Theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  });

  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setSyncing(true);
      setTimeout(() => setSyncing(false), 2000);
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('kt-projects');
    return saved ? JSON.parse(saved) : [
      { id: 'P001', name: 'Street Lighting - Rajendra Nagar', client: 'Patna Municipal', status: ProjectStatus.IN_PROGRESS, progress: 75, deadline: '2026-04-30', location: 'Rajendra Nagar, Sector 4', description: '50 LED poles installation.', budget: 1500000, phase: 'Installation' },
      { id: 'P002', name: 'Smart Poles - Zone B', client: 'Ranchi Urban', status: ProjectStatus.ATTENTION_NEEDED, progress: 10, deadline: '2026-05-12', location: 'Main Road, Zone B', description: 'CCTV integration.', budget: 2800000, phase: 'Procurement' }
    ];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('kt-inventory');
    return saved ? JSON.parse(saved) : [
      { id: 'I001', name: '70W LED Fixture', category: 'LED_FIXTURES', quantity: 15, reorderPoint: 20, unit: 'pcs', status: 'LOW' },
      { id: 'I002', name: '6.5m Mounting Pole', category: 'POLES', quantity: 120, reorderPoint: 50, unit: 'pcs', status: 'SUFFICIENT' }
    ];
  });

  const [staff] = useState<User[]>([
    { id: 'S001', name: 'Rajesh Kumar', role: UserRole.SITE_SUPERVISOR, status: 'ACTIVE', workload: 85, avatar: 'https://i.pravatar.cc/150?u=s1' },
    { id: 'S002', name: 'Priya Sharma', role: UserRole.TECHNICIAN, status: 'ACTIVE', workload: 90, avatar: 'https://i.pravatar.cc/150?u=s2' }
  ]);

  const [tasks] = useState<Task[]>([
    { id: 'T001', title: 'Install Poles 1-5', projectId: 'P001', projectName: 'Rajendra Nagar', assignedTo: ['S003'], deadline: 'Today', status: 'URGENT', location: 'Sector 4', instructions: 'Verify depth.' }
  ]);

  useEffect(() => {
    localStorage.setItem('kt-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('kt-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('khushi-theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('khushi-language', newLang);
  };

  const triggerKeySelection = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const t = (key: string) => {
    const res = (translations[language] as any)[key];
    return res || key;
  };
  
  const isDark = theme === Theme.DARK;

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.className = 'transition-colors duration-500 bg-[#0b141d] antialiased selection:bg-orange-500 selection:text-white';
    } else {
      root.classList.remove('dark');
      document.body.className = 'transition-colors duration-500 bg-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white';
    }
  }, [isDark]);

  const renderContent = () => {
    // Shared and Role-Specific Routing logic
    switch (activeView) {
      case AppView.DASHBOARD:
        return user?.role === UserRole.SUPER_ADMIN ? <AdminDashboard /> : <StaffHome />;
      case AppView.PROJECTS:
        return user?.role === UserRole.SUPER_ADMIN ? <ProjectsView /> : <StaffHome />;
      case AppView.STAFF:
        return user?.role === UserRole.SUPER_ADMIN ? <StaffHome /> : <StaffHome />; 
      case AppView.CREATE_STAFF:
        return user?.role === UserRole.SUPER_ADMIN ? <StaffCreation /> : <StaffHome />;
      case AppView.INVENTORY:
        return <InventoryView />;
      case AppView.REPORTS:
        return user?.role === UserRole.SUPER_ADMIN ? <ReportsView /> : <StaffHome />;
      case AppView.COMMUNICATION:
        return <CommunicationView />;
      case AppView.SETTINGS:
        return <SettingsView />;
      default:
        return user?.role === UserRole.SUPER_ADMIN ? <AdminDashboard /> : <StaffHome />;
    }
  };

  const value = useMemo(() => ({
    language, theme, setLanguage, setTheme,
    activeView, setActiveView,
    user, setUser, t, isDark,
    projects, setProjects, staff, inventory, setInventory, tasks,
    triggerKeySelection, isOffline, syncing
  }), [language, theme, activeView, user, projects, staff, inventory, tasks, isOffline, syncing]);

  return (
    <AppContext.Provider value={value}>
      <div className={`min-h-screen transition-colors duration-500 overflow-hidden flex flex-col md:flex-row ${isDark ? 'dark text-white/90 font-inter' : 'text-slate-900 font-inter'}`}>
        {!user ? <Login /> : (
          <>
            <Navigation />
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-inherit relative h-screen">
              {/* Offline Banner */}
              {isOffline && (
                <div className="sticky top-0 z-[100] bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <WifiOff size={14} /> {t('offlineMode')}
                  </div>
                  <span className="opacity-70">Data stored locally</span>
                </div>
              )}
              {syncing && (
                <div className="sticky top-0 z-[100] bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" /> {t('syncing')}
                  </div>
                </div>
              )}
              {renderContent()}
            </main>
          </>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
