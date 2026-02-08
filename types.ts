export enum AppView {
  DASHBOARD = 'dashboard',
  TRAINING = 'training',
  BIOMECHANICS = 'biomechanics',
  COMMUNITY = 'community',
  ACHIEVEMENTS = 'achievements',
  AI_COACH = 'ai_coach',
  MEDIA_ANALYSIS = 'media_analysis',
  SETTINGS = 'settings'
}

export interface NavItem {
  id: AppView;
  label: string;
  icon: string;
  badge?: number;
}

export interface Metric {
  label: string;
  value: string | number;
  unit: string;
  status?: string;
  trend?: string;
  icon: string;
}

export interface FeedItem {
  id: number;
  user: string;
  userAvatar: string;
  action: string;
  highlight: string;
  time: string;
  kudos: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface Achievement {
  id: string;
  category: 'Fuerza' | 'Progreso' | 'Tiempo' | 'Gamified';
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  unit?: string;
  isUnlocked: boolean;
  color: string;
}

export interface UserProfile {
  name: string;
  goal: 'Fuerza' | 'Hipertrofia' | 'Pérdida de peso' | '';
  gender: 'Hombre' | 'Mujer' | 'Otro' | '';
  age: string;
  weight: string;
  height: string;
  daysPerWeek: number;
}