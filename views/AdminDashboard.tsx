
import React from 'react';
import { useApp } from '../App';
import { AppView, ProjectStatus, Theme } from '../types';
import { 
  ChevronDown, MapPin, Search, Plus, Filter, Package, Users, 
  BarChart3, AlertCircle, Bell, MoreHorizontal, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck, SearchIcon, UserPlus 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { activeView, setActiveView, projects, staff, inventory, t, theme, user, isDark } = useApp();

  const Card = ({ children, title, extra, className = "" }: { children?: React.ReactNode, title: string, extra?: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${
      isDark 
        ? 'bg-[#16222c]/60 backdrop-blur-xl border-white/5 shadow-2xl' 
        : 'bg-white border-gray-200 shadow-xl shadow-gray-200/50'
    } ${className}`}>
      <div className="flex items-center justify-between px-8 py-6 border-b border-inherit">
        <h3 className={`text-xs font-black tracking-widest uppercase opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {extra || <MoreHorizontal size={16} className={`opacity-40 cursor-pointer hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-gray-900'}`} />}
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* PROJECT OVERVIEW */}
      <Card title="Project Overview" className="xl:col-span-7" extra={
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black cursor-pointer ${
          isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          All Projects <ChevronDown size={14} />
        </div>
      }>
        <div className="space-y-6">
          {projects.map((p) => (
            <div key={p.id} className={`group relative flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border transition-all hover:scale-[1.01] ${
              isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
            }`}>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black opacity-40 uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Projects</span>
                  </div>
                  <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-black/20' : 'bg-gray-200'}`}>
                    <div className="bg-[#FF8C00] h-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <span className={isDark ? 'text-white/60' : 'text-gray-500'}>{p.progress}% Complete</span>
                    <span className={p.status === ProjectStatus.IN_PROGRESS ? 'text-green-500' : 'text-orange-500'}>
                      {p.status === ProjectStatus.IN_PROGRESS ? 'On Track' : 'Attention Needed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                <img src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover opacity-40 grayscale" alt="Map"/>
                <div className="absolute inset-0 flex items-center justify-center">
                   <MapPin size={18} className="text-[#FF8C00]" />
                </div>
                {p.status === ProjectStatus.COMPLETED && (
                  <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full text-white"><CheckCircle2 size={12}/></div>
                )}
                {p.status === ProjectStatus.ATTENTION_NEEDED && (
                  <div className="absolute top-2 right-2 p-1 bg-orange-500 rounded-full text-white"><AlertTriangle size={12}/></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* RESOURCE UTILIZATION */}
      <Card title="Resource Utilization" className="xl:col-span-5" extra={
        <button 
          onClick={() => setActiveView(AppView.CREATE_STAFF)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF8C00] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          <UserPlus size={14} /> Create Staff
        </button>
      }>
        <div className="grid grid-cols-2 gap-4">
          {staff.map((s) => (
            <div key={s.id} className={`p-4 rounded-[2rem] border transition-all flex flex-col items-center text-center ${
              isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
            }`}>
              <div className="relative mb-3">
                <img src={s.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF8C00]/20 shadow-lg" alt={s.name} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-[#16222c]' : 'border-white'} ${s.status === 'ACTIVE' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              </div>
              <h5 className={`text-xs font-black uppercase tracking-tighter truncate w-full ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.name}</h5>
              <p className={`text-[10px] font-bold mb-3 ${s.status === 'ACTIVE' ? 'text-green-500' : 'text-orange-500'}`}>{s.status === 'ACTIVE' ? 'Available' : 'On Leave'}</p>
              
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[8px] font-black opacity-40 uppercase">
                  <span>Workload</span>
                  <span>{s.workload}%</span>
                </div>
                <div className={`w-full rounded-full h-1 overflow-hidden ${isDark ? 'bg-black/20' : 'bg-gray-200'}`}>
                  <div className={`h-full transition-all duration-1000 ${s.workload && s.workload > 80 ? 'bg-orange-500' : 'bg-[#FF8C00]'}`} style={{ width: `${s.workload}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-1.5">
          <div className="w-6 h-1 rounded-full bg-[#FF8C00]"></div>
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
        </div>
      </Card>

      {/* INVENTORY STATUS */}
      <Card title="Inventory Status" className="xl:col-span-4">
        <div className="space-y-6">
          <div className="flex justify-between text-[10px] font-black uppercase opacity-40 tracking-widest px-2">
            <span>Item</span>
            <span>Reorder Alert</span>
          </div>
          {inventory.slice(0, 3).map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                   {item.category === 'LED_FIXTURES' ? <BarChart3 size={20} className="text-blue-400"/> : <Package size={20} className="text-gray-400"/>}
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h5>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">{item.quantity} units</p>
                </div>
              </div>
              <div className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                item.status === 'LOW' 
                  ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' 
                  : item.status === 'CRITICAL' 
                  ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                  : 'text-green-500 bg-green-500/10 border-green-500/20'
              }`}>
                {item.status === 'LOW' ? 'Low Stock' : item.status === 'CRITICAL' ? 'Reorder' : 'Sufficient'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ALERTS & PRIORITY ACTIONS */}
      <Card title="Alerts & Priority Action Items" className="xl:col-span-4">
        <div className="space-y-4">
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl group cursor-pointer hover:bg-red-500/15 transition-all">
            <div className="flex gap-4">
              <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/20 h-fit">
                <AlertCircle size={20} />
              </div>
              <div>
                <h5 className="text-sm font-black text-red-500 mb-1">Material Shortage: LED Fixtures</h5>
                <p className="text-[10px] font-black opacity-60 uppercase text-red-400">Critical Alert: 2 hours ago</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-3xl group cursor-pointer hover:bg-orange-500/15 transition-all">
            <div className="flex gap-4">
              <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20 h-fit">
                <Clock size={20} />
              </div>
              <div>
                <h5 className="text-sm font-black text-orange-500 mb-1">Deadline Approaching: Rajendra Nagar</h5>
                <p className="text-[10px] font-black opacity-60 uppercase text-orange-400">Warning Alert: 9 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* COMPLIANCE & DOCUMENTATION */}
      <Card title="Compliance & Documentation" className="xl:col-span-4">
        <div className="space-y-6">
          <div className="flex justify-between text-[10px] font-black uppercase opacity-40 tracking-widest px-2">
            <span>Completion Status</span>
            <span>Deadline</span>
          </div>
          {[
            { label: 'Project Insurance Policy', status: 'COMPLETED', deadline: '17 Apr 2026', checked: true },
            { label: 'Site Survey Certificates', status: 'COMPLETED', deadline: '29 Aug 2026', checked: true },
            { label: 'Safety Audit Report', status: 'PENDING', deadline: '03 Jun 2026', checked: false },
            { label: 'Government Permit #42B', status: 'CRITICAL', deadline: '12 Apr 2026', checked: false },
            { label: 'Material Quality Verification', status: 'PENDING', deadline: '29 Jul 2026', checked: false }
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                  c.checked ? 'bg-green-500/20 border-green-500' : isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                }`}>
                  {c.checked && <CheckCircle2 size={12} className="text-green-500" />}
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'} ${c.checked ? 'opacity-30 line-through' : 'opacity-100'}`}>
                  {c.label}
                </span>
              </div>
              <span className={`text-[10px] font-black ${c.status === 'CRITICAL' ? 'text-red-500' : 'opacity-40'}`}>
                {c.deadline}
              </span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-gray-50'}`}>
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('superAdminPanel').toUpperCase()}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`relative flex items-center h-12 px-5 rounded-2xl border transition-all w-full md:w-80 ${
              isDark ? 'bg-white/5 border-white/10 focus-within:border-[#FF8C00]/50' : 'bg-white border-gray-200 focus-within:border-[#FF8C00]'
            }`}>
              <SearchIcon size={18} className="opacity-30 mr-3" />
              <input 
                className={`bg-transparent border-none outline-none text-xs font-bold w-full ${isDark ? 'text-white' : 'text-gray-900'}`} 
                placeholder="Search Projects, Staff or Materials..."
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className={`relative p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>
                <Bell size={20} className={isDark ? 'text-white opacity-60' : 'text-gray-600'} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-inherit"></span>
              </button>
              <div className={`flex items-center gap-3 pl-3 border-l ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                 <div className="text-right hidden sm:block">
                   <p className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.organization}</p>
                   <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{user?.name}</p>
                 </div>
                 <img src={user?.avatar} className="w-12 h-12 rounded-2xl border-2 border-[#FF8C00]/20 shadow-xl object-cover" alt="Profile" />
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        {renderDashboard()}

      </div>
    </div>
  );
};

export default AdminDashboard;
