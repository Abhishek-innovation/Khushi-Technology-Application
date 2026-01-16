
import React from 'react';
import { LayoutGrid, Folder, Users, Briefcase, FileText, MessageSquare, Settings } from 'lucide-react';

export const COLORS = {
  royalBlue: '#002366',
  orange: '#FF8C00',
  white: '#FFFFFF',
  darkBg: '#0b141d',
  darkSurface: '#16222c'
};

export const MENU_ITEMS = [
  { id: 'dashboard', icon: <LayoutGrid size={20} />, label: 'dashboard' },
  { id: 'projects', icon: <Folder size={20} />, label: 'projects', hasSub: true },
  { id: 'staff', icon: <Users size={20} />, label: 'staff', hasSub: true },
  { id: 'inventory', icon: <Briefcase size={20} />, label: 'inventory', hasSub: true },
  { id: 'reports', icon: <FileText size={20} />, label: 'reports', hasSub: true },
  { id: 'communication', icon: <MessageSquare size={20} />, label: 'communication' },
];
