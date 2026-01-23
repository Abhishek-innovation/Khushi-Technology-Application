
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
    { id: AppView.DASHBOARD, icon: <LayoutGrid size={20} />, label: 'dashboard', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
    { id: AppView.PROJECTS, icon: <Folder size={20} />, label: 'projects', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.STAFF, icon: <Users size={20} />, label: 'staff', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.INVENTORY, icon: <Briefcase size={20} />, label: 'inventory', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.WAREHOUSE_MANAGER, UserRole.TECHNICIAN] },
    { id: AppView.REPORTS, icon: <FileText size={20} />, label: 'reports', roles: [UserRole.SUPER_ADMIN] },
    { id: AppView.COMMUNICATION, icon: <MessageSquare size={20} />, label: 'communication', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
    { id: AppView.SETTINGS, icon: <Settings size={20} />, label: 'settings', roles: [UserRole.SUPER_ADMIN, UserRole.SITE_SUPERVISOR, UserRole.TECHNICIAN, UserRole.ELECTRICIAN, UserRole.WAREHOUSE_MANAGER] },
  ];

  // Filter items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || UserRole.TECHNICIAN)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 transition-all duration-500 z-[60] ${isDark ? 'bg-[#0b141d] border-r border-white/5' : 'bg-white border-r border-slate-200'}`}>
        <div className="p-10 pb-12 flex items-center space-x-5">
          <div className="w-14 h-14 bg-[#FF8C00] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30 transition-transform hover:rotate-6">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div>
            <h1 className={`font-black text-2xl leading-none tracking-tighter ${isDark ? 'text-white' : 'text-[#002366]'}`}>KHUSHI</h1>
            <p className="text-[9px] uppercase font-black opacity-30 tracking-[0.5em] mt-2 leading-none">Technology</p>
          </div>
        </div>

        <div className="px-10 mb-8">
           <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
             {isAdmin ? t('superAdminPanel') : t('staffPanel')}
           </p>
        </div>

        <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-300 group relative active:scale-95 ${
                activeView === item.id 
                  ? 'bg-[#FF8C00] text-white shadow-2xl shadow-orange-500/20' 
                  : isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-[#002366] hover:bg-slate-50'
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center transition-all duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110 opacity-50 group-hover:opacity-100'}`}>
                {item.icon}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-[0.15em] text-left leading-none pt-0.5 ${language === Language.HI ? 'hindi-font' : ''}`}>
                {t(item.label)}
              </span>
              {activeView === item.id && (
                <div className="absolute right-6 w-2 h-2 rounded-full bg-white/40"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-inherit space-y-8">
          <div className={`p-3 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
             <button onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)} className={`p-3 rounded-xl transition-all active:scale-90 ${isDark ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white text-orange-500 shadow-sm border border-slate-100'}`}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button onClick={() => setLanguage(language === Language.EN ? Language.HI : Language.EN)} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-90 ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-white shadow-sm'}`}>
                {language === Language.EN ? 'EN' : 'हिन्दी'}
             </button>
          </div>
          <button onClick={handleLogout} className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] text-rose-500 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-4 active:scale-95 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> {t('terminateSession')}
          </button>
        </div>
      </aside>

      {/* Premium Mobile Navigation - Fixed overlapping, size issues, and alignment */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around z-50 transition-all backdrop-blur-xl ${isDark ? 'bg-[#0b141d]/95 border-white/5' : 'bg-white/95 border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
        <div className="flex items-center justify-around w-full max-w-lg mx-auto h-full px-2">
          {filteredMenuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveView(item.id)} 
                className={`relative flex flex-col items-center justify-center gap-1.5 min-w-[56px] h-full transition-all active:scale-90 ${isActive ? 'text-[#FF8C00]' : 'text-slate-500 opacity-60'}`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { 
                    size: isActive ? 22 : 20,
                    strokeWidth: isActive ? 2.5 : 2
                  })}
                </div>
                
                <span className={`text-[7px] font-black uppercase tracking-[0.1em] text-center max-w-[64px] leading-tight line-clamp-2 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {t(item.label).split(' ')[0]} {/* Use shorter label on mobile */}
                </span>

                {/* Animated active underline dot */}
                {isActive && (
                  <div className="absolute top-2 w-1 h-1 bg-[#FF8C00] rounded-full shadow-[0_0_8px_#FF8C00]"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
