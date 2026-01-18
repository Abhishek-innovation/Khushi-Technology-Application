
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { MapPin, Navigation, Play, ShieldAlert, CheckCircle, Crosshair } from 'lucide-react';

const StaffHome: React.FC = () => {
  const { tasks, isDark } = useApp();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isGpsLocked, setIsGpsLocked] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleStartWork = () => {
    // Real Geolocation Check
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Here we would compare coordinates with the project site coordinates
        // For this demo, we assume success after real acquisition
        console.log("Acquired Position:", position.coords);
        setIsGpsLocked(true);
        setIsStarted(true);
        setLocationError(null);
      },
      (error) => {
        setLocationError("Unable to verify your location. Please enable GPS.");
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  const taskData = tasks.find(t => t.id === selectedTask) || tasks[0];

  return (
    <div className={`pb-24 min-h-screen ${isDark ? 'bg-[#0b141d]' : 'bg-gray-50'}`}>
      <div className="p-8 space-y-8">
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#002366]'}`}>Daily Operations</h1>
        
        {/* Task List */}
        <div className="space-y-6">
          {tasks.map(t => (
            <div key={t.id} className={`p-8 rounded-[2.5rem] border shadow-xl ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100'}`}>
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-xl font-black">{t.title}</h3>
                   <p className="text-[10px] font-black uppercase opacity-40">{t.projectName}</p>
                 </div>
                 <div className={`p-2 rounded-xl bg-orange-500/10 text-orange-500`}><MapPin size={20}/></div>
               </div>

               {locationError && (
                 <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase flex items-center gap-2">
                   <ShieldAlert size={16}/> {locationError}
                 </div>
               )}

               <button 
                  onClick={handleStartWork}
                  disabled={isStarted}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    isStarted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#002366] text-white shadow-lg active:scale-95'
                  }`}
               >
                 {isStarted ? <CheckCircle size={18}/> : <Play size={18}/>}
                 {isStarted ? 'Shift In Progress' : 'Start Work (GPS Verify)'}
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffHome;
