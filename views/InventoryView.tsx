
import React, { useState } from 'react';
import { useApp } from '../App';
import { Package, Plus, Minus, Search, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
    <div className={`p-8 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-gray-50'}`}>
      <div className="max-w-[1600px] mx-auto space-y-8">
        <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-[#002366]'}`}>Inventory Ledger</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Inventory List */}
          <div className={`xl:col-span-2 rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-[#16222c]/60 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-inherit text-[10px] font-black uppercase opacity-40">
                  <th className="px-8 py-6">Item Name</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Quantity</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {inventory.map((item) => (
                  <tr key={item.id} className={`group transition-colors ${selectedItem === item.id ? 'bg-orange-500/10' : 'hover:bg-white/5'}`}>
                    <td className="px-8 py-6 font-bold">{item.name}</td>
                    <td className="px-8 py-6 text-xs opacity-50 uppercase">{item.category}</td>
                    <td className="px-8 py-6 font-black">{item.quantity} {item.unit}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black ${item.status === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedItem(item.id)}
                        className="px-4 py-2 bg-[#FF8C00] text-white rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adjustment Panel */}
          <div className="space-y-8">
            <div className={`p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#16222c] border-white/10' : 'bg-[#002366] text-white'}`}>
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Record Movement</h3>
              {!selectedItem ? (
                <p className="opacity-40 text-xs italic">Select an item from the list to record stock In/Out movement.</p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-2">Amount to Adjust</p>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(Number(e.target.value))}
                      className={`w-full p-4 rounded-xl border text-xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/10 border-white/20 text-white'}`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleUpdateStock('IN')}
                      className="flex-1 py-5 bg-green-500 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <ArrowUpRight size={18} /> Record In
                    </button>
                    <button 
                      onClick={() => handleUpdateStock('OUT')}
                      className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <ArrowDownLeft size={18} /> Record Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
