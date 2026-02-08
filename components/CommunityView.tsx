import React, { useState } from 'react';
import { COMMUNITY_FEED, PROFILE_IMAGE } from '../constants';
import { geminiService } from '../services/geminiService';

const LEADERBOARD = [
    { rank: 1, name: 'KikiGains', points: 2450, change: 'up', avatar: PROFILE_IMAGE },
    { rank: 2, name: 'Sarah L.', points: 2310, change: 'same', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqiu0rB0YiV_JcXD0GF-MJkX6LPMNpkQHZnahS9B_UI9OY5jR-VK68I06xfcIjpP8-kevWHyV8iESBGlYIWwp1gOAIv2sL5VHOu831U7vvPP3zZx8itc3zR31g8mRppx7t63a54H9ABtqnMcIq6m_U46RmkPUxT4c7P9WPsaAPdhkznZHHRArXGl9vL9XGgpWiiDs3XGTS7SHJATX7ffqpyNbA0-RGfymtbleimeXL4QG33EsJG2k4Au_V4Xt_ZEv_8uKd1gyPg' },
    { rank: 3, name: 'Mike T.', points: 2100, change: 'down', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJTIA1aSMu6cjil0xIgTI2Ov_84nEiJUrvrl1aRCtb1cCq4iu-S9vPPcJdSg7EyL7rcoj_dsM_Ge7X2QRkszxZxZI_yMpNk7dbKV1HhmXlT4IQ0G3kawNHvfUx1sVqXc4sUDkKM1-xmNrMU8xhQ7uxopPTGdjJKOjowqchZfZhruGW4m4xN5vBg7IeSfck54jaR67Ct8RIum9OlGN-uBX8h2gmbV2BaHxtSxLPCzyeEdSAEucThWYImxkHDw2hgv6KeRRnmXJyCA' },
    { rank: 4, name: 'Alex R.', points: 1950, change: 'up', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiA-10irdfiR-T8rQhsizAFvlrlHe7emz5su79DbJIp5O-bYeWF9kIj1gEnHOU5xZeDWFZYxRFfg7W_KS78S-OWBfvzDScaY8HbMFUbKpvYg6GT_uC-5gpKmpTp-eSe9GgT-9sjOY8fFT0e7faNvL8CxuxH0OkF8AjkyAdjI9DuVBdVunbKsPxsDb5N5wDgfBuKcmp9U9Ji2wChpaVN7smpo62rEzd19RGRY8452kEtr6KCnrbYYjEaSl_J84yi1sV3Lclc7TXZw' },
];

export const CommunityView: React.FC = () => {
    const [challengeTheme, setChallengeTheme] = useState('');
    const [generatedChallenge, setGeneratedChallenge] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreateChallenge = async () => {
        if (!challengeTheme.trim()) return;
        setIsGenerating(true);
        setGeneratedChallenge('');
        try {
            const result = await geminiService.generateChallenge(challengeTheme);
            setGeneratedChallenge(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
                <div>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Centro del Equipo</h2>
                    <p className="text-slate-400">Conecta con tu equipo y compite en retos generados por IA.</p>
                </div>
                <div className="flex -space-x-3">
                    {LEADERBOARD.map((user, i) => (
                        <div key={i} className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                    ))}
                    <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-surface-dark flex items-center justify-center text-xs font-bold text-white">
                        +42
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
                {/* Left: Feed (Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    {/* Create Post Input */}
                    <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex gap-4">
                            <div className="size-12 rounded-full bg-cover bg-center border border-white/10 shrink-0" style={{ backgroundImage: `url('${PROFILE_IMAGE}')` }}></div>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Comparte tu último PR o entrenamiento..." 
                                    className="w-full bg-surface-darker border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-all mb-3"
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">image</span>
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">gif_box</span>
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                                        </button>
                                    </div>
                                    <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-surface-darker font-bold rounded-lg transition-colors text-sm">
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed Items */}
                    {COMMUNITY_FEED.map((post) => (
                        <div key={post.id} className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3 items-center">
                                    <div className="size-10 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: `url('${post.userAvatar}')` }}></div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{post.user}</p>
                                        <p className="text-slate-500 text-xs">{post.time}</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            
                            <p className="text-slate-200 mb-4 leading-relaxed">
                                {post.action} <span className="text-primary font-medium">{post.highlight}</span>. 
                                ¡Me sentí súper fuerte hoy! 🚀
                            </p>

                            {/* Mock reaction bar */}
                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group/btn">
                                    <span className="material-symbols-outlined text-[20px] group-hover/btn:scale-110 transition-transform">thumb_up</span>
                                    <span className="text-sm font-medium">{post.kudos}</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                    <span className="text-sm font-medium">Comentar</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors ml-auto">
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Sidebar (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
                    
                    {/* Leaderboard Card */}
                    <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Tabla de Clasificación</h3>
                            <select className="bg-surface-darker text-xs text-slate-400 border border-white/10 rounded-lg px-2 py-1 outline-none">
                                <option>Semanal</option>
                                <option>Histórico</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-3">
                            {LEADERBOARD.map((user, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface-darker/50 border border-white/5 hover:border-white/10 transition-colors">
                                    <span className={`
                                        size-6 flex items-center justify-center text-xs font-bold rounded-full 
                                        ${idx === 0 ? 'bg-yellow-500 text-yellow-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-orange-400 text-orange-950' : 'bg-surface-dark text-slate-500'}
                                    `}>
                                        {user.rank}
                                    </span>
                                    <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{user.points}</p>
                                        <p className="text-[10px] text-slate-500">{user.points} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Challenge Generator */}
                    <div className="bg-gradient-to-b from-surface-dark to-surface-darker rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col flex-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <span className="material-symbols-outlined">diversity_3</span>
                                </span>
                                <h3 className="text-lg font-bold text-white">Generador de Retos</h3>
                            </div>
                            
                            {!generatedChallenge ? (
                                <>
                                    <p className="text-sm text-slate-400 mb-4">¿Necesitas animar el chat? Pídele a la IA un reto personalizado.</p>
                                    <div className="mt-auto">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tema / Vibe</label>
                                        <input 
                                            type="text" 
                                            value={challengeTheme}
                                            onChange={(e) => setChallengeTheme(e.target.value)}
                                            placeholder="ej: 'Destructor de abdomen' o 'Locura de movilidad'" 
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all mb-3"
                                        />
                                        <button 
                                            onClick={handleCreateChallenge}
                                            disabled={isGenerating || !challengeTheme.trim()}
                                            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isGenerating ? (
                                                <span className="size-4 border-2 border-surface-darker border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                    Crear Reto
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="prose prose-invert prose-sm prose-p:text-slate-300 prose-headings:text-white max-w-none">
                                            <div className="whitespace-pre-wrap">{generatedChallenge}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setGeneratedChallenge('')}
                                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10"
                                    >
                                        Crear Otro
                                    </button>
                                    <button className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold text-sm transition-all">
                                        Publicar en Feed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};