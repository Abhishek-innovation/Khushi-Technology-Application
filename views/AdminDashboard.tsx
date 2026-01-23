
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Loader2, Map as MapIcon, 
  Globe, ArrowUpRight,
  ShieldAlert, Key, Zap, Users, Package,
  Activity, Radio, Wind, CloudRain,
  Maximize2, Target, MapPin, UserPlus, ChevronRight,
  Image as ImageIcon, Share2, MessageCircle
} from 'lucide-react';
import { Project, AppView } from '../types';

const AdminDashboard: React.FC = () => {
  const { projects, staff, inventory, isDark, t, setActiveView } = useApp();
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isIntelLoading, setIsIntelLoading] = useState(false);
  const [siteIntelligence, setSiteIntelligence] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState({
    connectivity: 99.7,
    efficiency: 12.6,
    activeNodes: 48,
    lat: 28.6139,
    lng: 77.2090
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        connectivity: Math.min(100, Math.max(98, prev.connectivity + (Math.random() - 0.5) * 0.1)),
        efficiency: prev.efficiency + (Math.random() - 0.5) * 0.05,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSiteIntelligence = async (project: Project) => {
    setIsIntelLoading(true);
    setSiteIntelligence(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a concise 30-word site intelligence profile for infrastructure at "${project.location}". Focus on terrain and weather challenges like waterlogging and drainage.`,
      });
      setSiteIntelligence(response.text || "Intelligence profile loaded.");
    } catch (err: any) {
      setSiteIntelligence("Flat urban terrain faces chronic monsoon waterlogging and drainage constraints. Infrastructure risks include extreme precipitation and ground stability.");
    } finally {
      setIsIntelLoading(false);
    }
  };

  const generateAiReport = async () => {
    setIsAiLoading(true);
    setApiError(null);
    setAiReport(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an executive auditor. Analyze these projects: ${JSON.stringify(projects)}. Highlight one critical operational risk. 40 words max.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiReport(response.text || "Operational analysis complete.");
    } catch (err: any) {
      setApiError("Audit Engine Timeout. Check API credentials.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) fetchSiteIntelligence(selectedProject);
  }, [selectedProject]);

  const handleShareOnWhatsApp = (project: Project) => {
    const text = `*Khushi Tech Site Update*\n\nSite: ${project.name}\nLocation: ${project.location}\nStatus: ${project.status}\nProgress: ${project.progress}%\nPhase: ${project.phase}\n\nProtocol Build v1.0.4`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const containerClass = `rounded-[2.5rem] border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-2xl shadow-black/40' 
      : 'bg-white border-slate-200 shadow-sm'
  }`;

  return (
    <div className={`p-6 md:p-8 lg:p-12 pb-24 md:pb-8 min-h-full transition-colors duration-300 ${isDark ? 'bg-[#0b141d] text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section - Enhanced based on Screenshot */}
        <div className={`p-8 md:p-10 ${containerClass} overflow-hidden relative`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[1.5rem] shadow-2xl shadow-orange-500/40 transition-transform hover:scale-105 active:scale-95">
                <Activity size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  System Command Center
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-1.5 text-emerald-500 animate-pulse">
                  Operational Status: Nominal
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                onClick={() => setActiveView(AppView.CREATE_STAFF)}
                className="h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 shadow-2xl shadow-orange-500/30 active:scale-[0.97] transition-all"
              >
                <UserPlus size={20} strokeWidth={2.5} />
                <span>Add Staff</span>
              </button>

              <button 
                onClick={generateAiReport}
                disabled={isAiLoading}
                className={`h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 active:scale-[0.97] transition-all disabled:opacity-50 ${
                  isDark 
                    ? 'bg-slate-800/80 border border-white/5 text-white hover:bg-slate-700' 
                    : 'bg-slate-800 text-white shadow-xl shadow-slate-900/20'
                }`}
              >
                {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} strokeWidth={2.5} />}
                <span>Operational Audit</span>
              </button>
            </div>
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none"></div>
        </div>

        {/* AI Insight Panel */}
        {(aiReport || apiError) && (
          <div className={`p-8 rounded-[2.5rem] border-l-8 animate-fade-in ${apiError ? 'bg-rose-500/5 border-rose-500 shadow-xl shadow-rose-500/10' : 'bg-blue-600/5 border-blue-600 shadow-xl shadow-blue-600/10'}`}>
            <div className="flex items-start gap-6">
               <div className={`p-3.5 rounded-2xl shrink-0 ${apiError ? 'bg-rose-500 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg'}`}>
                 {apiError ? <ShieldAlert size={24}/> : <Sparkles size={24}/>}
               </div>
               <div className="flex-1 pt-1">
                 <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${apiError ? 'text-rose-500' : 'text-blue-600'}`}>
                   {apiError ? 'System Protocol Alert' : 'Gemini Audit Intelligence'}
                 </h3>
                 <p className={`text-base md:text-lg leading-relaxed font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                   {apiError || aiReport}
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main Visual Node (Map) */}
          <div className={`xl:col-span-8 overflow-hidden relative group h-[500px] md:h-[700px] ${containerClass}`}>
            
            <div className="absolute inset-0 z-0">
               <img 
                 src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop`} 
                 className="w-full h-full object-cover opacity-30 grayscale-[50%]"
                 alt="Satellite Backdrop"
               />
               <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'bg-slate-950/40' : 'bg-white/20'}`}></div>
            </div>
            
            {/* HUD Overlay - Uplink Status (based on screenshot) */}
            <div className="absolute top-8 left-8 z-30 pointer-events-none">
               <div className={`px-6 py-4 rounded-3xl backdrop-blur-2xl border border-white/10 flex items-center gap-5 shadow-2xl ${isDark ? 'bg-slate-900/80 text-white' : 'bg-white/95 text-slate-900'}`}>
                  <Radio size={22} className="text-orange-500 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-lg font-black leading-none">{telemetry.connectivity.toFixed(1)}%</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">Uplink Status</span>
                  </div>
               </div>
            </div>

            {/* Site Intelligence Card (based on screenshot) */}
            <div className="absolute bottom-8 right-8 z-30 pointer-events-none w-full max-w-[380px] p-4 sm:p-0">
               <div className={`p-8 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-700 group-hover:-translate-y-4 ${isDark ? 'bg-slate-950/90' : 'bg-white/95'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-500/15 rounded-2xl">
                      <MapIcon size={24} className="text-orange-500" strokeWidth={2.5} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-[0.3em] opacity-60 ${isDark ? 'text-white' : 'text-slate-900'}`}>Site Intelligence</span>
                  </div>
                  {isIntelLoading ? (
                    <div className="flex items-center gap-4 py-4">
                      <Loader2 size={20} className="animate-spin text-orange-500" />
                      <span className="text-xs font-bold italic opacity-40 tracking-tight">Synchronizing node topology...</span>
                    </div>
                  ) : (
                    <p className={`text-[14px] font-bold leading-relaxed tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {siteIntelligence || "Deploy sensor array to selected project node to begin geospatial audit."}
                    </p>
                  )}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Active Terminal Tracking</span>
                    <Maximize2 size={16} className="opacity-20" />
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
              {selectedProject ? (
                <iframe
                  title="Site Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg) contrast(1.2) brightness(0.85)' : 'none' }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ''}&q=${encodeURIComponent(selectedProject.location)}&zoom=18&maptype=satellite`}
                  allowFullScreen
                  className="w-full h-full transition-opacity duration-1000"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center gap-5 opacity-40 z-20">
                  <Globe size={64} className="animate-pulse text-white" />
                  <span className="text-xs font-black uppercase tracking-[0.5em] text-white">System Idle - Select Project</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Project List */}
          <div className="xl:col-span-4 space-y-8 h-full">
            <div className={`p-8 lg:p-10 flex flex-col h-full overflow-hidden ${containerClass}`}>
               <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className={`text-[13px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Project Nodes</h3>
                    <p className="text-[10px] font-medium opacity-40 mt-1.5">Live Infrastructure Feed</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-500">
                    <Target size={24} strokeWidth={2.5} />
                  </div>
               </div>
               
               <div className="space-y-5 overflow-y-auto custom-scrollbar flex-1 max-h-[500px] lg:max-h-full pr-4">
                 {projects.map((p) => (
                   <button 
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all group active:scale-[0.97] ${
                      selectedProject?.id === p.id 
                        ? 'bg-[#002366] border-[#002366] text-white shadow-2xl shadow-blue-900/40 translate-x-1'
                        : isDark ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 hover:border-blue-200 text-slate-700 shadow-sm'
                    }`}
                   >
                     <div className="flex items-center gap-6 truncate">
                       <div className={`p-3.5 rounded-2xl transition-all ${selectedProject?.id === p.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 opacity-30'}`}>
                         <MapPin size={20} strokeWidth={2.5} />
                       </div>
                       <div className="truncate text-left">
                         <p className="text-sm font-black truncate leading-tight tracking-tight">{p.name}</p>
                         <p className={`text-[10px] font-black uppercase tracking-[0.25em] mt-2.5 ${selectedProject?.id === p.id ? 'text-orange-400' : 'opacity-40'}`}>
                           {p.status.replace('_', ' ')}
                         </p>
                       </div>
                     </div>
                     <ChevronRight size={20} className={`transition-transform duration-500 ${selectedProject?.id === p.id ? 'translate-x-1' : 'opacity-10 group-hover:opacity-40'}`} />
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Improved Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Card 1: Site Matrix & Personnel */}
           <div className={`p-10 group hover:-translate-y-4 flex flex-col justify-between min-h-[400px] ${containerClass}`}>
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Site Matrix</p>
                    <h4 className={`text-xl font-black uppercase tracking-[0.1em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Personnel</h4>
                 </div>
                 <div className={`p-5 rounded-3xl transition-all ${isDark ? 'bg-blue-600/10' : 'bg-blue-50'} text-blue-600 group-hover:rotate-12`}>
                    <Users size={28} strokeWidth={2.5} />
                 </div>
              </div>
              
              <div className="my-10 flex items-center gap-6 p-6 rounded-[2rem] bg-slate-500/5 border border-white/5 shadow-inner">
                 <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl flex-shrink-0"><Wind size={22} /></div>
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1.5">Wind Velocity</p>
                    <p className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>12.4 km/h</p>
                 </div>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-8">
                 <div className="flex items-baseline gap-3">
                    <h4 className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{staff.length}</h4>
                    <span className="text-xs font-black uppercase opacity-40 mb-2 tracking-[0.3em]">Units</span>
                 </div>
                 <ArrowUpRight size={28} className="opacity-10 group-hover:opacity-60 transition-opacity" />
              </div>
           </div>

           {/* Card 2: System Grid & Infrastructure */}
           <div className={`p-10 group hover:-translate-y-4 flex flex-col justify-between min-h-[400px] ${containerClass}`}>
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>System Grid</p>
                    <h4 className={`text-xl font-black uppercase tracking-[0.1em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Infrastructure</h4>
                 </div>
                 <div className={`p-5 rounded-3xl transition-all ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'} text-orange-500 group-hover:rotate-12`}>
                    <Radio size={28} strokeWidth={2.5} />
                 </div>
              </div>

              <div className="my-10 flex items-center gap-6 p-6 rounded-[2rem] bg-slate-500/5 border border-white/5 shadow-inner">
                 <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl flex-shrink-0"><CloudRain size={22} /></div>
                 <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1.5 truncate">Precipitation</p>
                    <p className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>0.0% / Clear</p>
                 </div>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-8">
                 <div className="flex items-baseline gap-3">
                    <h4 className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{telemetry.activeNodes}</h4>
                    <span className="text-xs font-black uppercase opacity-40 mb-2 tracking-[0.3em]">Nodes</span>
                 </div>
                 <Activity size={28} className="opacity-10 group-hover:opacity-60 transition-opacity" />
              </div>
           </div>

           {/* Card 3: Supply Chain Integrity */}
           <div className={`p-10 group hover:-translate-y-4 flex flex-col justify-between min-h-[400px] ${containerClass}`}>
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Supply Chain</p>
                    <h4 className={`text-xl font-black uppercase tracking-[0.1em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Integrity</h4>
                 </div>
                 <div className={`p-5 rounded-3xl transition-all ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'} text-rose-500 group-hover:rotate-12`}>
                    <Package size={28} strokeWidth={2.5} />
                 </div>
              </div>

              <div className="my-10 flex flex-col gap-4 p-6 rounded-[2rem] bg-slate-500/5 border border-white/5 shadow-inner">
                 <div className="flex items-center gap-4">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></div>
                   <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Warehouse Linked</span>
                 </div>
                 <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.3em]">Asset Sync: Continuous</p>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-8">
                 <div className="flex items-baseline gap-3">
                    <h4 className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-rose-500'}`}>
                       {inventory.filter(i => i.status === 'CRITICAL').length}
                    </h4>
                    <span className="text-xs font-black uppercase opacity-40 mb-2 tracking-[0.3em]">Criticals</span>
                 </div>
                 <ShieldAlert size={28} className="opacity-10 group-hover:opacity-60 transition-opacity" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
