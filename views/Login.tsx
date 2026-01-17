
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, Theme, Language } from '../types';
import { Shield, Eye, EyeOff, Moon, Sun, Building2, UserCircle, Mail, AlertCircle, KeyRound, ChevronRight, ArrowLeft } from 'lucide-react';

interface MockUser {
  username: string;
  email: string;
  orgName: string;
  adminName: string;
  role: UserRole;
}

const Login: React.FC = () => {
  const { setTheme, setLanguage, theme, language, setUser, t, isDark } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  
  // Form Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');

  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  // Persistence logic for mock DB
  const getDB = (): MockUser[] => {
    const db = localStorage.getItem('khushi_users_db');
    return db ? JSON.parse(db) : [];
  };

  const saveUser = (u: MockUser) => {
    const db = getDB();
    const updated = [...db.filter(x => x.username !== u.username), u];
    localStorage.setItem('khushi_users_db', JSON.stringify(updated));
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Registration flow
      const newUser: MockUser = {
        username,
        email: email || 'admin@khushitech.com',
        orgName: orgName || 'Khushi Technology',
        adminName: adminName || username,
        role: isAdminLogin ? UserRole.SUPER_ADMIN : UserRole.SITE_SUPERVISOR
      };
      saveUser(newUser);
      setCurrentUser(newUser);
      
      // If Super Admin, go to 2FA first
      if (isAdminLogin) {
        setIsVerifying2FA(true);
      } else {
        // Staff goes straight in
        finalizeLogin(newUser);
      }
    } else {
      // Login flow
      const db = getDB();
      const found = db.find(u => u.username === username);
      
      if (isAdminLogin) {
        // Super Admin MUST pass 2FA
        if (found && found.role === UserRole.SUPER_ADMIN) {
          setCurrentUser(found);
          setIsVerifying2FA(true);
        } else {
          setError(t('invalidUser'));
        }
      } else {
        // Staff/Other roles login directly
        const staffUser = found || { 
          username, 
          email: '', 
          orgName: 'Khushi Tech', 
          adminName: username, 
          role: UserRole.SITE_SUPERVISOR 
        };
        finalizeLogin(staffUser);
      }
    }
  };

  const finalizeLogin = (u: MockUser) => {
    setUser({
      id: u.username,
      name: u.adminName,
      role: u.role,
      email: u.email,
      organization: u.orgName,
      avatar: `https://picsum.photos/seed/${u.username}/100/100`
    });
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1 || isNaN(Number(val))) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    // Auto-focus next input
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      if (currentUser) {
        finalizeLogin(currentUser);
      }
    } else {
      setError('Please enter a complete 6-digit code.');
    }
  };

  if (isVerifying2FA) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-y-auto transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-blue-700'}`}>
        {/* Background blobs for depth */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#002366] rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF8C00] rounded-full blur-[120px] opacity-20"></div>
        </div>

        <div className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-300 transition-colors ${
          isDark ? 'bg-[#16222c] border-white/10 text-white' : 'bg-white border-white/20 text-[#002366]'
        }`}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-[#FF8C00] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
              <KeyRound size={40} className="text-white" />
            </div>
            <h3 className="text-3xl font-black mb-3">{t('twoFactorAuth')}</h3>
            <p className="text-sm opacity-50 px-6 leading-relaxed">
              {t('otpSent')} <br/>
              <span className="text-[#FF8C00] font-bold text-base mt-2 block break-all">
                {currentUser?.email}
              </span>
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-10">
            {otp.map((d, i) => (
              <input 
                key={i} 
                id={`otp-${i}`} 
                type="text" 
                maxLength={1} 
                value={d} 
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[i] && i > 0) {
                    document.getElementById(`otp-${i - 1}`)?.focus();
                  }
                }}
                className={`w-full aspect-square border-2 rounded-2xl text-center text-2xl font-black focus:border-[#FF8C00] outline-none transition-all shadow-inner ${
                  isDark ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-gray-50 border-gray-100 text-[#002366] focus:bg-white'
                }`} 
              />
            ))}
          </div>

          <button 
            onClick={handleOtpVerify} 
            className="w-full py-5 bg-[#FF8C00] rounded-2xl font-black text-lg shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform text-white"
          >
            {t('verify')}
          </button>
          
          <div className="text-center mt-8">
            <button className="text-xs font-bold text-[#FF8C00] opacity-70 hover:opacity-100 transition-all underline underline-offset-4">
              {t('resendOtp')}
            </button>
          </div>

          <button 
            onClick={() => {
              setIsVerifying2FA(false);
              setOtp(['', '', '', '', '', '']);
            }} 
            className={`w-full mt-10 text-xs font-black opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center justify-center gap-2 ${isDark ? 'text-white' : 'text-[#002366]'}`}
          >
            <ArrowLeft size={14} /> {t('backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-blue-800'}`}>
      {/* Dynamic Background */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#002366] rounded-full blur-[120px] opacity-20 -z-10"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#FF8C00] rounded-full blur-[120px] opacity-20 -z-10"></div>
      
      <div className={`relative w-full max-w-5xl grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700 ${
        isDark ? 'border-white/10 bg-slate-900/40 backdrop-blur-3xl' : 'border-white/20 bg-white/90 backdrop-blur-xl'
      }`}>
        
        {/* Left Branding Side */}
        <div className={`hidden md:flex flex-col justify-between p-12 text-white bg-gradient-to-br transition-colors duration-500 ${
          isDark ? 'from-[#002366] to-[#001c4d]' : 'from-[#003399] to-[#002366]'
        }`}>
          <div>
            <div className="mb-10 w-20 h-20 bg-[#FF8C00] rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Shield size={40} />
            </div>
            <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter">KHUSHI<br/><span className="text-orange-400">TECHNOLOGY</span></h2>
            <p className="text-blue-100/80 text-xl font-medium max-w-xs leading-relaxed">The Unified Digital Backbone for Infrastructure Contractors.</p>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-xl font-bold text-orange-400">Secure Protocol</p>
              <p className="text-[10px] uppercase tracking-widest font-black opacity-60">Multi-Factor Authentication</p>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={`p-8 md:p-14 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#002366]'}`}>
          <div className="flex justify-between items-center mb-10">
            <div className={`flex p-1 rounded-xl text-xs font-black border transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
              <button onClick={() => setLanguage(Language.EN)} className={`px-4 py-2 rounded-lg transition-all ${language === Language.EN ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-[#002366] shadow-sm') : 'opacity-40 hover:opacity-100'}`}>EN</button>
              <button onClick={() => setLanguage(Language.HI)} className={`px-4 py-2 rounded-lg transition-all ${language === Language.HI ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-[#002366] shadow-sm') : 'opacity-40 hover:opacity-100'}`}>हिंदी</button>
            </div>
            <button 
              onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)} 
              className={`p-3 rounded-xl border transition-colors ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-[#002366]'}`}
            >
              {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-4xl font-black mb-3 tracking-tight">
              {isRegistering ? t('createAccount') : (isAdminLogin ? t('superAdminPanel') : t('staffPanel'))}
            </h3>
            <p className="text-base opacity-50 font-medium">
              {isRegistering ? "Set up your organization account." : "Access your digital command center."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-pulse">
              <AlertCircle size={16}/>
              {error}
            </div>
          )}

          <form onSubmit={handleInitialSubmit} className="space-y-5">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">{t('orgName')}</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18}/>
                    <input 
                      required 
                      value={orgName} 
                      onChange={e => setOrgName(e.target.value)} 
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent outline-none transition-all ${isDark ? 'bg-white/5 focus:border-[#FF8C00] text-white' : 'bg-gray-50 focus:border-[#FF8C00] text-[#002366]'}`} 
                      placeholder="e.g., Khushi Infra Ltd"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">{t('adminName')}</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18}/>
                    <input 
                      required 
                      value={adminName} 
                      onChange={e => setAdminName(e.target.value)} 
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent outline-none transition-all ${isDark ? 'bg-white/5 focus:border-[#FF8C00] text-white' : 'bg-gray-50 focus:border-[#FF8C00] text-[#002366]'}`} 
                      placeholder="Super Admin Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18}/>
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent outline-none transition-all ${isDark ? 'bg-white/5 focus:border-[#FF8C00] text-white' : 'bg-gray-50 focus:border-[#FF8C00] text-[#002366]'}`} 
                      placeholder="admin@gmail.com"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">{t('username')}</label>
              <input 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className={`w-full px-5 py-4 rounded-2xl border-2 border-transparent outline-none transition-all ${isDark ? 'bg-white/5 focus:border-[#FF8C00] text-white' : 'bg-gray-50 focus:border-[#FF8C00] text-[#002366]'}`} 
                placeholder="Username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">{t('password')}</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className={`w-full px-5 py-4 rounded-2xl border-2 border-transparent outline-none transition-all ${isDark ? 'bg-white/5 focus:border-[#FF8C00] text-white' : 'bg-gray-50 focus:border-[#FF8C00] text-[#002366]'}`} 
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#FF8C00] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-transform flex items-center justify-center gap-3">
              {isRegistering ? t('register') : t('login')}
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-sm font-bold opacity-60 hover:text-[#FF8C00] hover:opacity-100 transition-all">
              {isRegistering ? t('alreadyHaveAccount') : t('newContractor')}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => {
                setIsAdminLogin(!isAdminLogin);
                setIsRegistering(false);
                setError('');
              }} 
              className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              {isAdminLogin ? "Access Staff Portal" : "Return to Admin Terminal"} 
              <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
