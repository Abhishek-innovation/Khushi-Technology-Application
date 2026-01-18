
import React, { useState } from 'react';
import { useApp } from '../App';
import { Package, Plus, Minus, Search, History, ArrowUpRight, ArrowDownLeft, SlidersHorizontal } from 'lucide-react';

const InventoryView: React.FC = () => {
  const { inventory, setInventory, isDark } = useApp();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);

  const handleUpdateStock = (action: 'IN' | 'OUT') => {
    if (!selectedItem || amount <= 0) return;
    
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItem) {
        const newQty = action === 'IN' ? item.quantity + amount : item.quantity - amount;
        return { 
          ...item, 
          quantity: newQty,
          status: newQty < item.reorderPoint ? 'CRITICAL' : 'SUFFICIENT'
        };
      }
      return item;
    }));
    setAmount(0);
    setSelectedItem(null);
  };

  return (
    <div className={`p-8 md:p-14 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-gray-50/50'}`}>
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>Inventory Ledger</h1>
            <p className="text-[10px] font-black uppercase opacity-30 mt-2 tracking-[0.3em]">Asset Distribution & Stock Lifecycle</p>
          </div>
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                <Search size={16} className="opacity-30" />
                <input placeholder="Search assets..." className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-48" />
             </div>
             <button className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 shadow-sm hover:border-[#FF8C00]'}`}>
                <SlidersHorizontal size={20} className="opacity-40" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Main Ledger */}
          <div className={`xl:col-span-8 rounded-[3.5rem] border overflow-hidden ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]'}`}>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className={`border-b border-inherit ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <th className="px-10 py-8 text-[9px] font-black uppercase opacity-30 tracking-[0.2em]">Asset Definition</th>
                    <th className="px-10 py-8 text-[9px] font-black uppercase opacity-30 tracking-[0.2em]">Classification</th>
                    <th className="px-10 py-8 text-[9px] font-black uppercase opacity-30 tracking-[0.2em]">Quantum</th>
                    <th className="px-10 py-8 text-[9px] font-black uppercase opacity-30 tracking-[0.2em]">Status Code</th>
                    <th className="px-10 py-8 text-[9px] font-black uppercase opacity-30 tracking-[0.2em] text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {inventory.map((item) => (
                    <tr key={item.id} className={`group transition-all duration-300 ${selectedItem === item.id ? 'bg-orange-500/5' : 'hover:bg-gray-500/5'}`}>
                      <td className="px-10 py-8">
                        <p className="font-black text-sm tracking-tight">{item.name}</p>
                        <p className="text-[8px] font-black opacity-30 mt-1 uppercase tracking-widest">ID: {item.id}</p>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>{item.category}</span>
                      </td>
                      <td className="px-10 py-8 font-black text-sm">
                        {item.quantity} <span className="opacity-30 text-[10px] ml-1">{item.unit}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${item.status === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
                           <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'CRITICAL' ? 'text-rose-500' : 'text-emerald-500'}`}>
                             {item.status}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => setSelectedItem(item.id)}
                          className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${
                            selectedItem === item.id 
                              ? 'bg-[#FF8C00] text-white shadow-xl shadow-orange-500/20' 
                              : isDark ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-[#002366] hover:bg-slate-200'
                          }`}
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adjustment Console */}
          <div className="xl:col-span-4 space-y-10">
            <div className={`p-12 rounded-[3.5rem] border shadow-2xl transition-all duration-700 ${
              selectedItem ? (isDark ? 'bg-[#16222c] border-[#FF8C00]/30' : 'bg-[#002366] text-white border-transparent') : (isDark ? 'bg-[#16222c] border-white/5 opacity-50' : 'bg-white border-slate-100 opacity-50')
            }`}>
              <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Terminal Adjustment</h3>
              
              {!selectedItem ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <Package size={48} className="opacity-10" />
                  <p className="opacity-40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Select an asset from the ledger to initiate modification sequence.</p>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Quantum to offset</p>
                    <div className={`p-6 rounded-3xl border text-3xl font-black text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'}`}>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))}
                        className="bg-transparent border-none outline-none w-full text-center"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <button 
                      onClick={() => handleUpdateStock('IN')}
                      className="group p-8 bg-emerald-500 text-white rounded-[2.5rem] transition-all active:scale-95 flex flex-col items-center gap-4 shadow-2xl shadow-emerald-900/20"
                    >
                      <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Record In</span>
                    </button>
                    <button 
                      onClick={() => handleUpdateStock('OUT')}
                      className="group p-8 bg-rose-500 text-white rounded-[2.5rem] transition-all active:scale-95 flex flex-col items-center gap-4 shadow-2xl shadow-rose-900/20"
                    >
                      <ArrowDownLeft size={24} className="group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Record Out</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 text-[9px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity tracking-[0.4em]"
                  >
                    Cancel Transaction
                  </button>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-slate-100'}`}>
               <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-6">Ledger Health</p>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Critical Stock Alerts</span>
                    <span className="text-xl font-black text-rose-500">{inventory.filter(i => i.status === 'CRITICAL').length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-500/10 rounded-full overflow-hidden">
                     <div className="h-full bg-rose-500" style={{width: '20%'}}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
