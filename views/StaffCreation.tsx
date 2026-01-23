
import React, { useState } from 'react';
import { useApp } from '../App';
import { AppView, Theme, UserRole } from '../types';
import { 
  ChevronRight, RefreshCw, Key, Eye, EyeOff, Send, 
  HelpCircle, CheckCircle2, Globe, MapPin, Loader2
} from 'lucide-react';

const StaffCreation: React.FC = () => {
  const { isDark, setActiveView, setStaff } = useApp();
  const [username, setUsername] = useState('rajesh.k2026');
  const [password, setPassword] = useState('khushitech@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [step] = useState(2);

  const handleRefreshUsername = () => {
    const rand = Math.floor(Math.random() * 9000) + 1000;
    setUsername(`rajesh.k${rand}`);
  };

  const handleRotateEncryption = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let newPass = "";
    for (let i = 0; i < 12; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  const handleProvision = () => {
    setIsProvisioning(true);
    // Simulate encryption and sync latency
    setTimeout(() => {
      const newUser = {
        id: `S-${Date.now()}`,
        name: 'Rajesh Kumar',
        role: UserRole.SITE_SUPERVISOR,
        status: 'ACTIVE' as const,
        workload: 0,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        organization: 'Khushi Technology'
      };
      setStaff(prev => [...prev, newUser]);
      setIsProvisioning(false);
      setActiveView(AppView.DASHBOARD);
    }, 2000);
  };

  const cardStyle = `rounded-[2.5rem] border transition-all duration-500 ${
    isDark 
      ? 'bg-[#0f172a]/80 backdrop-blur-3xl border-slate-800 shadow-2xl shadow-black/60' 
      : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/50'
  }`;

  return (
    <div className={`p-6 md:p-12 min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#0b141d]' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
        
        <div className={cardStyle}>
          
          {/* Header Section with Stepper */}
          <div className="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-inherit">
            <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
              Provision Personnel
            </h1>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                {[
                  { n: 1, label: 'Profile' },
                  { n: 2, label: 'Credentials' },
                  { n: 3, label: 'Finalize' }
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-300 ${
                      s.n === step 
                        ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30 ring-2 ring-orange-500/20' 
                        : 'opacity-30'
                    }`}>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em]">{s.label}</span>
                      {s.n < 3 && <ChevronRight size={14} className="opacity-40" />}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={`p-4 rounded-2xl transition-all active:scale-90 border ${
                isDark ? 'bg-blue-600/10 border-white/5 text-blue-500 hover:bg-blue-600/20' : 'bg-[#002366] text-white shadow-lg'
              }`}>
                <HelpCircle size={22} />
              </button>
            </div>
          </div>

          <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Side: Parameters and Controls */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Site Mapping Parameters
                </h3>
                
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 rounded-3xl border transition-colors ${
                  isDark ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Staff Node</p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rajesh Kumar</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Deployment Role</p>
                    <p className="text-sm font-black text-orange-600">Site Supervisor</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Operational ID</p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>EMP-2026-045</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2 tracking-widest">Access Username</label>
                  <div className="flex gap-4">
                    <div className={`flex-1 relative h-14 flex items-center px-6 rounded-2xl border transition-all duration-300 ${
                      isDark ? 'bg-slate-800/40 border-white/10 focus-within:border-orange-500/50 focus-within:bg-slate-800/60' : 'bg-white border-slate-200 focus-within:border-orange-500/50 shadow-sm'
                    }`}>
                      <input 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={`bg-transparent border-none outline-none text-base font-bold w-full ${isDark ? 'text-white' : 'text-[#002366]'}`}
                        spellCheck={false}
                      />
                    </div>
                    <button 
                      onClick={handleRefreshUsername}
                      className="px-6 h-14 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/30 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <RefreshCw size={18} /> Refresh
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2 tracking-widest">Master KeyToken</label>
                  <div className="space-y-5">
                    <div className={`relative h-14 flex items-center px-6 rounded-2xl border transition-all duration-300 ${
                      isDark ? 'bg-slate-800/40 border-white/10 focus-within:border-orange-500/50 focus-within:bg-slate-800/60' : 'bg-white border-slate-200 focus-within:border-orange-500/50 shadow-sm'
                    }`}>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`bg-transparent border-none outline-none text-base font-bold w-full ${isDark ? 'text-white' : 'text-[#002366]'}`}
                        spellCheck={false}
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="p-2 opacity-30 hover:opacity-100 transition-opacity"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button 
                      onClick={handleRotateEncryption}
                      className={`w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all ${
                        isDark ? 'bg-blue-600/10 border border-white/5 text-blue-500 hover:bg-blue-600/20' : 'bg-[#002366] text-white'
                      }`}
                    >
                      <Key size={18} /> Rotate Encryption
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-inherit">
                <div className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isDark ? 'border-orange-600 bg-orange-600/20' : 'border-orange-500 bg-orange-50'
                  }`}>
                    <CheckCircle2 size={16} className="text-orange-600" />
                  </div>
                  <span className={`text-xs font-black tracking-tight opacity-70 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Mandatory reset on first deployment uplink
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Deployment Dossier Card */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Deployment Dossier
                </h3>
                
                <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                  {/* Glowing Animated Edge */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 animate-pulse transition-all duration-700"></div>
                  
                  <div className={`relative p-12 min-h-[440px] border overflow-hidden transition-all duration-500 ${
                    isDark ? 'bg-[#0f172a] border-white/10' : 'bg-[#002366] border-blue-900'
                  }`}>
                    
                    {/* Abstract Wireframe Backgrounds */}
                    <div className="absolute -top-16 -right-16 opacity-[0.03] pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-transform duration-[3000ms]">
                       <Globe size={400} className="text-white" strokeWidth={0.5} />
                    </div>
                    <div className="absolute -bottom-24 -left-24 opacity-[0.05] pointer-events-none">
                       <MapPin size={280} className="text-white" strokeWidth={0.5} />
                    </div>

                    <div className={`mb-10 px-6 py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.3em] shadow-xl inline-block ${
                      isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-400/20' : 'bg-orange-600 text-white'
                    }`}>
                      Node Finalized
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-white">Operational Identifier</p>
                        <p className="text-3xl font-black text-white tracking-tighter leading-none break-all">
                          {username}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-white">Site Assignment Status</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-black text-white/90">Awaiting Signal</p>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                        </div>
                      </div>
                      
                      <div className="pt-8 border-t border-white/10">
                         <p className="text-xs font-bold text-white/40 leading-relaxed italic max-w-xs">
                           Encryption keys synchronized with Global Node 01-A. Ready for real-time personnel provisioning.
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <button 
                  onClick={handleProvision}
                  disabled={isProvisioning}
                  className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-orange-600/40 flex items-center justify-center gap-4 active:scale-[0.97] transition-all disabled:opacity-50"
                >
                  {isProvisioning ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Send size={22} />
                  )}
                  {isProvisioning ? 'Encrypting Node...' : 'Provision Access'}
                </button>
                <button 
                  onClick={() => setActiveView(AppView.DASHBOARD)}
                  className={`w-full h-16 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] border transition-all active:scale-[0.97] ${
                    isDark 
                      ? 'border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10' 
                      : 'border-blue-900/20 text-[#002366] hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  Cancel Protocol
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center opacity-20 pb-16">
           <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${isDark ? 'text-white' : 'text-[#002366]'}`}>
             Security Module v1.0.4-S • Distributed Ops • Khushi Technology
           </p>
        </div>

      </div>
    </div>
  );
};

export default StaffCreation;
