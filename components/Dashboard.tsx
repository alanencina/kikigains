import React from 'react';
import { READINESS_METRICS, COMMUNITY_FEED, WORKOUT_BG } from '../constants';
import { UserProfile } from '../types';

interface DashboardProps {
    userProfile: UserProfile | null;
    initialPlan: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userProfile, initialPlan }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 py-2">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                    Buenos Días, {userProfile?.name || 'Atleta'}
                </h2>
                <p className="text-slate-400 flex items-center gap-2 capitalize">
                    <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button className="size-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors relative">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-pulse"></span>
                </button>
                <button className="h-10 px-4 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors text-sm font-medium">
                    Ver Calendario
                </button>
            </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            
            {/* Daily Readiness (Span 8) */}
            <div className="md:col-span-8 bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-medium text-white mb-1">Disposición Diaria</h3>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary text-sm font-medium">Sincronización en Vivo</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                        <span className="text-xs text-white font-medium">Análisis IA</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    {/* Big Score Circle */}
                    <div className="relative size-40 shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-surface-darker stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                            <circle 
                                className="text-primary stroke-current transition-all duration-1000 ease-out" 
                                cx="50" cy="50" fill="transparent" r="40" 
                                strokeDasharray="251.2" 
                                strokeDashoffset="20" 
                                strokeLinecap="round" 
                                strokeWidth="8">
                            </circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white tracking-tighter">92<span className="text-lg text-primary">%</span></span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Puntuación</span>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {READINESS_METRICS.map((metric, idx) => (
                            <div key={idx} className="bg-surface-darker p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                    <span className="material-symbols-outlined text-lg">{metric.icon}</span>
                                    <span className="text-xs font-bold uppercase">{metric.label}</span>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {typeof metric.value === 'number' ? metric.value : metric.value.split(' ')[0]}
                                    <span className="text-sm font-normal text-slate-500 ml-1">
                                        {typeof metric.value === 'string' && metric.value.includes(' ') ? metric.value.substring(metric.value.indexOf(' ')) : metric.unit}
                                    </span>
                                </p>
                                <p className={`text-xs mt-1 ${metric.status === 'Óptimo' ? 'text-primary' : metric.trend?.includes('-') ? 'text-emerald-400' : 'text-primary'}`}>
                                    {metric.status || metric.trend}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight Box */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex items-start gap-4 relative z-10">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1">Enfoque: {userProfile?.goal || 'Fitness General'}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Basado en tu perfil, prioriza la consistencia esta semana. La IA sugiere mantener un volumen estable para tu rutina de {userProfile?.daysPerWeek || 3} días.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Start / Today's Workout (Span 4) */}
            <div className="md:col-span-4 flex flex-col gap-6">
                <div className="flex-1 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col relative overflow-hidden group">
                    <div 
                        className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${WORKOUT_BG}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/80 to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-white">Sesión de Hoy</h3>
                            <span className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white border border-white/5">65 min</span>
                        </div>
                        <div className="mt-auto">
                            <h2 className="text-3xl font-bold text-white leading-tight mb-2">Tren Inferior<br/><span className="text-primary">Fuerza & VBT</span></h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-surface-darker text-slate-400 border border-white/5">Sentadilla 5x3 @ 85%</span>
                                <span className="text-xs font-medium px-2 py-1 rounded bg-surface-darker text-slate-400 border border-white/5">P. Muerto Rumano 4x8</span>
                            </div>
                            <button className="w-full py-4 rounded-xl bg-primary hover:bg-emerald-400 text-surface-darker font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_30px_rgba(19,236,146,0.5)]">
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_arrow</span>
                                Iniciar Entreno
                            </button>
                        </div>
                    </div>
                </div>

                {/* Microcycle Progress */}
                <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Microciclo Actual</h3>
                        <span className="text-white font-bold">Semana 1<span className="text-slate-500 font-normal"> / 4</span></span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">Fase de Inicio</h4>
                    <div className="w-full h-2 bg-surface-darker rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary w-1/4 rounded-full shadow-[0_0_10px_rgba(19,236,146,0.5)]"></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">Progreso de Fase: 25%</p>
                </div>
            </div>

            {/* Initial Plan Display (Span 8) - Replacing the Chart */}
            <div className="md:col-span-8 bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg flex flex-col min-h-[400px]">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-white/5 pb-4">
                    <div>
                        <h3 className="text-xl font-medium text-white mb-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">strategy</span>
                            Tu Estrategia Personal
                        </h3>
                        <p className="text-sm text-slate-400">Generado según tus objetivos y biometría</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                            {userProfile?.goal}
                        </span>
                        <span className="px-3 py-1 bg-white/5 text-white text-xs font-bold rounded-full border border-white/10">
                            {userProfile?.daysPerWeek} Días/Semana
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {initialPlan ? (
                         <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-primary max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {initialPlan}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                             <span className="material-symbols-outlined text-4xl mb-2">article</span>
                             <p>No hay datos del plan disponibles.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Activity / Kudos (Span 4) */}
            <div className="md:col-span-4 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-medium text-white">Comunidad</h3>
                    <button className="text-xs text-primary hover:text-white transition-colors font-medium">Ver Todo</button>
                </div>
                
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                    {COMMUNITY_FEED.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div className="flex gap-3 items-start group">
                                <div 
                                    className="size-10 rounded-full bg-slate-700 bg-cover bg-center shrink-0 border border-white/10" 
                                    style={{ backgroundImage: `url('${item.userAvatar}')` }}
                                ></div>
                                <div className="flex-1">
                                    <p className="text-sm text-white">
                                        <span className="font-bold">{item.user}</span> {item.action} <span className={`font-medium ${item.highlight.includes('Sleep') ? 'text-accent-blue' : item.highlight.includes('Mobility') ? 'text-white/80' : 'text-primary'}`}>{item.highlight}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{item.time} • {item.kudos} Kudos</p>
                                </div>
                                <button className="text-slate-500 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                                </button>
                            </div>
                            {index < COMMUNITY_FEED.length - 1 && <div className="h-px bg-white/5 w-full"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};