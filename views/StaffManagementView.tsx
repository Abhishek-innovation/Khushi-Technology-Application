
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, AppView } from '../types';
import { 
  Users, UserPlus, Filter, Search, ChevronDown, 
  MoreHorizontal, Activity, Target, Briefcase, 
  Mail, MapPin, Loader2 
} from 'lucide-react';

const StaffManagementView: React.FC = () => {
  const { staff, isDark, t, setActiveView } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const roles = [
    { value: 'ALL', label: 'All Personnel' },
    { value: UserRole.SITE_SUPERVISOR, label: 'Site Supervisors' },
    { value: UserRole.TECHNICIAN, label: 'Technicians' },
    { value: UserRole.ELECTRICIAN, label: 'Electricians' },
    { value: UserRole.WAREHOUSE_MANAGER, label: 'Warehouse Managers' },
  ];

  const filteredStaff = staff.filter(s => {
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'Super Admin';
      case UserRole.SITE_SUPERVISOR: return 'Site Supervisor';
      case UserRole.TECHNICIAN: return 'Technician';
      case UserRole.ELECTRICIAN: return 'Electrician';
      case UserRole.WAREHOUSE_MANAGER: return 'Warehouse Manager';
      default: return role;
    }
  };

  const containerClass = `rounded-[2.5rem] border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-2xl shadow-black/40' 
      : 'bg-white border-slate-200 shadow-sm'
  }`;

  return (
    <div className={`p-6 md:p-12 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* Header & Main Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-orange-600/10 text-orange-500' : 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}>
                <Users size={24} />
              </div>
              <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
                {t('resourceUtilization')}
              </h1>
            </div>
            <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.4em] ml-1">
              Active Site Matrix & Workforce Deployment
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setActiveView(AppView.CREATE_STAFF)}
              className="h-12 md:h-14 px-6 md:px-8 bg-[#FF8C00] hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-500/30 active:scale-95 transition-all group"
            >
              <UserPlus size={18} />
              <span>Provision Personnel</span>
            </button>

            {/* Role Filter Dropdown */}
            <div className="relative group w-full sm:w-[220px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 z-10 pointer-events-none">
                <Filter size={16} />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`w-full h-12 md:h-14 pl-14 pr-12 rounded-2xl border appearance-none outline-none font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-800/40 border-white/5 text-white hover:bg-slate-800 focus:border-orange-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-500/50 shadow-sm'
                }`}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">
                <Search size={16} />
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Identity..."
                className={`w-full h-12 md:h-14 pl-14 pr-6 rounded-2xl border outline-none font-black text-[10px] uppercase tracking-widest transition-all ${
                  isDark 
                    ? 'bg-slate-800/40 border-white/5 text-white focus:border-orange-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 focus:border-orange-500/50 shadow-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Manpower', val: staff.length, icon: <Users size={20}/>, color: 'text-blue-500' },
             { label: 'Avg Utilization', val: '68%', icon: <Activity size={20}/>, color: 'text-orange-500' },
             { label: 'Active Deployments', val: filteredStaff.length, icon: <Target size={20}/>, color: 'text-emerald-500' },
             { label: 'Compliance Level', val: '99.2%', icon: <Briefcase size={20}/>, color: 'text-indigo-500' },
           ].map((stat, i) => (
             <div key={i} className={`p-8 ${containerClass} hover:translate-y-[-5px] transition-transform`}>
               <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black uppercase opacity-30 tracking-widest">{stat.label}</p>
                  <div className={`p-2.5 rounded-xl bg-slate-500/5 ${stat.color}`}>{stat.icon}</div>
               </div>
               <h4 className="text-3xl font-black tracking-tighter">{stat.val}</h4>
             </div>
           ))}
        </div>

        {/* Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full py-32 text-center opacity-20">
               <Users size={64} className="mx-auto mb-6" />
               <p className="text-xl font-black uppercase tracking-[0.5em]">No Personnel Synced</p>
            </div>
          ) : filteredStaff.map((person) => (
            <div key={person.id} className={`group overflow-hidden rounded-[2.5rem] border transition-all duration-500 hover:translate-y-[-10px] ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'
            }`}>
               <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <div className="relative">
                        <img 
                          src={person.avatar} 
                          className="w-20 h-20 rounded-[1.75rem] object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                          alt={person.name} 
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-inherit rounded-full shadow-[0_0_10px_#10b981]"></div>
                     </div>
                     <button className="p-3 opacity-20 hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={20} />
                     </button>
                  </div>

                  <div className="space-y-1 mb-6">
                     <h3 className={`text-xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#002366]'}`}>
                       {person.name}
                     </h3>
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                       {getRoleLabel(person.role)}
                     </p>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 opacity-60">
                        <Mail size={14} />
                        <span className="text-xs font-medium truncate">{person.email || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-3 opacity-60">
                        <MapPin size={14} />
                        <span className="text-xs font-medium">Remote Terminal</span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-inherit space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Utilization Spectrum</span>
                        <span className={`text-[11px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {person.workload}%
                        </span>
                     </div>
                     <div className="h-2 w-full bg-slate-500/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            (person.workload || 0) > 80 ? 'bg-rose-500' : (person.workload || 0) > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${person.workload}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
               
               <button className={`w-full h-12 md:h-14 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${
                 isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
               }`}>
                  Review Credentials
               </button>
            </div>
          ))}
        </div>

        <div className="text-center opacity-10 pb-16">
           <p className="text-[10px] font-black uppercase tracking-[1em]">
             Workforce Management Protocol v1.0.4-Stable
           </p>
        </div>
      </div>
    </div>
  );
};

export default StaffManagementView;
