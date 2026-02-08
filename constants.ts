import { AppView, NavItem, Metric, FeedItem, Achievement } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: AppView.DASHBOARD, label: 'Inicio', icon: 'dashboard' },
  { id: AppView.TRAINING, label: 'Entrenamiento', icon: 'fitness_center' },
  { id: AppView.MEDIA_ANALYSIS, label: 'Análisis Media', icon: 'perm_media' },
  { id: AppView.AI_COACH, label: 'Coach IA', icon: 'smart_toy' },
  { id: AppView.COMMUNITY, label: 'Comunidad', icon: 'groups', badge: 3 },
  { id: AppView.ACHIEVEMENTS, label: 'Logros', icon: 'emoji_events' },
];

export const READINESS_METRICS: Metric[] = [
  { label: 'VFC', value: 110, unit: 'ms', trend: '+2% vs media', icon: 'ecg_heart' },
  { label: 'Sueño', value: '8h 12m', unit: '', status: 'Óptimo', icon: 'bedtime' },
  { label: 'FCR', value: 42, unit: 'lpm', trend: '-1 lpm', icon: 'monitor_heart' },
];

export const COMMUNITY_FEED: FeedItem[] = [
  {
    id: 1,
    user: 'Sarah',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqiu0rB0YiV_JcXD0GF-MJkX6LPMNpkQHZnahS9B_UI9OY5jR-VK68I06xfcIjpP8-kevWHyV8iESBGlYIWwp1gOAIv2sL5VHOu831U7vvPP3zZx8itc3zR31g8mRppx7t63a54H9ABtqnMcIq6m_U46RmkPUxT4c7P9WPsaAPdhkznZHHRArXGl9vL9XGgpWiiDs3XGTS7SHJATX7ffqpyNbA0-RGfymtbleimeXL4QG33EsJG2k4Au_V4Xt_ZEv_8uKd1gyPg',
    action: 'logró un',
    highlight: 'PR de Peso Muerto 105kg!',
    time: 'hace 20 min',
    kudos: 12
  },
  {
    id: 2,
    user: 'Mike T.',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJTIA1aSMu6cjil0xIgTI2Ov_84nEiJUrvrl1aRCtb1cCq4iu-S9vPPcJdSg7EyL7rcoj_dsM_Ge7X2QRkszxZxZI_yMpNk7dbKV1HhmXlT4IQ0G3kawNHvfUx1sVqXc4sUDkKM1-xmNrMU8xhQ7uxopPTGdjJKOjowqchZfZhruGW4m4xN5vBg7IeSfck54jaR67Ct8RIum9OlGN-uBX8h2gmbV2BaHxtSxLPCzyeEdSAEucThWYImxkHDw2hgv6KeRRnmXJyCA',
    action: 'completó',
    highlight: 'Movilidad Matutina',
    time: 'hace 1 hora',
    kudos: 5
  },
  {
    id: 3,
    user: 'Elena',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiA-10irdfiR-T8rQhsizAFvlrlHe7emz5su79DbJIp5O-bYeWF9kIj1gEnHOU5xZeDWFZYxRFfg7W_KS78S-OWBfvzDScaY8HbMFUbKpvYg6GT_uC-5gpKmpTp-eSe9GgT-9sjOY8fFT0e7faNvL8CxuxH0OkF8AjkyAdjI9DuVBdVunbKsPxsDb5N5wDgfBuKcmp9U9Ji2wChpaVN7smpo62rEzd19RGRY8452kEtr6KCnrbYYjEaSl_J84yi1sV3Lclc7TXZw',
    action: 'consiguió',
    highlight: 'Puntuación de Sueño 98%',
    time: 'hace 3 horas',
    kudos: 24
  }
];

export const PROFILE_IMAGE = 'https://i.postimg.cc/MpFsDFFs/Retrato-de-gatito-atigrado-delantero.png';
export const WORKOUT_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCgGIY5uW0aaH3405O4Gsaqt5_5HedcQryzS8C2o95hz-org94QsntnHJtrlzyViB3dpdybNjjmQBRMbRkz2EQ8HH7saniyyrsDCYNaNMuTn9aowQ8TreHK22YzfDxMBHqS8AEcJCsCcVOeYekbjOCqBKjeUVOkCO0arqLbJ7VetFyv_oJYowgtzBmfKBTFvTgCv9GhjeVIx1VUbdmKWGNl7SaZkDlxHik-whxMP5_qkDIaAyaP9KH-mj3BUMA5uN9_rphlnSkVg';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // Fuerza
  { id: 'f1', category: 'Fuerza', title: 'Primera Dominada', description: 'Realiza tu primera dominada estricta.', icon: 'fitness_center', current: 1, target: 1, isUnlocked: true, color: 'text-emerald-400' },
  { id: 'f2', category: 'Fuerza', title: '10 Flexiones Seguidas', description: 'Sin descanso entre repeticiones.', icon: 'arms', current: 10, target: 10, isUnlocked: true, color: 'text-emerald-400' },
  { id: 'f3', category: 'Fuerza', title: '50 Flexiones Acumuladas', description: 'Total en tu historial.', icon: 'history', current: 35, target: 50, isUnlocked: false, color: 'text-slate-400' },
  { id: 'f4', category: 'Fuerza', title: 'Nuevo PR', description: 'Rompe un récord personal en básicos.', icon: 'trophy', current: 1, target: 1, isUnlocked: true, color: 'text-yellow-400' },

  // Progreso
  { id: 'p1', category: 'Progreso', title: 'Nivel 5', description: 'Alcanza el nivel 5 de experiencia.', icon: 'stars', current: 3, target: 5, unit: 'lvl', isUnlocked: false, color: 'text-purple-400' },
  { id: 'p2', category: 'Progreso', title: 'Semana Perfecta', description: 'Completa todos los entrenamientos de la semana.', icon: 'calendar_today', current: 4, target: 7, unit: 'días', isUnlocked: false, color: 'text-purple-400' },
  { id: 'p3', category: 'Progreso', title: 'Rutina al 100%', description: 'Finaliza un programa completo.', icon: 'check_circle', current: 1, target: 1, isUnlocked: true, color: 'text-purple-400' },

  // Tiempo
  { id: 't1', category: 'Tiempo', title: '15 Minutos', description: 'Entrena por 15 minutos.', icon: 'timer', current: 15, target: 15, unit: 'min', isUnlocked: true, color: 'text-blue-400' },
  { id: 't2', category: 'Tiempo', title: '10 Horas Acumuladas', description: 'Tiempo total invertido en salud.', icon: 'hourglass_bottom', current: 6.5, target: 10, unit: 'hrs', isUnlocked: false, color: 'text-blue-400' },

  // Gamified
  { id: 'g1', category: 'Gamified', title: 'Lunes Guerrero', description: 'Entrenaste un lunes (nadie quiere 😅).', icon: 'local_fire_department', current: 1, target: 1, isUnlocked: true, color: 'text-orange-500' },
  { id: 'g2', category: 'Gamified', title: 'Imparable', description: 'Entrenaste 7 días seguidos.', icon: 'bolt', current: 5, target: 7, isUnlocked: false, color: 'text-orange-500' },
  { id: 'g3', category: 'Gamified', title: 'Comeback Kid', description: 'Volviste después de 7 días inactivo.', icon: 'replay', current: 0, target: 1, isUnlocked: false, color: 'text-slate-500' },
];