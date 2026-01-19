
import React from 'react';
import { useApp } from '../App';
import { Theme, Language, UserRole } from '../types';
import { 
  Settings, User, Lock, Globe, Bell, Key, 
  ChevronRight, Moon, Sun, ShieldCheck, 
  Database, Zap, Eye, Smartphone
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const { theme, setTheme, language, setLanguage, triggerKeySelection, isDark, user, t } = useApp();
  const isAdmin = user?.role === UserRole.SUPER_ADMIN;

  return (
    <div className={`p-8 md:p-12 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
            {isAdmin ? 'System Preferences' : 'My Preferences'}
          </h1>
          <p className="text-[10px] font-black uppercase opacity-40 mt-2 tracking-[0.3em]">
            {isAdmin ? 'System Configuration & Terminal Control' : 'Personal Profile & Interface Control'}
          </p>
        </div>

        {/* Profile Section */}
        <section className={`p-10 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center gap-6 mb-10">
            <img src={user?.avatar} className="w-20 h-20 rounded-[2rem] object-cover shadow-2xl" alt="Avatar" />
            <div>
              <h3 className="text-xl font-black">{user?.name}</h3>
              <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                {user?.role} • {user?.organization}
              </p>
            </div>
          </div>
          <button className={`w-full py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            {isAdmin ? 'Edit Profile Credentials' : 'Update Contact Info'} <ChevronRight size={14} />
          </button>
        </section>

        {/* Core Settings Grid */}
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
          
          {/* Theme & Language */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase opacity-40 tracking-widest ml-4">Interface</h4>
            <div className={`p-8 rounded-[2.5rem] border space-y-8 transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Moon size={20}/></div>
                  <span className="text-xs font-black uppercase tracking-tight">Dark Mode</span>
                </div>
                <button 
                  onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
                  className={`w-14 h-8 rounded-full relative transition-all ${isDark ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${isDark ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Globe size={20}/></div>
                  <span className="text-xs font-black uppercase tracking-tight">Regional Language</span>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className={`bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer ${isDark ? 'text-white' : 'text-slate-600'}`}
                >
                  <option value={Language.EN}>English (UK)</option>
                  <option value={Language.HI}>हिन्दी (India)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Connectivity (Admin Only) */}
          {isAdmin && (
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase opacity-40 tracking-widest ml-4">Intelligence Hub</h4>
              <div className={`p-8 rounded-[2.5rem] border space-y-8 transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Zap size={20}/></div>
                    <span className="text-xs font-black uppercase tracking-tight">Gemini API Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[9px] font-black uppercase opacity-40">Connected</span>
                  </div>
                </div>

                <button 
                  onClick={triggerKeySelection}
                  className="w-full py-5 bg-[#FF8C00] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Key size={16} /> Update API Key Selection
                </button>
                
                <p className="text-[9px] text-center font-bold opacity-30 leading-relaxed px-4">
                  Required for Smart Audit, Grounding, and Site Analysis features.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Section */}
        <section className={`p-10 rounded-[3rem] border transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                {isAdmin ? <ShieldCheck size={24}/> : <Lock size={24}/>}
              </div>
              <h3 className="text-xl font-black">
                {isAdmin ? 'Protocol Security' : 'Account Security'}
              </h3>
           </div>
           
           <div className="space-y-4">
              {[
                { 
                  label: 'Two-Factor Authentication', 
                  status: isAdmin ? 'Mandatory' : 'Active', 
                  icon: <Lock size={16}/>,
                  show: true 
                },
                { 
                  label: isAdmin ? 'Global Device History' : 'Recent Access Points', 
                  status: 'View Log', 
                  icon: <Database size={16}/>,
                  show: true
                },
                { 
                  label: 'Biometric Unlock', 
                  status: 'Disabled', 
                  icon: <Eye size={16}/>,
                  show: true
                },
                { 
                  label: 'GPS Access Permissions', 
                  status: 'Authorized', 
                  icon: <Smartphone size={16}/>,
                  show: !isAdmin 
                }
              ].filter(item => item.show).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-500/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="opacity-30 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase opacity-40 group-hover:opacity-100">{item.status}</span>
                </div>
              ))}
           </div>
        </section>

        <div className="text-center pb-20">
           <p className="text-[10px] font-black uppercase opacity-20 tracking-[1em]">
             {isAdmin ? 'Enterprise Build v1.0.4-Stable' : 'Terminal Build v1.0.4-Mobile'}
           </p>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
