
import React from 'react';
import { useApp } from '../App';
import { Theme, Language, AppView } from '../types';
import { MENU_ITEMS } from '../constants';
import { Sun, Moon, Languages, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

const Navigation: React.FC = () => {
  const { theme, language, setTheme, setLanguage, setUser, activeView, setActiveView, t } = useApp();

  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  const toggleLanguage = () => setLanguage(language === Language.EN ? Language.HI : Language.EN);

  const isDark = theme === Theme.DARK;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col w-[300px] h-screen sticky top-0 transition-all duration-500 z-[60] ${
          isDark ? 'bg-[#0b141d] border-r border-white/5' : 'bg-white border-r border-gray-200'
        }`}
      >
        <div className="p-10 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C00] to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className={`font-black text-xl leading-tight tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>KHUSHI</h1>
            <p className="text-[10px] uppercase font-black opacity-30 tracking-[0.3em]">Technology</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-4 overflow-y-auto custom-scrollbar">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AppView)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all group relative ${
                activeView === item.id 
                  ? 'bg-[#FF8C00] text-white shadow-xl shadow-orange-500/20' 
                  : isDark 
                    ? 'hover:bg-white/5 text-gray-500 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`${activeView === item.id ? 'text-white' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-black tracking-tight ${language === Language.HI ? 'hindi-font' : ''}`}>
                  {t(item.label)}
                </span>
              </div>
              {item.hasSub && (
                <ChevronDown size={14} className={`${activeView === item.id ? 'text-white/60' : 'opacity-30 group-hover:opacity-60'}`} />
              )}
              {activeView === item.id && (
                <div className="absolute -left-6 w-1.5 h-8 bg-[#FF8C00] rounded-r-full shadow-[0_0_15px_rgba(255,140,0,0.5)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-6">
          <div className={`p-6 rounded-[2rem] space-y-5 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-30 text-center">Preference Control</p>
            <div className="flex gap-2">
              <button 
                onClick={toggleTheme}
                className={`flex-1 h-12 flex items-center justify-center rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all ${
                  isDark ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-white border border-gray-200 text-gray-700 shadow-gray-200/50'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={toggleLanguage}
                className={`flex-[2] h-12 flex items-center justify-center space-x-2 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <Languages size={18} className="opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest">{language === Language.EN ? 'English' : 'हिंदी'}</span>
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center space-x-3 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] border border-transparent ${
              isDark ? 'text-red-400 hover:bg-red-400/5 hover:border-red-400/20' : 'text-red-500 hover:bg-red-500/5 hover:border-red-500/20'
            }`}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav (Simplified) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around z-50 rounded-t-[2.5rem] shadow-2xl transition-colors duration-500 ${
        isDark ? 'bg-[#0b141d] border-white/5' : 'bg-white border-gray-100'
      }`}>
        {MENU_ITEMS.slice(0, 4).map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id as AppView)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeView === item.id ? 'text-[#FF8C00] scale-110' : 'text-gray-400 opacity-60'}`}
          >
            <div className={`p-2 rounded-xl ${activeView === item.id ? 'bg-orange-500/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{t(item.label).slice(0, 4)}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
