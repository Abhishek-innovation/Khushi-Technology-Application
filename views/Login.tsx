
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, Theme, Language } from '../types';
import { 
  Shield, Eye, EyeOff, Moon, Sun, Building2, UserCircle, 
  Mail, AlertCircle, KeyRound, ChevronRight, ArrowLeft 
} from 'lucide-react';

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
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');

  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

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
      const newUser: MockUser = {
        username,
        email: email || 'admin@khushitech.com',
        orgName: orgName || 'Khushi Technology',
        adminName: adminName || username,
        role: isAdminLogin ? UserRole.SUPER_ADMIN : UserRole.SITE_SUPERVISOR
      };
      saveUser(newUser);
      setCurrentUser(newUser);
      if (isAdminLogin) setIsVerifying2FA(true);
      else finalizeLogin(newUser);
    } else {
      const db = getDB();
      const found = db.find(u => u.username === username);
      if (isAdminLogin) {
        if (found && found.role === UserRole.SUPER_ADMIN) {
          setCurrentUser(found);
          setIsVerifying2FA(true);
        } else {
          setError(t('invalidUser'));
        }
      } else {
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
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      if (currentUser) finalizeLogin(currentUser);
    } else {
      setError('Please enter complete 6-digit code.');
    }
  };

  if (isVerifying2FA) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
        <div className={`w-full max-w-sm p-8 rounded-2xl border login-card animate-fade-in ${
          isDark ? 'bg-[#16222c] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <KeyRound size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1">{t('twoFactorAuth')}</h3>
            <p className="text-[10px] opacity-60 leading-relaxed font-medium">
              {t('otpSent')}
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-6">
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
                className={`w-full h-11 border rounded-lg text-center text-lg font-bold outline-none transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 shadow-sm'
                }`} 
              />
            ))}
          </div>

          <button 
            onClick={handleOtpVerify} 
            className="w-full h-11 bg-orange-600 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md text-white active:scale-[0.98]"
          >
            {t('verify')}
          </button>
          
          <button 
            onClick={() => setIsVerifying2FA(false)} 
            className={`w-full mt-6 text-[9px] font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center justify-center gap-2`}
          >
            <ArrowLeft size={12} /> {t('backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen flex items-center justify-center p-4 transition-colors duration-700 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className={`relative w-full max-w-[760px] flex flex-col md:flex-row rounded-3xl overflow-hidden border login-card animate-fade-in ${
        isDark ? 'border-white/5 bg-[#16222c]' : 'border-slate-200 bg-white shadow-xl shadow-slate-300/30'
      }`}>
        
        <div className={`w-full md:w-[38%] flex flex-col justify-between p-8 text-white transition-all duration-700 ${
          isDark ? 'bg-[#001b4d]' : 'bg-[#002366]'
        }`}>
          <div>
            <div className="mb-8 w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield size={24} />
            </div>
            <h2 className="text-xl font-bold mb-4 leading-none tracking-tight uppercase">
              KHUSHI<br/><span className="text-orange-400">TECHNOLOGY</span>
            </h2>
            <p className="text-blue-100/60 text-[11px] font-medium leading-relaxed">Enterprise Infrastructure Management Protocol. Secure, Synchronized, Seamless.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 inline-block w-fit">
            <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest">Protocol Build v1.0.4</p>
          </div>
        </div>

        <div className={`flex-1 p-8 md:p-10 flex flex-col justify-center transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <div className="flex justify-between items-center mb-8">
            <div className={`flex p-0.5 rounded-lg border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button type="button" onClick={() => setLanguage(Language.EN)} className={`px-3 py-1.5 rounded-md text-[9px] font-bold tracking-widest transition-all ${language === Language.EN ? 'bg-white/10 text-white' : 'opacity-40'}`}>EN</button>
              <button type="button" onClick={() => setLanguage(Language.HI)} className={`px-3 py-1.5 rounded-md text-[9px] font-bold tracking-widest transition-all ${language === Language.HI ? 'bg-white/10 text-white' : 'opacity-40'}`}>हिन्दी</button>
            </div>
            <button 
              type="button"
              onClick={() => setTheme(isDark ? Theme.LIGHT : Theme.DARK)} 
              className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-1 tracking-tight">
              {isRegistering ? t('register') : (isAdminLogin ? t('superAdminPanel') : t('staffPanel'))}
            </h3>
            <p className="text-[10px] opacity-50 font-semibold">
              {isRegistering ? t('createAccount') : t('newLogin')}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14}/>
              {error}
            </div>
          )}

          <form onSubmit={handleInitialSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-3">
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14}/>
                  <input required value={orgName} onChange={e => setOrgName(e.target.value)} className={`w-full pl-10 pr-4 h-11 rounded-lg border border-transparent outline-none transition-all font-medium text-xs ${isDark ? 'bg-white/5 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`} placeholder={t('orgName')} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14}/>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`w-full pl-10 pr-4 h-11 rounded-lg border border-transparent outline-none transition-all font-medium text-xs ${isDark ? 'bg-white/5 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`} placeholder={t('email')} />
                </div>
              </div>
            )}

            <div className="relative">
              <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14}/>
              <input required value={username} onChange={e => setUsername(e.target.value)} className={`w-full pl-10 pr-4 h-11 rounded-lg border border-transparent outline-none transition-all font-medium text-xs ${isDark ? 'bg-white/5 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`} placeholder={t('username')} />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" size={14}/>
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className={`w-full pl-10 pr-10 h-11 rounded-lg border border-transparent outline-none transition-all font-medium text-xs ${isDark ? 'bg-white/5 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'}`} placeholder={t('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100">
                {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>

            <button type="submit" className="w-full h-11 bg-orange-600 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest shadow-md active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors">
              {isRegistering ? t('register') : t('login')}
              <ChevronRight size={14} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
              {isRegistering ? t('alreadyHaveAccount') : t('newContractor')}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-500/10 text-center">
            <button 
              type="button"
              onClick={() => { setIsAdminLogin(!isAdminLogin); setIsRegistering(false); setError(''); }} 
              className="w-full h-11 text-[9px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 flex items-center justify-center gap-2 transition-all"
            >
              {isAdminLogin ? t('staffPanel') : t('superAdminPanel')} 
              <ChevronRight size={12}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
