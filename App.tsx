
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Language, Theme, UserRole, User, AppView, Project, InventoryItem, Task, ProjectStatus } from './types';
import { translations } from './translations';
import AdminDashboard from './views/AdminDashboard';
import StaffHome from './views/StaffHome';
import StaffCreation from './views/StaffCreation';
import Login from './views/Login';
import Navigation from './components/Navigation';

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
  // Master Data
  projects: Project[];
  staff: User[];
  inventory: InventoryItem[];
  tasks: Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

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

  // ORIGINAL DATA - PRD ALIGNED
  const [projects] = useState<Project[]>([
    { 
      id: 'P001', 
      name: 'Street Lighting - Rajendra Nagar Phase 2', 
      client: 'Patna Municipal Corporation', 
      status: ProjectStatus.IN_PROGRESS, 
      progress: 75, 
      deadline: '2026-04-30', 
      location: 'Rajendra Nagar, Sector 4',
      description: 'Installation of 50 LED poles and smart control infrastructure.',
      budget: 1500000,
      phase: 'Installation'
    },
    { 
      id: 'P002', 
      name: 'Smart Poles - Zone B High Mast', 
      client: 'Ranchi Urban Development', 
      status: ProjectStatus.ATTENTION_NEEDED, 
      progress: 10, 
      deadline: '2026-05-12', 
      location: 'Main Road, Zone B',
      description: 'Deploying smart high-mast lights with CCTV integration.',
      budget: 2800000,
      phase: 'Material Procurement'
    },
    { 
      id: 'P003', 
      name: 'Solar Integration - Highway NH-33', 
      client: 'NHAI', 
      status: ProjectStatus.PLANNING, 
      progress: 0, 
      deadline: '2026-08-15', 
      location: 'NH-33, Mile 45-60',
      description: 'Hybrid solar lighting for high-visibility zones.',
      budget: 4500000,
      phase: 'Site Survey'
    }
  ]);

  const [staff] = useState<User[]>([
    { id: 'S001', name: 'Rajesh Kumar', role: UserRole.SITE_SUPERVISOR, status: 'ACTIVE', workload: 85, avatar: 'https://i.pravatar.cc/150?u=s1' },
    { id: 'S002', name: 'Priya Sharma', role: UserRole.TECHNICIAN, status: 'ACTIVE', workload: 90, avatar: 'https://i.pravatar.cc/150?u=s2' },
    { id: 'S003', name: 'Anil Singh', role: UserRole.ELECTRICIAN, status: 'ACTIVE', workload: 40, avatar: 'https://i.pravatar.cc/150?u=s3' },
    { id: 'S004', name: 'Sunil Verma', role: UserRole.WAREHOUSE_MANAGER, status: 'ACTIVE', workload: 20, avatar: 'https://i.pravatar.cc/150?u=s4' }
  ]);

  const [inventory] = useState<InventoryItem[]>([
    { id: 'I001', name: '70W LED Fixture (Standard)', category: 'LED_FIXTURES', quantity: 15, reorderPoint: 20, unit: 'pcs', status: 'LOW' },
    { id: 'I002', name: '6.5m Mounting Pole', category: 'POLES', quantity: 120, reorderPoint: 50, unit: 'pcs', status: 'SUFFICIENT' },
    { id: 'I003', name: 'Electrical Armored Cable (4-core)', category: 'CABLES', quantity: 800, reorderPoint: 1000, unit: 'm', status: 'CRITICAL' },
    { id: 'I004', name: 'Pole Foundation Bolts', category: 'HARDWARE', quantity: 450, reorderPoint: 100, unit: 'pcs', status: 'SUFFICIENT' }
  ]);

  const [tasks] = useState<Task[]>([
    { id: 'T001', title: 'Install Poles 1-5', projectId: 'P001', projectName: 'Rajendra Nagar', assignedTo: ['S003'], deadline: 'Today', status: 'URGENT', location: 'Sector 4 Junction', instructions: 'Verify foundation depth min 1m.' },
    { id: 'T002', title: 'Site Survey Zone B', projectId: 'P002', projectName: 'Smart Poles', assignedTo: ['S001'], deadline: 'Tomorrow', status: 'PENDING', location: 'Main Crossing', instructions: 'Identify power supply point.' }
  ]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('khushi-theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('khushi-language', newLang);
  };

  const t = (key: string) => (translations[language] as any)[key] || key;

  const isDark = theme === Theme.DARK;

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.className = 'transition-colors duration-500 bg-[#0b141d]';
    } else {
      root.classList.remove('dark');
      document.body.className = 'transition-colors duration-500 bg-gray-50';
    }
  }, [isDark]);

  const renderContent = () => {
    if (user?.role === UserRole.SUPER_ADMIN) {
      switch (activeView) {
        case AppView.CREATE_STAFF:
          return <StaffCreation />;
        default:
          return <AdminDashboard />;
      }
    }
    return <StaffHome />;
  };

  const value = useMemo(() => ({
    language, theme, setLanguage, setTheme,
    activeView, setActiveView,
    user, setUser, t, isDark,
    projects, staff, inventory, tasks
  }), [language, theme, activeView, user, projects, staff, inventory, tasks]);

  return (
    <AppContext.Provider value={value}>
      <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${isDark ? 'dark text-white' : 'text-gray-900'}`}>
        {!user ? (
          <Login />
        ) : (
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Navigation />
            <main className="flex-1 overflow-y-auto custom-scrollbar">
              {renderContent()}
            </main>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
