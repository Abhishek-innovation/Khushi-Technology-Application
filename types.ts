
export enum Language {
  EN = 'EN',
  HI = 'HI'
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SITE_SUPERVISOR = 'SITE_SUPERVISOR',
  TECHNICIAN = 'TECHNICIAN',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  ELECTRICIAN = 'ELECTRICIAN'
}

export enum AppView {
  DASHBOARD = 'dashboard',
  PROJECTS = 'projects',
  STAFF = 'staff',
  CREATE_STAFF = 'create_staff',
  INVENTORY = 'inventory',
  REPORTS = 'reports',
  COMMUNICATION = 'communication',
  SETTINGS = 'settings'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  organization?: string;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'SICK' | 'UNAVAILABLE';
  workload?: number;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ATTENTION_NEEDED = 'ATTENTION_NEEDED',
  COMPLETED = 'COMPLETED',
  AWAITING_MATERIALS = 'AWAITING_MATERIALS'
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
  location: string;
  description: string;
  budget: number;
  phase: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'LED_FIXTURES' | 'POLES' | 'CABLES' | 'HARDWARE' | 'SOLAR';
  quantity: number;
  reorderPoint: number;
  unit: string;
  status: 'SUFFICIENT' | 'LOW' | 'CRITICAL';
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignedTo: string[];
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'URGENT' | 'BLOCKED';
  location: string;
  instructions: string;
}

export interface SiteIntelligence {
  text: string;
  links: { title: string; uri: string }[];
}
