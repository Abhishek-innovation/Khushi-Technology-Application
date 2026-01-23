
import React, { useState } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  Cell, PieChart, Pie
} from 'recharts';
import { 
  Sparkles, FileText, Download, TrendingUp, AlertTriangle, 
  Calendar, Zap, DollarSign, Loader2, RefreshCw, Key
} from 'lucide-react';

const ReportsView: React.FC = () => {
  const { isDark, projects, inventory, triggerKeySelection } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const installationTrends = [
    { name: 'Mon', completed: 4, targets: 5 },
    { name: 'Tue', completed: 7, targets: 5 },
    { name: 'Wed', completed: 5, targets: 5 },
    { name: 'Thu', completed: 8, targets: 5 },
    { name: 'Fri', completed: 6, targets: 5 },
    { name: 'Sat', completed: 9, targets: 5 },
    { name: 'Sun', completed: 3, targets: 5 },
  ];

  const inventoryAllocation = [
    { name: 'LEDs', value: 400 },
    { name: 'Poles', value: 300 },
    { name: 'Cables', value: 300 },
    { name: 'Controllers', value: 200 },
  ];

  const runAiAudit = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setErrorMsg(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior auditor for Khushi Technology. Analyze these project assets and statuses:
      Projects: ${JSON.stringify(projects)}
      Inventory: ${JSON.stringify(inventory)}
      Identify key logistical risks and cost-saving opportunities. 100 words max.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text || "No insights could be generated at this time.");
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes("Requested entity was not found")) {
        setErrorMsg("API entity not found. Your key may need reconfiguration.");
      } else {
        setErrorMsg(`Audit Failed: ${msg}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`p-6 md:p-8 pb-24 md:pb-8 space-y-8 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>Enterprise Analytics</h1>
           <p className="text-[10px] font-black uppercase opacity-30 mt-1 tracking-[0.4em]">Resource Optimization & Operational Intelligence</p>
        </div>
        <div className="flex gap-3">
           <button className={`h-11 px-6 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 shadow-sm'}`}>
              <Download size={16} /> Export
           </button>
           <button 
            onClick={runAiAudit}
            disabled={isAnalyzing}
            className="h-11 px-6 bg-[#FF8C00] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all hover:bg-orange-600"
           >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              AI Audit
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Weekly Velocity', val: '88%', icon: <TrendingUp size={18} />, color: 'text-emerald-500' },
           { label: 'Operating Margin', val: '24.2%', icon: <DollarSign size={18} />, color: 'text-blue-500' },
           { label: 'Energy Offset', val: '1.2 MWh', icon: <Zap size={18} />, color: 'text-orange-500' },
           { label: 'Composite Risk', val: 'Low', icon: <AlertTriangle size={18} />, color: 'text-slate-400' },
         ].map((stat, i) => (
           <div key={i} className={`p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/30'}`}>
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[9px] font-black uppercase opacity-20 tracking-[0.3em]">{stat.label}</p>
                 <div className={`p-2 rounded-xl bg-slate-500/5 ${stat.color}`}>{stat.icon}</div>
              </div>
              <h4 className="text-3xl font-black tracking-tighter">{stat.val}</h4>
           </div>
         ))}
      </div>

      {(aiAnalysis || errorMsg) && (
        <div className={`p-8 rounded-[2.5rem] border animate-in slide-in-from-top-4 duration-500 ${errorMsg ? 'bg-rose-500/5 border-rose-500/20' : 'bg-[#FF8C00]/5 border-[#FF8C00]/20'}`}>
           <div className="flex flex-col md:flex-row items-start gap-6">
              <div className={`p-4 rounded-2xl shadow-lg shrink-0 ${errorMsg ? 'bg-rose-500 text-white' : 'bg-[#002366] text-white'}`}>
                {errorMsg ? <Key size={24}/> : <FileText size={24} />}
              </div>
              <div className="flex-1 space-y-4">
                 <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${errorMsg ? 'text-rose-500' : 'text-[#002366] dark:text-orange-400'}`}>
                   {errorMsg ? 'Audit Engine Fault' : 'Strategic Intelligence Report'}
                 </h3>
                 <div className={`text-base leading-relaxed font-bold tracking-tight ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    {errorMsg || aiAnalysis?.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                 </div>
                 <div className="flex items-center gap-6 pt-2">
                    {errorMsg && (
                       <button 
                        onClick={triggerKeySelection}
                        className="px-5 py-2.5 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-md"
                       >
                         <Key size={14}/> Re-Configure API
                       </button>
                    )}
                    <button onClick={() => { setAiAnalysis(null); setErrorMsg(null); }} className="text-[9px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                       <RefreshCw size={12} /> Reset Console
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
         <div className={`p-10 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#002366]'}`}>Installation Velocity</h3>
                  <p className="text-[9px] opacity-30 font-black uppercase tracking-[0.4em] mt-1">Operational Performance Rolling 7-Day</p>
               </div>
               <Calendar size={18} className="opacity-10" />
            </div>
            <div className="h-[320px]">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={installationTrends}>
                    <defs>
                      <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#ffffff08' : '#00000005'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: isDark ? '#ffffff20' : '#00236640'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: isDark ? '#ffffff20' : '#00236640'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', fontWeight: 900, fontSize: '11px'}}
                    />
                    <Area type="monotone" dataKey="completed" stroke="#FF8C00" strokeWidth={4} fillOpacity={1} fill="url(#velocityGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className={`p-10 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#002366]'}`}>Asset Distribution</h3>
                  <p className="text-[9px] opacity-30 font-black uppercase tracking-[0.4em] mt-1">Quantum Allocation by Inventory Class</p>
               </div>
               <DollarSign size={18} className="opacity-10" />
            </div>
            <div className="h-[320px]">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={inventoryAllocation}
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {inventoryAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#FF8C00', '#002366', '#3b82f6', '#10b981'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="flex justify-center flex-wrap gap-6 mt-4">
                  {inventoryAllocation.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: ['#FF8C00', '#002366', '#3b82f6', '#10b981'][i]}}></div>
                       <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">{item.name}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ReportsView;
