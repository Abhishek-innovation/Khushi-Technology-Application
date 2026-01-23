
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

  const containerClass = `rounded-[2rem] border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-2xl shadow-black/40' 
      : 'bg-white border-slate-200 shadow-sm'
  }`;

  return (
    <div className={`p-6 md:p-8 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header & Main Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl ${isDark ? 'bg-orange-600/10 text-orange-500' : 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}>
                <Users size={20} />
              </div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
                {t('resourceUtilization')}
              </h1>
            </div>
            <p className="text-[9px] font-black uppercase opacity-30 tracking-[0.3em] ml-1">
              Active Site Matrix & Workforce Deployment
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveView(AppView.CREATE_STAFF)}
              className="h-11 px-5 bg-[#FF8C00] hover:bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all group"
            >
              <UserPlus size={16} />
              <span>Provision</span>
            </button>

            {/* Role Filter Dropdown */}
            <div className="relative group w-full sm:w-[200px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 z-10 pointer-events-none">
                <Filter size={14} />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`w-full h-11 pl-10 pr-10 rounded-xl border appearance-none outline-none font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-800/40 border-white/5 text-white hover:bg-slate-800 focus:border-orange-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-500/50 shadow-sm'
                }`}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-[240px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
                <Search size={14} />
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Identity..."
                className={`w-full h-11 pl-10 pr-4 rounded-xl border outline-none font-black text-[10px] uppercase tracking-widest transition-all ${
                  isDark 
                    ? 'bg-slate-800/40 border-white/5 text-white focus:border-orange-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 focus:border-orange-500/50 shadow-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
           {[
             { label: 'Total Manpower', val: staff.length, icon: <Users size={18}/>, color: 'text-blue-500' },
             { label: 'Avg Utilization', val: '68%', icon: <Activity size={18}/>, color: 'text-orange-500' },
             { label: 'Active Deployments', val: filteredStaff.length, icon: <Target size={18}/>, color: 'text-emerald-500' },
             { label: 'Compliance Level', val: '99.2%', icon: <Briefcase size={18}/>, color: 'text-indigo-500' },
           ].map((stat, i) => (
             <div key={i} className={`p-6 ${containerClass} hover:translate-y-[-3px] transition-transform`}>
               <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black uppercase opacity-30 tracking-widest">{stat.label}</p>
                  <div className={`p-2 rounded-lg bg-slate-500/5 ${stat.color}`}>{stat.icon}</div>
               </div>
               <h4 className="text-2xl font-black tracking-tighter">{stat.val}</h4>
             </div>
           ))}
        </div>

        {/* Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full py-24 text-center opacity-20">
               <Users size={48} className="mx-auto mb-4" />
               <p className="text-lg font-black uppercase tracking-[0.4em]">No Personnel Synced</p>
            </div>
          ) : filteredStaff.map((person) => (
            <div key={person.id} className={`group overflow-hidden rounded-[2rem] border transition-all duration-500 hover:translate-y-[-5px] ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/30'
            }`}>
               <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                     <div className="relative">
                        <img 
                          src={person.avatar} 
                          className="w-16 h-16 rounded-[1.25rem] object-cover shadow-lg transition-transform duration-500 group-hover:scale-105" 
                          alt={person.name} 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-inherit rounded-full shadow-[0_0_8px_#10b981]"></div>
                     </div>
                     <button className="p-2 opacity-20 hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={18} />
                     </button>
                  </div>

                  <div className="space-y-1 mb-5">
                     <h3 className={`text-lg font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#002366]'}`}>
                       {person.name}
                     </h3>
                     <p className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-500">
                       {getRoleLabel(person.role)}
                     </p>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex items-center gap-2 opacity-60">
                        <Mail size={12} />
                        <span className="text-[10px] font-medium truncate">{person.email || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-2 opacity-60">
                        <MapPin size={12} />
                        <span className="text-[10px] font-medium">Remote Terminal</span>
                     </div>
                  </div>

                  <div className="pt-5 border-t border-inherit space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Utilization</span>
                        <span className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {person.workload}%
                        </span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-500/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            (person.workload || 0) > 80 ? 'bg-rose-500' : (person.workload || 0) > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${person.workload}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
               
               <button className={`w-full h-10 text-[9px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 ${
                 isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
               }`}>
                  Review Credentials
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffManagementView;
