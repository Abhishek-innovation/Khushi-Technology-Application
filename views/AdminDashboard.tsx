
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Loader2, Map as MapIcon, 
  Crosshair, Globe, ArrowUpRight,
  ShieldAlert, Key, Zap, Users, Package, Briefcase
} from 'lucide-react';
import { Project, SiteIntelligence } from '../types';

const AdminDashboard: React.FC = () => {
  const { projects, staff, inventory, isDark, triggerKeySelection, t } = useApp();
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [siteIntelligence, setSiteIntelligence] = useState<SiteIntelligence | null>(null);

  const handleError = (err: any) => {
    const msg = err?.message || String(err);
    if (msg.includes("Requested entity was not found")) {
      setApiError("API configuration mismatch. Please re-select your Gemini API key.");
    } else {
      setApiError(`API Execution Error: ${msg}`);
    }
  };

  const generateAiReport = async () => {
    setIsAiLoading(true);
    setApiError(null);
    setAiReport(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform an executive operational audit for Khushi Technology. Summarize project risks and resource gaps. 60 words max.`;
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

  return (
    <div className={`p-6 md:p-8 min-h-full transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
              {t('commandCenter')}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="opacity-40 text-[9px] font-bold uppercase tracking-widest">Live Operations</p>
            </div>
          </div>

          <button 
            onClick={generateAiReport}
            disabled={isAiLoading}
            className="w-full md:w-auto px-5 py-2.5 bg-[#002366] text-white rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14} className="text-orange-400" />}
            {t('operationalAudit')}
          </button>
        </div>

        {/* AI Banner */}
        {(aiReport || apiError) && (
          <div className={`p-5 rounded-xl border animate-fade-in ${apiError ? 'bg-rose-500/5 border-rose-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
            <div className="flex flex-col md:flex-row items-start gap-4">
               <div className={`p-2.5 rounded-lg shrink-0 ${apiError ? 'bg-rose-500 text-white' : 'bg-orange-500 text-white'}`}>
                 {apiError ? <ShieldAlert size={18}/> : <Sparkles size={18}/>}
               </div>
               <div className="flex-1">
                 <h3 className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${apiError ? 'text-rose-500' : 'text-orange-500'}`}>
                   {apiError ? 'System Integrity Fault' : 'Strategic Report'}
                 </h3>
                 <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
                   {apiError || aiReport}
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className={`lg:col-span-8 rounded-2xl border overflow-hidden relative shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="w-full h-[280px] md:h-[400px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              {selectedProject ? (
                <iframe
                  title="Site Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, filter: isDark ? 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' : 'none' }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ''}&q=${encodeURIComponent(selectedProject.location)}&zoom=15&maptype=satellite`}
                  allowFullScreen
                ></iframe>
              ) : (
                <Globe size={32} className="animate-spin-slow opacity-10" />
              )}
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-4 flex flex-col">
            <div className={`flex-1 p-5 rounded-2xl border flex flex-col shadow-sm ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200'}`}>
               <h3 className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-4">{t('siteDeployment')}</h3>
               <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 max-h-[320px]">
                 {projects.map((p) => (
                   <button 
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full p-3.5 rounded-lg border transition-all text-left flex items-center justify-between group ${
                      selectedProject?.id === p.id 
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                        : isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-[#fcfcfd] border-slate-100 text-slate-800'
                    }`}
                   >
                     <div className="flex items-center gap-3">
                       <Crosshair size={14} className={selectedProject?.id === p.id ? 'opacity-100' : 'opacity-20'} />
                       <div className="truncate">
                         <p className="text-xs font-bold truncate">{p.name}</p>
                         <p className={`text-[8px] font-bold tracking-widest uppercase opacity-40 ${selectedProject?.id === p.id ? 'text-white' : ''}`}>{p.status}</p>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           {[
             { label: 'Personnel Deployed', val: staff.length, icon: <Users size={18}/>, color: 'text-blue-500' },
             { label: 'Active Deployments', val: projects.length, icon: <Briefcase size={18}/>, color: 'text-orange-500' },
             { label: 'Inventory Alerts', val: inventory.filter(i => i.status !== 'SUFFICIENT').length, icon: <Package size={18}/>, color: 'text-rose-500' },
           ].map((stat, i) => (
             <div key={i} className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-3">
                  <p className="text-[9px] font-bold uppercase opacity-30 tracking-widest">{stat.label}</p>
                  <div className={`opacity-40 ${stat.color}`}>{stat.icon}</div>
                </div>
                <h4 className="text-2xl font-bold tracking-tight">{stat.val}</h4>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
