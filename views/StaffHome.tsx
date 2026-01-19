
import React, { useState } from 'react';
import { useApp } from '../App';
import { 
  MapPin, Play, ShieldAlert, CheckCircle, 
  Camera, MessageSquare, Info, Clock, 
  Navigation as NavIcon, ChevronRight, LocateFixed, Loader2
} from 'lucide-react';

const StaffHome: React.FC = () => {
  const { tasks, isDark, t, isOffline } = useApp();
  const [isStarted, setIsStarted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleStartWork = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("GPS protocol not supported on this terminal.");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsStarted(true);
        setIsLocating(false);
      },
      (error) => {
        setLocationError("GPS Verification Failed: Site access requires active location services.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <header className={`px-4 pt-6 pb-4 sticky top-0 z-40 transition-colors ${isDark ? 'bg-[#0b141d]/80 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'} backdrop-blur-md border-b`}>
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div>
            <h1 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
              {t('onTrack')}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isStarted ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
              <p className="text-[8px] font-bold uppercase opacity-40 tracking-widest">
                {isStarted ? 'Operational' : 'Idle'}
              </p>
            </div>
          </div>
          <button className="w-9 h-9 bg-orange-500/10 text-orange-600 rounded-lg relative active:scale-90 transition-all flex items-center justify-center">
             <MessageSquare size={16} />
             <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-inherit"></div>
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {locationError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-bold uppercase flex items-center gap-2.5 animate-fade-in">
            <ShieldAlert size={14} className="shrink-0"/> 
            <span>{locationError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
           <div className={`p-4 rounded-xl border shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100'}`}>
              <p className="text-[8px] font-bold uppercase opacity-30 mb-1 tracking-widest">{t('pendingTasks')}</p>
              <p className="text-lg font-bold">{tasks.length}</p>
           </div>
           <div className={`p-4 rounded-xl border shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100'}`}>
              <p className="text-[8px] font-bold uppercase opacity-30 mb-1 tracking-widest">{t('completedToday')}</p>
              <p className="text-lg font-bold">0</p>
           </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-[8px] font-bold uppercase opacity-20 tracking-widest ml-1">Current Matrix</h2>
          
          {tasks.map((task) => (
            <div key={task.id} className={`p-5 rounded-2xl border shadow-sm relative animate-fade-in ${isDark ? 'bg-[#16222c] border-white/10' : 'bg-white border-slate-200'}`}>
               <div className="flex justify-between items-start mb-3">
                 <div className="flex-1 pr-4">
                   <h3 className={`text-sm font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>{task.title}</h3>
                   <div className="flex items-center gap-1.5 mt-1 opacity-40">
                      <MapPin size={10}/>
                      <span className="text-[8px] font-bold uppercase tracking-wider truncate">{task.projectName}</span>
                   </div>
                 </div>
                 <div className={`p-2 rounded-lg shrink-0 ${task.status === 'URGENT' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {task.status === 'URGENT' ? <ShieldAlert size={16}/> : <Clock size={16}/>}
                 </div>
               </div>

               <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <p className="text-[10px] font-medium opacity-60 leading-relaxed italic">"{task.instructions}"</p>
               </div>

               <div className="space-y-2">
                  {!isStarted ? (
                    <button 
                      onClick={handleStartWork}
                      disabled={isLocating}
                      className="w-full h-10 bg-[#002366] text-white rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14}/>}
                      {t('startWork')}
                    </button>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      {coords && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full w-fit mx-auto mb-1 border border-emerald-500/20">
                          <LocateFixed size={10}/>
                          <span className="text-[8px] font-bold uppercase tracking-widest">GPS Locked: {coords.lat.toFixed(4)}</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button className="h-10 bg-orange-500 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest flex flex-col items-center justify-center shadow active:scale-[0.98]">
                           <Camera size={16}/> 
                           <span className="text-[7px] mt-0.5">{t('takePhoto')}</span>
                        </button>
                        <button className="h-10 bg-blue-600 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest flex flex-col items-center justify-center shadow active:scale-[0.98]">
                           <NavIcon size={16}/>
                           <span className="text-[7px] mt-0.5">Navigate</span>
                        </button>
                      </div>
                      
                      <button className="w-full h-10 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow active:scale-[0.98]">
                         <CheckCircle size={16}/> {t('markComplete')}
                      </button>
                    </div>
                  )}
               </div>

               <div className="mt-4 flex items-center justify-between pt-3 border-t border-inherit">
                  <div className="flex items-center gap-1">
                     <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse"></div>
                     <span className="text-[8px] font-bold uppercase opacity-30 tracking-widest">{task.deadline}</span>
                  </div>
                  <button className="text-[8px] font-bold uppercase tracking-widest text-orange-600 flex items-center gap-0.5 group">
                     {t('viewDetails')} <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-white border-indigo-100 shadow-sm'}`}>
           <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-500 text-white rounded-lg"><Info size={14}/></div>
              <h4 className="text-[10px] font-bold uppercase tracking-tight">Support Nexus</h4>
           </div>
           <p className="text-[10px] opacity-60 leading-relaxed font-medium mb-3">Syncing active. Local cache secured for offline persistence.</p>
           <button className="w-full h-9 border border-indigo-200 text-indigo-700 rounded-lg text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors">
              Request Help
           </button>
        </div>

        <div className="text-center opacity-20">
           <p className="text-[7px] font-bold uppercase tracking-[0.4em]">Node v1.0.4-S</p>
        </div>
      </div>
    </div>
  );
};

export default StaffHome;