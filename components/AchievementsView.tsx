import React from 'react';
import { ACHIEVEMENTS_DATA } from '../constants';
import { Achievement } from '../types';

export const AchievementsView: React.FC = () => {
  // Group achievements by category
  const categories = ['Fuerza', 'Progreso', 'Tiempo', 'Gamified'];
  
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
        case 'Fuerza': return 'fitness_center';
        case 'Progreso': return 'trending_up';
        case 'Tiempo': return 'timer';
        case 'Gamified': return 'military_tech';
        default: return 'star';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case 'Fuerza': return 'text-emerald-400';
        case 'Progreso': return 'text-purple-400';
        case 'Tiempo': return 'text-blue-400';
        case 'Gamified': return 'text-orange-400';
        default: return 'text-white';
    }
  };

  // Calculate total progress for header
  const totalUnlocked = ACHIEVEMENTS_DATA.filter(a => a.isUnlocked).length;
  const totalAchievements = ACHIEVEMENTS_DATA.length;
  const percentage = Math.round((totalUnlocked / totalAchievements) * 100);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Stats */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 bg-surface-dark rounded-2xl p-8 border border-white/5 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
         
         <div className="relative z-10 w-full md:w-auto">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-400 text-4xl">emoji_events</span>
                Logros
            </h2>
            <p className="text-slate-400">Desbloquea medallas y rastrea tu evolución.</p>
         </div>

         <div className="flex flex-col items-end gap-2 relative z-10 w-full md:w-auto">
            <div className="text-right">
                <span className="text-3xl font-bold text-white">{totalUnlocked}</span>
                <span className="text-slate-500 text-lg"> / {totalAchievements}</span>
            </div>
            <div className="w-full md:w-64 h-3 bg-surface-darker rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">{percentage}% Completado</span>
         </div>
      </header>

      {/* Categories Grid */}
      <div className="flex flex-col gap-10">
        {categories.map((category) => (
            <section key={category}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${getCategoryColor(category)}`}>
                        <span className="material-symbols-outlined">{getCategoryIcon(category)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ACHIEVEMENTS_DATA.filter(a => a.category === category).map((achievement) => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </div>
            </section>
        ))}
      </div>
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const percent = Math.min(100, Math.round((achievement.current / achievement.target) * 100));
    
    return (
        <div className={`
            relative p-5 rounded-2xl border transition-all duration-300 group overflow-hidden
            ${achievement.isUnlocked 
                ? 'bg-surface-dark border-white/10 shadow-lg hover:border-primary/30 hover:-translate-y-1' 
                : 'bg-surface-dark/50 border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}
        `}>
            {/* Background Glow for unlocked */}
            {achievement.isUnlocked && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`
                        size-12 rounded-xl flex items-center justify-center text-2xl border
                        ${achievement.isUnlocked 
                            ? `bg-surface-darker border-white/10 ${achievement.color} shadow-inner` 
                            : 'bg-surface-darker border-white/5 text-slate-600'}
                    `}>
                        <span className="material-symbols-outlined">{achievement.icon}</span>
                    </div>
                    {achievement.isUnlocked && (
                        <span className="material-symbols-outlined text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">workspace_premium</span>
                    )}
                </div>

                <h4 className={`font-bold text-lg mb-1 ${achievement.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {achievement.title}
                </h4>
                <p className="text-sm text-slate-500 mb-4 h-10 leading-tight">
                    {achievement.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className={achievement.isUnlocked ? 'text-primary' : 'text-slate-600'}>
                            {percent === 100 ? 'Completado' : 'En Progreso'}
                        </span>
                        <span className="text-slate-400">
                            {achievement.current} / {achievement.target} {achievement.unit}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-surface-darker rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${achievement.isUnlocked ? 'bg-primary shadow-[0_0_10px_rgba(19,236,146,0.4)]' : 'bg-slate-600'}`}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};