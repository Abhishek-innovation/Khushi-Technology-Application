
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Theme, Language } from '../types';
// Add ExternalLink to the imports from lucide-react
import { Camera, MapPin, Clock, CheckCircle2, ChevronLeft, LayoutGrid, ClipboardList, MessageSquare, User, Play, Image as ImageIcon, Sun, Moon, CloudOff, RefreshCw, CheckCircle, X, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';

const StaffHome: React.FC = () => {
  const { theme, language, t, tasks } = useApp();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  
  // Offline & Queue States
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queuedPhotos, setQueuedPhotos] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncSuccess, setLastSyncSuccess] = useState(false);

  // Photo Confirmation States
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [mockCoords] = useState({ 
    lat: "25.5941", 
    lon: "85.1376", 
    display: "25.5941° N, 85.1376° E",
    accuracy: "High Accuracy (±3m)" 
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effect to handle automatic sync when coming back online
  useEffect(() => {
    if (!isOffline && queuedPhotos > 0) {
      handleSync();
    }
  }, [isOffline]);

  const handleSync = async () => {
    if (queuedPhotos === 0) return;
    setIsSyncing(true);
    // Simulate network delay for upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setQueuedPhotos(0);
    setIsSyncing(false);
    setLastSyncSuccess(true);
    setTimeout(() => setLastSyncSuccess(false), 3000);
  };

  const onCaptureClick = () => {
    if (!isStarted) return;
    // Simulate opening camera and getting a result
    setPendingPhoto("https://images.unsplash.com/photo-1517646281553-9b935c7a4c8c?auto=format&fit=crop&q=80&w=800");
  };

  const confirmPhoto = () => {
    setPendingPhoto(null);
    if (isOffline) {
      setQueuedPhotos(prev => prev + 1);
    } else {
      // Simulate direct upload
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncSuccess(true);
        setTimeout(() => setLastSyncSuccess(false), 3000);
      }, 1000);
    }
  };

  const retakePhoto = () => {
    setPendingPhoto(null);
    onCaptureClick();
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${mockCoords.lat},${mockCoords.lon}`;
    window.open(url, '_blank');
  };

  const taskData = tasks.find(t => t.id === selectedTask) || tasks[0];

  const PhotoConfirmationOverlay = () => {
    if (!pendingPhoto) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-in fade-in duration-300">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-white font-black uppercase tracking-widest text-sm">Review Documentation</h3>
          <button onClick={() => setPendingPhoto(null)} className="p-2 text-white/50 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex-1 px-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-32">
          {/* Captured Image */}
          <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-800 shadow-2xl relative">
            <img src={pendingPhoto} className="w-full h-full object-cover" alt="Captured" />
            
            {/* Accuracy Badge */}
            <div className="absolute top-6 right-6 bg-green-500/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <ShieldCheck size={12} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{mockCoords.accuracy}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-lg rounded-[1.5rem] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FF8C00] rounded-xl shadow-lg"><MapPin size={18} className="text-white" /></div>
                <div>
                  <p className="text-[9px] font-black opacity-60 uppercase tracking-[0.2em] text-white">Geotag Data</p>
                  <p className="text-xs font-bold text-white tracking-tight">{mockCoords.display}</p>
                </div>
              </div>
              <CheckCircle size={20} className="text-green-400" />
            </div>
          </div>

          {/* Location Context (Small Map Preview) */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-[#FF8C00]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-60">Location Context</span>
              </div>
              <button 
                onClick={openInMaps}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95"
              >
                <span className="text-[9px] font-black text-white uppercase tracking-wider">Verify in Maps</span>
                <ExternalLink size={10} className="text-white/60" />
              </button>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden relative border border-white/5 grayscale group">
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-50 transition-all duration-500 group-hover:scale-110" alt="Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex gap-4">
          <button 
            onClick={retakePhoto}
            className="flex-1 py-5 rounded-2xl border-2 border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all"
          >
            Retake
          </button>
          <button 
            onClick={confirmPhoto}
            className="flex-[2] py-5 rounded-2xl bg-[#FF8C00] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
          >
            Confirm Upload
          </button>
        </div>
      </div>
    );
  };

  const TaskDetail = () => (
    <div className="animate-in slide-in-from-right duration-300 min-h-full bg-[#0b141d] text-white">
      <PhotoConfirmationOverlay />
      
      {/* Offline Status Bar */}
      {isOffline && (
        <div className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-4 flex items-center justify-center gap-2 sticky top-0 z-10">
          <CloudOff size={12} /> Offline Mode - Changes will be queued
        </div>
      )}

      <div className="p-6 flex items-center gap-4">
        <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft size={24}/></button>
        <h2 className="text-lg font-black uppercase tracking-tight">Task: {taskData.title}</h2>
      </div>

      <div className="px-6 pb-24 space-y-6">
        <button 
          onClick={() => setIsStarted(!isStarted)}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
            isStarted ? 'bg-red-500 shadow-red-500/20' : 'bg-[#155e75] shadow-blue-500/10'
          }`}
        >
          {isStarted ? <><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Stop Work</> : <><Play size={20}/> Start Work</>}
        </button>

        <div className="h-48 bg-[#16222c] rounded-3xl border border-white/5 overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-40" alt="Map"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20"><MapPin className="text-white"/></div>
          </div>
        </div>

        {/* Photo Capture Section with Queue Management */}
        <div className="bg-[#16222c] p-8 rounded-[2.5rem] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          <h3 className="text-sm font-black tracking-widest opacity-80">PHOTO CAPTURE</h3>
          
          <button 
            onClick={onCaptureClick}
            disabled={!isStarted}
            className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner group active:scale-95 transition-all relative ${!isStarted ? 'bg-white/5 opacity-20 cursor-not-allowed' : 'bg-white/5 cursor-pointer'}`}
          >
            <Camera size={40} className="text-gray-400 group-hover:text-[#FF8C00]" />
            {isSyncing && (
              <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center">
                <RefreshCw className="animate-spin text-white" size={24} />
              </div>
            )}
          </button>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Geotagging Active</p>
            
            {/* Queue & Status Indicators */}
            {queuedPhotos > 0 && (
              <div className="mt-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-pulse">
                <RefreshCw size={10} className="animate-spin" /> {queuedPhotos} Photo{queuedPhotos > 1 ? 's' : ''} Queued
              </div>
            )}
            
            {lastSyncSuccess && (
              <div className="mt-2 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-in fade-in zoom-in">
                <CheckCircle size={10} /> Sync Complete
              </div>
            )}

            {!isStarted && (
              <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider mt-2">Start work to take photos</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black tracking-widest opacity-80 uppercase">Requirements</h3>
          <div className="space-y-3">
            {[
              "Verify foundation depth min 1m",
              "Install poles 1-5 at Rajendra Nagar",
              "Connect grounding wires",
              "Secure mounting bolts"
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${i < 3 ? 'bg-blue-500/20 border-blue-400' : 'border-white/10'}`}>
                  {i < 3 && <CheckCircle2 size={16} className="text-blue-400" />}
                </div>
                <span className={`text-xs font-medium ${i < 3 ? 'opacity-80 line-through' : 'opacity-100'}`}>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedTask) return <TaskDetail />;

  return (
    <div className={`pb-24 ${theme === Theme.DARK ? 'bg-[#0b141d]' : 'bg-gray-50'}`}>
      {/* Sticky Global Offline Indicator */}
      {isOffline && (
        <div className="bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] py-1 flex items-center justify-center gap-2 z-[60] sticky top-0">
          <CloudOff size={10} /> Offline Mode
        </div>
      )}

      <div className="p-6 pt-8 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="text-xs font-black opacity-40">English | हिंदी</div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full"><Sun size={14} className="m-1"/><Moon size={14} className="m-1 opacity-20"/></div>
      </div>

      <div className="px-6 mb-8 text-white">
        <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">STAFF PANEL - HOME</h2>
      </div>

      <div className="mb-10">
        <div className="px-6 flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-50 text-white">Today's Tasks</h3>
          <button className="text-[10px] font-black uppercase text-cyan-400">View all</button>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 no-scrollbar">
          {tasks.map(t => (
            <button key={t.id} onClick={() => setSelectedTask(t.id)} className="min-w-[280px] bg-white rounded-[2rem] p-6 text-left shadow-lg active:scale-95 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center"><MapPin size={20} className="text-cyan-600"/></div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{t.title}</h4>
                  <p className="text-[10px] font-black uppercase opacity-40 mt-1">{t.projectName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-40">
                  <Clock size={12}/><span className="text-[10px] font-black uppercase">Deadline: {t.deadline}</span>
                </div>
              </div>
              <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: '40%' }}></div>
              </div>
            </button>
          ))}
          <div className="min-w-[10px]"></div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-[#16222c] border-t border-gray-100 dark:border-white/5 flex items-center justify-around px-4 z-50 rounded-t-[2.5rem] shadow-2xl">
        <button className="flex flex-col items-center gap-1 text-cyan-600"><LayoutGrid size={22}/><span className="text-[8px] font-black uppercase">Home</span></button>
        <button className="flex flex-col items-center gap-1 opacity-40"><ClipboardList size={22}/><span className="text-[8px] font-black uppercase">Tasks</span></button>
        <div className="relative -top-10">
          <button 
            disabled={!isStarted}
            onClick={onCaptureClick}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border-4 border-white dark:border-[#0b141d] active:scale-90 transition-all ${!isStarted ? 'bg-gray-400 opacity-50' : 'bg-[#155e75]'}`}
          >
            <Camera size={28}/>
            {queuedPhotos > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-white dark:border-[#0b141d] text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                {queuedPhotos}
              </span>
            )}
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 opacity-40"><MessageSquare size={22}/><span className="text-[8px] font-black uppercase">Messages</span></button>
        <button className="flex flex-col items-center gap-1 opacity-40"><User size={22}/><span className="text-[8px] font-black uppercase">Profile</span></button>
      </nav>
    </div>
  );
};

export default StaffHome;
