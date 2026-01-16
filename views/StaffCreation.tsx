
import React, { useState } from 'react';
import { useApp } from '../App';
import { AppView, Theme, UserRole } from '../types';
import { ChevronRight, RefreshCw, Key, Eye, EyeOff, Send, ArrowLeft, HelpCircle, CheckCircle2 } from 'lucide-react';

const StaffCreation: React.FC = () => {
  const { theme, setActiveView, isDark } = useApp();
  const [username, setUsername] = useState('rajesh.k2026');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(2); // Starting at Credentials step for demo

  const isDarkMode = theme === Theme.DARK;

  return (
    <div className={`p-8 min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0b141d]' : 'bg-blue-600'}`}>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Main Content Card */}
        <div className={`rounded-[3rem] overflow-hidden shadow-2xl border transition-all ${
          isDarkMode 
            ? 'bg-[#16222c]/80 backdrop-blur-2xl border-white/10' 
            : 'bg-white border-white/20'
        }`}>
          
          {/* Header & Stepper */}
          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-inherit">
            <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>
              Create New Staff Credentials
            </h1>
            
            <div className={`flex items-center gap-1 p-1.5 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
              {[
                { n: 1, label: 'Staff Profile' },
                { n: 2, label: 'Credentials' },
                { n: 3, label: 'Review & Finish' }
              ].map((s) => (
                <div key={s.n} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  s.n === step 
                    ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-500/20' 
                    : 'opacity-40'
                }`}>
                  <span className={`${isDarkMode ? 'text-white' : 'text-[#002366]'} ${s.n === step ? 'text-white' : ''}`}>{s.label}</span>
                  {s.n < 3 && <ChevronRight size={14} className="opacity-40" />}
                </div>
              ))}
            </div>
            
            <button className="p-3 rounded-2xl bg-[#002366] text-white shadow-lg active:scale-95 transition-all">
              <HelpCircle size={24} />
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Generation */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <h3 className={`text-xs font-black tracking-widest uppercase opacity-80 ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>
                  Credential Generation
                </h3>
                
                {/* Info Bar */}
                <div className={`grid grid-cols-3 gap-4 p-6 rounded-[2rem] border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-blue-50 border-blue-100'}`}>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1">Full Name:</p>
                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>Rajesh Kumar</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1">Role:</p>
                    <p className="text-sm font-black text-blue-500">Site Supervisor</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1">Employee ID:</p>
                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>EMP-2026-045</p>
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-3">
                <label className={`text-[10px] font-black uppercase opacity-60 ml-1 tracking-widest ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>Username</label>
                <div className="flex gap-4">
                  <div className={`flex-1 relative h-16 flex items-center px-6 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <input 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className={`bg-transparent border-none outline-none text-sm font-black w-full ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}
                    />
                  </div>
                  <button className="px-8 bg-[#FF8C00] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2">
                    <RefreshCw size={16} /> Regenerate
                  </button>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <label className={`text-[10px] font-black uppercase opacity-60 ml-1 tracking-widest ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>Password</label>
                   <p className="text-[10px] font-black uppercase opacity-40">Temporary Password</p>
                </div>
                
                <div className="space-y-4">
                  <div className={`relative h-16 flex items-center px-6 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`bg-transparent border-none outline-none text-sm font-black w-full ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="opacity-40 hover:opacity-100 flex items-center gap-2">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Show</span>
                    </button>
                  </div>
                  
                  <button className="w-full h-16 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                    <Key size={18} /> Generate Secure Password
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-6 h-6 rounded-lg border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-orange-500" />
                  </div>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>User must change password on first login</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer opacity-50">
                  <div className="w-6 h-6 rounded-lg border-2 border-white/20"></div>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Send credentials via Email & SMS</span>
                </div>
              </div>

              {/* Contact Preview */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase opacity-40 ml-1">Email Address</p>
                    <div className={`h-14 flex items-center px-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                      <span className="text-sm font-bold opacity-70">rajesh.kumar@email.com</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase opacity-40 ml-1">Phone Number</p>
                    <div className={`h-14 flex items-center px-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                      <span className="text-sm font-bold opacity-70">+91 98765 43210</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div className="space-y-4">
                <h3 className={`text-xs font-black tracking-widest uppercase opacity-80 ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>
                  Credential Summary & Actions
                </h3>
                
                {/* Summary Card */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className={`relative p-8 rounded-[2.5rem] border overflow-hidden ${
                    isDarkMode ? 'bg-[#1e2d3d] border-white/10' : 'bg-orange-500 border-orange-400'
                  }`}>
                    <div className={`mb-8 px-6 py-3 rounded-full text-center text-xs font-black uppercase tracking-[0.2em] ${
                      isDarkMode ? 'bg-blue-500 text-white' : 'bg-[#002366] text-white'
                    }`}>
                      New Credentials Ready
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'opacity-40' : 'text-white/60'}`}>Username:</p>
                        <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-white'}`}>{username}</p>
                      </div>
                      
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'opacity-40' : 'text-white/60'}`}>Temporary Password:</p>
                        <div className="flex items-center gap-3">
                          <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-white'}`}>[Hidden]</p>
                          <EyeOff size={20} className={isDarkMode ? 'opacity-40' : 'text-white/60'} />
                        </div>
                      </div>
                      
                      <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-white/10'}`}>
                         <p className={`text-[10px] font-black opacity-60 italic leading-relaxed ${isDarkMode ? 'text-white' : 'text-white'}`}>
                           Will be sent to: rajesh.kumar@email.com & +91 98765 43210
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                <button className="w-full h-20 bg-[#FF8C00] text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all">
                  <Send size={24} /> Create & Send Credentials
                </button>
                <button 
                  onClick={() => setActiveView(AppView.DASHBOARD)}
                  className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all active:scale-[0.98] ${
                    isDarkMode 
                      ? 'border-white/10 text-white hover:bg-white/5' 
                      : 'border-[#002366] text-[#002366] hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center opacity-40">
           <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-white' : 'text-[#002366]'}`}>Khushi Technology Security Protocol 4.2.1</p>
        </div>

      </div>
    </div>
  );
};

export default StaffCreation;
