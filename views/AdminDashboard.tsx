
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Loader2, Map as MapIcon, 
  Crosshair, Globe, ArrowUpRight,
  ShieldAlert, Key, Zap, Users, Package, Briefcase,
  Activity, Radio, Battery, Wind, CloudRain, Info,
  Search, Maximize2, Target, MapPin
} from 'lucide-react';
import { Project, SiteIntelligence } from '../types';

const AdminDashboard: React.FC = () => {
  const { projects, staff, inventory, isDark, triggerKeySelection, t } = useApp();
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isIntelLoading, setIsIntelLoading] = useState(false);
  const [siteIntelligence, setSiteIntelligence] = useState<SiteIntelligence | null>(null);

  const mapImageUrl = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000";

  const [telemetry, setTelemetry] = useState({
    connectivity: 99.4,
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

  const handleError = (err: any) => {
    const msg = err?.message || String(err);
    if (msg.includes("Requested entity was not found")) {
      setApiError("API configuration mismatch. Please re-select your Gemini API key.");
    } else {
      setApiError(`API Execution Error: ${msg}`);
    }
  };

  const fetchSiteIntelligence = async (project: Project) => {
    setIsIntelLoading(true);
    setSiteIntelligence(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a 30-word site intelligence profile for lighting infrastructure at "${project.location}". Focus on visibility, terrain, and challenges.`,
        config: { thinkingConfig: { thinkingBudget: 0 } },
      });

      setSiteIntelligence({ 
        text: response.text || "Intelligence profile loaded.", 
        links: [] 
      });
    } catch (err: any) {
      console.error("Site Intelligence Error:", err);
      setSiteIntelligence({ 
        text: "Site intelligence scanner currently processing. Status: Pending.", 
        links: [] 
      });
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
      const prompt = `Act as an executive auditor for Khushi Technology. Audit these projects: ${JSON.stringify(projects)}. Highlight one critical risk. 40 words max.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiReport(response.text || "Operational analysis complete.");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) fetchSiteIntelligence(selectedProject);
  }, [selectedProject]);

  return (
    <div className={`p-5 md:p-8 pb-24 md:pb-8 min-h-full transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#002366] text-white'}`}>
              <Activity size={24} />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
                {t('commandCenter')}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="opacity-40 text-[9px] font-bold uppercase tracking-widest">Live Node Synchronized</p>
              </div>
            </div>
          </div>

          <button 
            onClick={generateAiReport}
            disabled={isAiLoading}
            className="w-full md:w-auto px-6 py-3 bg-[#002366] text-white rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14} className="text-orange-400" />}
            {t('operationalAudit')}
          </button>
        </div>

        {(aiReport || apiError) && (
          <div className={`p-5 rounded-[2rem] border animate-fade-in ${apiError ? 'bg-rose-500/5 border-rose-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
            <div className="flex items-start gap-5">
               <div className={`p-2.5 rounded-xl shrink-0 ${apiError ? 'bg-rose-500 text-white' : 'bg-orange-500 text-white'}`}>
                 {apiError ? <ShieldAlert size={18}/> : <Sparkles size={18}/>}
               </div>
               <div className="flex-1">
                 <h3 className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${apiError ? 'text-rose-500' : 'text-orange-500'}`}>
                   {apiError ? 'Security Protocol Breach' : 'Audit Intelligence Report'}
                 </h3>
                 <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
                   {apiError || aiReport}
                 </p>
               </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className={`xl:col-span-8 rounded-[2.5rem] border overflow-hidden relative shadow-2xl group transition-all duration-700 ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200'}`}>
            
            <div className="absolute top-8 left-8 z-20 space-y-4 pointer-events-none">
               <div className="flex gap-3">
                 <div className={`px-4 py-2 rounded-xl backdrop-blur-xl border flex items-center gap-3 ${isDark ? 'bg-[#0b141d]/80 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-[#002366]'}`}>
                    <Radio size={14} className="text-orange-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Satellite Link</span>
                      <span className="text-[10px] font-black tracking-tight">{telemetry.connectivity.toFixed(1)}% Strength</span>
                    </div>
                 </div>
                 <div className={`px-4 py-2 rounded-xl backdrop-blur-xl border flex items-center gap-3 ${isDark ? 'bg-[#0b141d]/80 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-[#002366]'}`}>
                    <Battery size={14} className="text-emerald-500" />
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Efficiency</span>
                      <span className="text-[10px] font-black tracking-tight">+{telemetry.efficiency.toFixed(1)}% Yield</span>
                    </div>
                 </div>
               </div>
               
               <div className={`px-4 py-1.5 rounded-lg backdrop-blur-md border inline-flex items-center gap-2 ${isDark ? 'bg-[#0b141d]/40 border-white/5 text-white/40' : 'bg-white/40 border-slate-100 text-[#002366]/40'}`}>
                 <MapPin size={10} />
                 <span className="text-[8px] font-black uppercase tracking-widest">{selectedProject?.location || "Scanning Global Matrix"}</span>
               </div>
            </div>

            <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
               <div className={`p-6 rounded-[2rem] backdrop-blur-2xl border max-w-[280px] shadow-3xl transition-all duration-500 transform group-hover:scale-[1.02] ${isDark ? 'bg-[#0b141d]/80 border-orange-500/20 text-white' : 'bg-white/95 border-orange-500/20 text-[#002366]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Site Profile Intelligence</span>
                    </div>
                    <Info size={14} className="text-orange-500 opacity-60" />
                  </div>
                  {isIntelLoading ? (
                    <div className="flex items-center gap-3 py-3">
                      <Loader2 size={16} className="animate-spin text-orange-500" />
                      <span className="text-[10px] font-bold opacity-40 italic tracking-tight">Accessing geospatial data via Gemini...</span>
                    </div>
                  ) : (
                    <p className="text-xs font-bold leading-relaxed tracking-tight mb-4 text-balance">
                      {siteIntelligence?.text || "Synchronize with a project node to initialize site profile intelligence."}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase opacity-30">Scan Status</span>
                      <span className="text-[9px] font-black text-emerald-500">COMPLETE</span>
                    </div>
                    <Target size={16} className="text-orange-500 opacity-40" />
                  </div>
               </div>
            </div>

            <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-3">
               <button className={`p-3 rounded-2xl backdrop-blur-xl border transition-all hover:bg-orange-500 hover:text-white ${isDark ? 'bg-[#0b141d]/60 border-white/10 text-white' : 'bg-white/90 border-slate-200 shadow-lg'}`}>
                  <Maximize2 size={16} />
               </button>
               <button className={`p-3 rounded-2xl backdrop-blur-xl border transition-all hover:bg-orange-500 hover:text-white ${isDark ? 'bg-[#0b141d]/60 border-white/10 text-white' : 'bg-white/90 border-slate-200 shadow-lg'}`}>
                  <Search size={16} />
               </button>
            </div>

            <div className="relative w-full h-[450px] md:h-[550px] bg-slate-900 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 z-0">
                 <img 
                   src={mapImageUrl} 
                   className={`w-full h-full object-cover transition-all duration-1000 ${isDark ? 'opacity-30 grayscale contrast-125' : 'opacity-100'}`}
                   alt="Site Map Base"
                 />
                 <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'bg-[#0b141d]/40' : 'bg-[#002366]/10'}`}></div>
              </div>

              <div className="absolute inset-0 z-10 opacity-60 mix-blend-screen pointer-events-auto">
                {selectedProject && (
                  <iframe
                    title="Live Geospatial Uplink"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, filter: isDark ? 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(1.2)' : 'none' }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ''}&q=${encodeURIComponent(selectedProject.location)}&zoom=17&maptype=satellite`}
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
                <div className="w-full h-full" style={{ backgroundImage: `radial-gradient(${isDark ? '#fff' : '#002366'} 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
              </div>

              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-orange-500/20 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-orange-500/40 rounded-full animate-pulse opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-scan z-20"></div>
              </div>

              {!selectedProject && (
                <div className="relative z-30 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 animate-pulse"></div>
                    <Globe size={80} className="text-orange-500 animate-spin-slow relative" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black uppercase tracking-[0.5em] text-white">Awaiting Node Link</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mt-2">Initialize geospatial telemetry from side panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className={`flex-1 p-6 rounded-[2.5rem] border flex flex-col shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200'}`}>
               <div className="flex items-center justify-between mb-5">
                  <div className="flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30 leading-none mb-1">Deployment Matrix</h3>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#002366]'}`}>{t('siteDeployment')}</h4>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[8px] font-black tracking-widest border border-orange-500/20">OPERATIONAL</div>
               </div>
               
               <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[420px] pr-2">
                 {projects.map((p) => (
                   <button 
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between group active:scale-[0.98] ${
                      selectedProject?.id === p.id 
                        ? 'bg-[#002366] text-white border-transparent shadow-2xl shadow-blue-900/40'
                        : isDark ? 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-800 hover:border-orange-500/50 shadow-sm'
                    }`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-xl transition-all ${selectedProject?.id === p.id ? 'bg-orange-500 text-white' : 'bg-slate-500/10 opacity-40'}`}>
                         <Crosshair size={14} />
                       </div>
                       <div className="truncate">
                         <p className="text-xs font-bold truncate leading-tight mb-0.5">{p.name}</p>
                         <p className={`text-[8px] font-bold tracking-widest uppercase opacity-40 ${selectedProject?.id === p.id ? 'text-white/60' : ''}`}>{p.status}</p>
                       </div>
                     </div>
                     <ArrowUpRight size={14} className={`opacity-20 transition-all ${selectedProject?.id === p.id ? 'opacity-100 scale-110' : 'group-hover:opacity-40 group-hover:translate-x-0.5'}`} />
                   </button>
                 ))}
               </div>
            </div>

            <div className={`p-6 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200'}`}>
               <h5 className="text-[8px] font-black uppercase tracking-widest opacity-20 mb-4">Atmospheric Telemetry</h5>
               <div className="grid grid-cols-2 gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl"><Wind size={14} /></div>
                    <div>
                      <p className="text-[7px] font-bold uppercase opacity-30 leading-none mb-1">Wind Vector</p>
                      <p className="text-xs font-black">12.4 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><CloudRain size={14} /></div>
                    <div>
                      <p className="text-[7px] font-bold uppercase opacity-30 leading-none mb-1">Precipitation</p>
                      <p className="text-xs font-black">0%</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           {[
             { label: 'Personnel Dispatched', val: staff.length, icon: <Users size={18}/>, color: 'text-blue-500', trend: '+2' },
             { label: 'Active Network Points', val: telemetry.activeNodes, icon: <Radio size={18}/>, color: 'text-orange-500', trend: 'Sync' },
             { label: 'Asset Shortfall', val: inventory.filter(i => i.status === 'CRITICAL').length, icon: <Package size={18}/>, color: 'text-rose-500', trend: 'Alert' },
           ].map((stat, i) => (
             <div key={i} className={`p-7 rounded-[2rem] border transition-all duration-500 hover:shadow-xl group ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[9px] font-black uppercase opacity-30 tracking-widest">{stat.label}</p>
                  <div className={`p-2 rounded-xl bg-slate-500/5 group-hover:scale-110 transition-transform ${stat.color}`}>{stat.icon}</div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h4 className="text-3xl font-black tracking-tighter">{stat.val}</h4>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${i === 2 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {stat.trend}
                  </span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(450px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;