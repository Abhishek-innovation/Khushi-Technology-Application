
import React, { useState } from 'react';
import { useApp } from '../App';
import { Send, User, MessageSquare, Megaphone, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';

const CommunicationView: React.FC = () => {
  const { isDark, staff } = useApp();
  const [activeChannel, setActiveChannel] = useState<'ANNOUNCEMENTS' | 'TEAM_CHAT'>('TEAM_CHAT');
  const [message, setMessage] = useState('');

  const [chatHistory] = useState([
    { id: 1, sender: 'Rajesh Kumar', text: 'Poles for Rajendra Nagar have arrived at site.', time: '10:30 AM', role: 'SITE_SUPERVISOR' },
    { id: 2, sender: 'Admin', text: 'Confirmed. Please ensure depth verification before mounting.', time: '10:45 AM', role: 'ADMIN' },
    { id: 3, sender: 'Priya Sharma', text: 'Zone B wiring is 90% complete. Need technician for final testing.', time: '11:15 AM', role: 'TECHNICIAN' },
  ]);

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="p-8 pb-0">
        <h1 className={`text-3xl font-black mb-8 ${isDark ? 'text-white' : 'text-[#002366]'}`}>Communication Hub</h1>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 pt-0 gap-8">
        <div className={`hidden lg:flex flex-col w-80 rounded-[2.5rem] border overflow-hidden transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className="p-6 border-b border-inherit">
             <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Search size={16} className="opacity-40" />
                <input placeholder="Search chat..." className="bg-transparent border-none outline-none text-xs w-full" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
             <div>
                <p className="text-[10px] font-black uppercase opacity-40 mb-4 px-2 tracking-widest">Channels</p>
                <div className="space-y-1">
                   <button 
                    onClick={() => setActiveChannel('ANNOUNCEMENTS')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeChannel === 'ANNOUNCEMENTS' ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-500/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                   >
                     <Megaphone size={18} />
                     <span className="text-xs font-black">Official Updates</span>
                   </button>
                   <button 
                    onClick={() => setActiveChannel('TEAM_CHAT')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeChannel === 'TEAM_CHAT' ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-500/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                   >
                     <MessageSquare size={18} />
                     <span className="text-xs font-black">Operations Team</span>
                   </button>
                </div>
             </div>

             <div>
                <p className="text-[10px] font-black uppercase opacity-40 mb-4 px-2 tracking-widest">Active Personnel</p>
                <div className="space-y-3">
                   {staff.map(s => (
                     <div key={s.id} className="flex items-center gap-3 p-2 px-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
                        <div className="relative">
                           <img src={s.avatar} className="w-10 h-10 rounded-xl object-cover" alt={s.name} />
                           <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#16222c] rounded-full"></div>
                        </div>
                        <div>
                           <p className="text-xs font-black truncate max-w-[120px]">{s.name}</p>
                           <p className="text-[9px] uppercase font-black opacity-30">{s.role}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col rounded-[2.5rem] border overflow-hidden transition-colors ${isDark ? 'bg-[#16222c] border-white/5' : 'bg-white border-gray-100 shadow-2xl'}`}>
           <div className="p-6 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-[#FF8C00]/10 text-[#FF8C00] rounded-2xl">
                    {activeChannel === 'TEAM_CHAT' ? <MessageSquare size={20} /> : <Megaphone size={20} />}
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">
                       {activeChannel === 'TEAM_CHAT' ? 'Operations Main Feed' : 'Company Announcements'}
                    </h3>
                    <p className="text-[10px] opacity-40 font-bold">12 Active Site Members</p>
                 </div>
              </div>
              <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                 <MoreVertical size={20} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'ADMIN' ? 'flex-row-reverse' : ''}`}>
                   <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${msg.role === 'ADMIN' ? 'bg-[#002366] text-white' : 'bg-[#FF8C00] text-white'}`}>
                         {msg.sender[0]}
                      </div>
                   </div>
                   <div className={`max-w-[70%] space-y-2 ${msg.role === 'ADMIN' ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${msg.role === 'ADMIN' ? 'order-2' : ''}`}>
                            {msg.sender}
                         </span>
                         <span className="text-[9px] opacity-30 font-bold">{msg.time}</span>
                      </div>
                      <div className={`p-4 px-6 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                        msg.role === 'ADMIN' 
                          ? 'bg-[#002366] text-white rounded-tr-none' 
                          : isDark ? 'bg-white/5 text-white/90 rounded-tl-none border border-white/5' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}>
                         {msg.text}
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-6 border-t border-inherit">
              <div className={`flex items-center gap-4 p-4 rounded-[2rem] border transition-all ${isDark ? 'bg-white/5 border-white/5 focus-within:border-[#FF8C00]/50' : 'bg-gray-50 border-gray-200 focus-within:border-[#FF8C00]/50'}`}>
                 <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                    <Paperclip size={20} />
                 </button>
                 <input 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message or share site update..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium" 
                 />
                 <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                    <Smile size={20} />
                 </button>
                 <button className="p-3 bg-[#FF8C00] text-white rounded-xl shadow-lg shadow-orange-500/20 active:scale-90 transition-all">
                    <Send size={20} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationView;