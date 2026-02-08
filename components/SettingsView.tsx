import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
    userProfile: UserProfile | null;
    onUpdateProfile: (profile: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onUpdateProfile }) => {
    // Local state to manage form edits before saving
    const [formData, setFormData] = useState<UserProfile>({
        name: '',
        goal: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        daysPerWeek: 3
    });

    const [isSaved, setIsSaved] = useState(false);

    // Load initial data
    useEffect(() => {
        if (userProfile) {
            setFormData(userProfile);
        }
    }, [userProfile]);

    const handleChange = (key: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setIsSaved(false);
    };

    const handleSave = () => {
        onUpdateProfile(formData);
        setIsSaved(true);
        // Reset saved message after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto">
            
            {/* Header */}
            <header className="flex justify-between items-end gap-6 bg-surface-dark rounded-2xl p-8 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-4xl">settings</span>
                        Configuración
                    </h2>
                    <p className="text-slate-400">Actualiza tu perfil y preferencias de entrenamiento.</p>
                </div>
            </header>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Section: Identity */}
                <section className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        <h3 className="text-lg font-bold text-white">Identidad</h3>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre de Usuario</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Género</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Hombre', 'Mujer', 'Otro'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => handleChange('gender', g)}
                                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                                        formData.gender === g 
                                        ? 'bg-primary/20 text-primary border-primary' 
                                        : 'bg-surface-darker border-white/5 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section: Metrics */}
                <section className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <span className="material-symbols-outlined text-primary">straighten</span>
                        <h3 className="text-lg font-bold text-white">Métricas Corporales</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Edad</label>
                            <input 
                                type="number" 
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Altura (cm)</label>
                            <input 
                                type="number" 
                                value={formData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Peso (kg)</label>
                        <input 
                            type="number" 
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </section>

                {/* Section: Training Goals (Full Width) */}
                <section className="md:col-span-2 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-6">
                     <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
                        <span className="material-symbols-outlined text-primary">flag</span>
                        <h3 className="text-lg font-bold text-white">Objetivo & Frecuencia</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'Fuerza', icon: 'fitness_center' },
                            { id: 'Hipertrofia', icon: 'accessibility_new' },
                            { id: 'Pérdida de peso', icon: 'local_fire_department' }
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleChange('goal', option.id)}
                                className={`
                                    flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                                    ${formData.goal === option.id 
                                        ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(19,236,146,0.1)]' 
                                        : 'bg-surface-darker border-white/5 text-slate-400 hover:border-white/20'}
                                `}
                            >
                                <span className={`material-symbols-outlined ${formData.goal === option.id ? 'text-primary' : 'text-slate-500'}`}>
                                    {option.icon}
                                </span>
                                <span className="font-bold">{option.id}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center">
                             <label className="text-sm font-bold text-slate-400">Días de entrenamiento por semana</label>
                             <span className="text-2xl font-bold text-primary">{formData.daysPerWeek}</span>
                        </div>
                        <input 
                            type="range" 
                            min="2" 
                            max="6" 
                            step="1"
                            value={formData.daysPerWeek}
                            onChange={(e) => handleChange('daysPerWeek', parseInt(e.target.value))}
                            className="w-full h-2 bg-surface-darker rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-slate-600 font-bold uppercase">
                            <span>2 Días</span>
                            <span>4 Días</span>
                            <span>6 Días</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-4 bg-surface-darker/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex justify-end gap-4 items-center">
                 {isSaved && (
                    <span className="text-primary font-bold animate-in fade-in slide-in-from-right-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Guardado correctamente
                    </span>
                 )}
                 <button 
                    onClick={handleSave}
                    className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold text-lg transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_30px_rgba(19,236,146,0.5)] flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};