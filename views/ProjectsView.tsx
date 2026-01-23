
import React, { useState } from 'react';
import { useApp } from '../App';
import { ProjectStatus, Project } from '../types';
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, 
  MapPin, Briefcase, LayoutGrid, List,
  ArrowUpRight, X, Check
} from 'lucide-react';

const ProjectsView: React.FC = () => {
  const { projects, setProjects, isDark } = useApp();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    deadline: '',
    location: '',
    description: '',
    budget: 0
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      ...newProject,
      id: `P${Date.now()}`,
      status: ProjectStatus.PLANNING,
      progress: 0,
      phase: 'Site Survey',
      budget: Number(newProject.budget)
    };
    setProjects(prev => [project, ...prev]);
    setIsModalOpen(false);
    setNewProject({ name: '', client: '', deadline: '', location: '', description: '', budget: 0 });
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 md:p-8 pb-24 md:pb-8 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141d]' : 'bg-[#F8FAFC]'}`}>
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-[#002366]'}`}>Project Management</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 bg-[#FF8C00] text-white rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} /> Add New Project
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-2xl rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#16222c] border-white/10' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#002366]'}`}>Create Project</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="opacity-40 hover:opacity-100" /></button>
              </div>
              <form onSubmit={handleAddProject} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase opacity-40">Project Name</label>
                  <input required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className={`w-full h-11 px-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g. NH-33 Highway Lighting" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase opacity-40">Client</label>
                  <input required value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} className={`w-full h-11 px-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="Client Name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase opacity-40">Deadline</label>
                  <input required type="date" value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})} className={`w-full h-11 px-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <button type="submit" className="col-span-2 h-12 mt-4 bg-[#FF8C00] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all">Save Project</button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className={`p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-[#16222c]/60 border-white/5' : 'bg-white border-gray-100 shadow-lg'}`}>
               <h3 className={`text-lg font-black mb-3 ${isDark ? 'text-white' : 'text-[#002366]'}`}>{p.name}</h3>
               <div className="flex items-center gap-2 opacity-40 text-[10px] font-black uppercase mb-5"><Briefcase size={12}/> {p.client}</div>
               <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-orange-500 h-full" style={{width: `${p.progress}%`}}></div>
               </div>
               <div className="flex justify-between text-[9px] font-black uppercase opacity-40">
                 <span>{p.progress}% Done</span>
                 <span>{p.status}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
