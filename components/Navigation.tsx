
import React from 'react';
import { useApp } from '../App';
import { Theme, Language, AppView, UserRole } from '../types';
import { 
  LayoutGrid, Folder, Users, Briefcase, FileText, 
  MessageSquare, Sun, Moon, LogOut, ShieldCheck, Settings 
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { theme, language, setTheme, setLanguage, setUser, user, activeView, setActiveView, t } = useApp();

  const handleLogout = () => setUser(null);
  const isDark = theme === Theme.DARK;
  const isAdmin = user?.role === UserRole.SUPER_ADMIN;

  const menuItems = [
    { id: AppView.DASHBOARD, icon: <LayoutGrid size={18} />, label: 'dashboard', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
    { id: AppView.PROJECTS, icon: <Folder size={18} />, label: 'projects', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.STAFF, icon: <Users size={18} />, label: 'staff', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.INVENTORY, icon: <Briefcase size={18} />, label: 'inventory', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.WAREHOUSE_MANAGER, UserRole.TECHNICIAN] },
    { id: AppView.REPORTS, icon: <FileText size={18} />, label: 'reports', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.COMMUNICATION, icon: <MessageSquare size={18} />, label: 'communication', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
    { id: AppView.SETTINGS, icon: <Settings size={18} />, label: 'settings', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
  ];

  // Filter items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || UserRole.TECHNICIAN)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-60 lg:w-64 h-screen sticky top-0 transition-all duration-500 z-[60] ${isDark ? 'bg-[#0b141d] border-r border-white/5' : 'bg-white border-r border-slate-200'}`}>
        <div className="p-6 pb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center shadow-md">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className={`font-black text-lg leading-none tracking-tighter ${isDark ? 'text-white' : 'text-[#002366]'}`}>KHUSHI</h1>
            <p className="text-[7px] uppercase font-black opacity-30 tracking-[0.4em] mt-0.5">Technology</p>
          </div>
        </div>

        <div className="px-6 mb-4">
           <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">
             {isAdmin ? t('superAdminPanel') : t('staffPanel')}
           </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                activeView === item.id 
                  ? 'bg-[#FF8C00] text-white shadow-md' 
                  : isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-[#002366] hover:bg-slate-50'
              }`}
            >
              <span className={`transition-transform duration-200 ${activeView === item.id ? 'scale-105' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${language === Language.HI ? 'hindi-font' : ''}`}>
                {t(item.label)}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-inherit space-y-4">
          <div className={`p-2 rounded-xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
             <button onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-white text-orange-500 shadow-sm'}`}>
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
             </button>
             <button onClick={() => setLanguage(language === Language.EN ? Language.HI : Language.EN)} className={`px-3 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-widest ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-600'}`}>
                {language === Language.EN ? 'EN' : 'हिन्दी'}
             </button>
          </div>
          <button onClick={handleLogout} className="w-full py-3 rounded-lg font-bold text-[9px] uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-2">
            <LogOut size={14} /> {t('terminateSession')}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around z-50 transition-all ${isDark ? 'bg-[#0b141d] border-white/5' : 'bg-white border-slate-200 shadow-lg'}`}>
        {filteredMenuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id)} 
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-95 ${activeView === item.id ? 'text-[#FF8C00]' : 'text-slate-300'}`}
          >
             {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
             <span className="text-[8px] font-bold uppercase tracking-tight">{t(item.label)}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
