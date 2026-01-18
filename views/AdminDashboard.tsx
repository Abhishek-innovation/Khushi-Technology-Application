
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { 
  BarChart3, AlertCircle, Bell, SearchIcon, UserPlus, 
  Sparkles, Loader2, Info, Map as MapIcon, ExternalLink, 
  Navigation, Maximize2, Crosshair, Globe, ArrowUpRight
} from 'lucide-react';
import { Project } from '../types';

const AdminDashboard: React.FC = () => {
  const { setActiveView, projects, staff, inventory, isDark, user } = useApp();
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  
  // Map Grounding State
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [siteIntelligence, setSiteIntelligence] = useState<{
    text: string;
    links: { title: string; uri: string }[];
  } | null>(null);

  const generateAiReport = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an Operations Analyst for Khushi Technology.
      Analyze the following current data:
      Projects: ${JSON.stringify(projects.map(p => ({name: p.name, status: p.status, progress: p.progress})))}
      Inventory: ${JSON.stringify(inventory.map(i => ({name: i.name, qty: i.quantity, status: i.status})))}
      Provide a 3-sentence executive summary highlighting the most critical risks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Correctly access text property
      setAiReport(response.text || "No analysis generated.");
    } catch (err) {
      setAiReport("Unable to generate AI report at this time. Please check your connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const fetchSiteIntelligence = async (project: Project) => {
    setIsMapLoading(true);
    setSiteIntelligence(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Get user location for context if available
      let latLng = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        console.debug("Location access denied or unavailable");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: `Provide site intelligence for a lighting project located at "${project.location}". Tell me about the accessibility, nearby landmarks, and potential logistical challenges.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: latLng
            }
          }
        },
      });

      // Extract grounding chunks for maps
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk: any) => chunk.maps)
        ?.map((chunk: any) => ({
          title: chunk.maps.title,
          uri: chunk.maps.uri
        })) || [];

      setSiteIntelligence({
        text: response.text || "No intelligence data available for this site.",
        links: links
      });
    } catch (err) {
      console.error("Maps grounding error:", err);
      setSiteIntelligence({
        text: "Error fetching site intelligence via Google Maps Grounding.",
        links: []
      });
    } finally {
      setIsMapLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchSiteIntelligence(selectedProject);
    }
  }, [selectedProject]);

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-gray-50'}`}>
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>Admin Command Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="opacity-40 text-[10px] font-black uppercase tracking-widest">System Live & Synchronized</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={generateAiReport}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-3 shadow-xl active:scale-95 transition-all"
             >
                {isAiLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                Generate Smart Analysis
             </button>
          </div>
        </div>

        {aiReport && (
          <div className={`p-8 rounded-[2.5rem] border animate-in slide-in-from-top-4 duration-500 ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
            <div className="flex items-start gap-4">
               <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg"><Info size={24}/></div>
               <div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-2">AI Operations Insight</h3>
                 <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{aiReport}</p>
                 <button onClick={() => setAiReport(null)} className="mt-4 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity">Dismiss Insight</button>
               </div>
            </div>
          </div>
        )}

        {/* Live Site Monitoring Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map View */}
          <div className={`lg:col-span-8 rounded-[3rem] border overflow-hidden relative group shadow-2xl ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="absolute top-8 left-8 z-10 flex gap-3">
              <div className={`px-4 py-2 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-lg ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white/80 border-gray-200 text-[#002366]'}`}>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Live GPS Feed</span>
              </div>
            </div>
            
            <div className="w-full h-[600px] bg-slate-200 relative">
              {selectedProject ? (
                <iframe
                  title="Site Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ''}&q=${encodeURIComponent(selectedProject.location)}&zoom=15&maptype=satellite`}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-4 opacity-40">
                  <Globe size={48} className="animate-spin-slow" />
                  <p className="text-sm font-black uppercase tracking-widest">Initializing Satellite View...</p>
                </div>
              )}
              
              {/* Overlay for Map Selection */}
              <div className="absolute bottom-8 right-8 z-10 flex gap-2">
                 <button className={`p-3 rounded-xl backdrop-blur-md transition-all active:scale-90 ${isDark ? 'bg-black/60 text-white' : 'bg-white/90 text-gray-700'}`}>
                   <Crosshair size={20} />
                 </button>
                 <button className={`p-3 rounded-xl backdrop-blur-md transition-all active:scale-90 ${isDark ? 'bg-black/60 text-white' : 'bg-white/90 text-gray-700'}`}>
                   <Maximize2 size={20} />
                 </button>
              </div>
            </div>
          </div>

          {/* Site Intelligence Side-Panel */}
          <div className="lg:col-span-4 space-y-8">
            <div className={`p-8 rounded-[2.5rem] border h-full flex flex-col ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
               <div className="flex items-center justify-between mb-8">
                 <h3 className={`text-xs font-black uppercase tracking-widest opacity-40 ${isDark ? 'text-white' : 'text-[#002366]'}`}>Site Intelligence</h3>
                 <MapIcon size={18} className="opacity-20" />
               </div>

               {/* Project Selector Mini-List */}
               <div className="space-y-3 mb-8">
                 {projects.map((p) => (
                   <button 
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                      selectedProject?.id === p.id 
                        ? (isDark ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-lg shadow-orange-500/20')
                        : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-[#002366]')
                    }`}
                   >
                     <div className="flex items-center gap-3">
                       <Navigation size={14} className={selectedProject?.id === p.id ? 'opacity-100' : 'opacity-30'} />
                       <div>
                         <p className="text-xs font-black truncate max-w-[150px]">{p.name}</p>
                         <p className={`text-[8px] uppercase tracking-widest opacity-60 ${selectedProject?.id === p.id ? 'text-white' : ''}`}>
                           {p.status}
                         </p>
                       </div>
                     </div>
                     {/* Use ArrowUpRight component correctly */}
                     <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                 ))}
               </div>

               {/* Grounding Intelligence Output */}
               <div className={`flex-1 rounded-[1.5rem] p-6 border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                  {isMapLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 size={32} className="animate-spin text-orange-500" />
                      <p className="text-[10px] font-black uppercase opacity-40 animate-pulse">Consulting Maps Grounding...</p>
                    </div>
                  ) : siteIntelligence ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div>
                        <p className={`text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest ${isDark ? 'text-white' : 'text-[#002366]'}`}>Logistics Summary</p>
                        <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                          {siteIntelligence.text}
                        </p>
                      </div>

                      {siteIntelligence.links.length > 0 && (
                        <div>
                          <p className={`text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest ${isDark ? 'text-white' : 'text-[#002366]'}`}>Maps References</p>
                          <div className="space-y-2">
                            {siteIntelligence.links.map((link, idx) => (
                              <a 
                                key={idx} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-gray-200 hover:border-orange-200 text-[#002366]'
                                }`}
                              >
                                <span className="truncate">{link.title || 'View on Google Maps'}</span>
                                <ExternalLink size={12} className="text-orange-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 py-12 text-center opacity-30">
                      <SearchIcon size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Select a site to view intelligence</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className={`p-10 rounded-[3rem] border group hover:border-orange-500/50 transition-all ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Active Fleet</p>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                   <UserPlus size={18} />
                </div>
              </div>
              <h4 className="text-4xl font-black">{staff.length} <span className="text-xs opacity-40">Staff Units</span></h4>
           </div>
           
           <div className={`p-10 rounded-[3rem] border group hover:border-blue-500/50 transition-all ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Projects</p>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                   <BarChart3 size={18} />
                </div>
              </div>
              <h4 className="text-4xl font-black">{projects.length} <span className="text-xs opacity-40">Live Sites</span></h4>
           </div>
           
           <div className={`p-10 rounded-[3rem] border group hover:border-red-500/50 transition-all ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Inventory Risk</p>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                   <AlertCircle size={18} />
                </div>
              </div>
              <h4 className="text-4xl font-black text-red-500">{inventory.filter(i => i.status === 'CRITICAL').length} <span className="text-xs opacity-40 font-black">Critical Alerts</span></h4>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
