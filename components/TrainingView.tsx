import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';


const WEEKLY_SCHEDULE = [
    { day: 'Lun', title: 'Fuerza Tren Inferior', status: 'Completed', type: 'fuerza' },
    { day: 'Mar', title: 'Hipertrofia Tren Superior', status: 'Completed', type: 'hipertrofia' },
    { day: 'Mié', title: 'Cardio Zona 2 & Movilidad', status: 'Active', type: 'recuperación' },
    { day: 'Jue', title: 'Esfuerzo Dinámico Inferior', status: 'Upcoming', type: 'potencia' },
    { day: 'Vie', title: 'Fuerza Tren Superior', status: 'Upcoming', type: 'fuerza' },
    { day: 'Sáb', title: 'Condicionamiento Strongman', status: 'Upcoming', type: 'condicionamiento' },
    { day: 'Dom', title: 'Día de Descanso', status: 'Upcoming', type: 'descanso' },
];

export const TrainingView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

    // AI State
    const [goal, setGoal] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Manual State
    const [customRoutine, setCustomRoutine] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load initial custom routine (Supabase or LocalStorage)
    useEffect(() => {
        const loadRoutine = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('routines')
                    .select('exercises, name, description')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data && data.name) {
                    setCustomRoutine(data.name); // Using 'name' field as the text content for now based on the schema I designed, but wait.
                    // My schema has 'name', 'description', 'exercises' (jsonb).
                    // The text area uses 'customRoutine' string.
                    // I should probably map the text content to 'description' or 'exercises' text if it's just a markdown string.
                    // The existing code treats customRoutine as a markdown string.
                    // Let's assume we store the markdown content in 'description' or a specific field.
                    // I'll update the schema or code to match.
                    // For now, let's treat 'description' as the routine text content.
                    if (data.description) setCustomRoutine(data.description);
                }
            } else {
                const saved = localStorage.getItem('kikigains_custom_routine');
                if (saved) setCustomRoutine(saved);
            }
        };
        loadRoutine();
    }, [user]);

    const handleGenerate = async () => {
        if (!goal.trim()) return;
        setIsLoading(true);
        setGeneratedPlan('');
        try {
            const result = await geminiService.generateTrainingPlan(goal);
            setGeneratedPlan(result);
        } catch (error) {
            console.error(error);
            setGeneratedPlan("Fallo al generar el plan. Por favor intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRoutine = async () => {
        setIsSaving(true);

        if (user) {
            // Save to Supabase
            try {
                // Check if routine exists (simple upsert based on user_id for now, or just insert new)
                // Ideally we'd have a routine ID. For this demo, let's just insert/update the latest one.

                const routineData = {
                    user_id: user.id,
                    name: 'Mi Rutina Personalizada', // Default name
                    description: customRoutine,
                    updated_at: new Date().toISOString()
                };

                // First check if we have one
                const { data: existing } = await supabase
                    .from('routines')
                    .select('id')
                    .eq('user_id', user.id)
                    .limit(1)
                    .single();

                if (existing) {
                    await supabase.from('routines').update(routineData).eq('id', existing.id);
                } else {
                    await supabase.from('routines').insert(routineData);
                }

                setLastSaved(new Date());

            } catch (error) {
                console.error('Error saving routine:', error);
            }
        } else {
            // Local fallback
            localStorage.setItem('kikigains_custom_routine', customRoutine);
            setLastSaved(new Date());
        }

        setIsSaving(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Laboratorio de Entrenamiento</h2>
                    <p className="text-slate-400">Gestiona tu microciclo y genera sesiones adaptativas.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-dark border border-white/10 text-xs font-bold text-primary flex items-center gap-2">
                        <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                        Bloque: Peaking
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-dark border border-white/10 text-xs font-bold text-slate-300">Semana 4/6</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">

                {/* Left Column: Schedule (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                    <h3 className="text-lg font-bold text-white sticky top-0 bg-background-light dark:bg-background-dark py-2 z-10">Calendario Actual</h3>
                    {WEEKLY_SCHEDULE.map((session, idx) => (
                        <div
                            key={idx}
                            className={`
                        p-4 rounded-xl border transition-all cursor-pointer group
                        ${session.status === 'Active'
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(19,236,146,0.1)]'
                                    : 'bg-surface-dark border-white/5 hover:border-white/10 hover:bg-white/5'}
                    `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wider ${session.status === 'Active' ? 'text-primary' : 'text-slate-500'}`}>
                                    {session.day}
                                </span>
                                {session.status === 'Completed' && <span className="material-symbols-outlined text-primary text-lg">check_circle</span>}
                                {session.status === 'Active' && <span className="size-2 bg-primary rounded-full animate-pulse"></span>}
                            </div>
                            <h4 className={`font-bold text-lg mb-1 ${session.status === 'Active' ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {session.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${session.type === 'fuerza' ? 'border-orange-500/30 text-orange-400' :
                                    session.type === 'potencia' ? 'border-red-500/30 text-red-400' :
                                        session.type === 'recuperación' ? 'border-blue-500/30 text-blue-400' :
                                            'border-slate-500/30 text-slate-400'
                                    }`}>
                                    {session.type.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Tools (Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">

                    {/* Tabs */}
                    <div className="flex p-1 bg-surface-dark rounded-xl border border-white/5 shrink-0">
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-primary text-surface-darker shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">smart_toy</span>
                            Diseñador IA
                        </button>
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-primary text-surface-darker shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">edit_note</span>
                            Mi Rutina (Manual)
                        </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === 'ai' ? (
                        <>
                            {/* AI Generator Card */}
                            <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg relative overflow-hidden shrink-0 animate-in fade-in slide-in-from-left-4">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined">smart_toy</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Motor de Sesiones Adaptativo</h3>
                                            <p className="text-xs text-slate-400">Impulsado por Gemini 3 Pro</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="text"
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                            placeholder="ej: 'Alto volumen de pecho enfocado en pectoral superior'"
                                            className="flex-1 bg-surface-darker border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                        />
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isLoading || !goal.trim()}
                                            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center shadow-lg shadow-primary/20"
                                        >
                                            {isLoading ? (
                                                <span className="size-5 border-2 border-surface-darker border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <span>Generar</span>
                                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* AI Result View */}
                            <div className="flex-1 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4">
                                {generatedPlan ? (
                                    <div>
                                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">fitness_center</span>
                                                Sesión Generada
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                    onClick={() => setGeneratedPlan('')}
                                                >
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-li:text-slate-300 max-w-none">
                                            <div className="whitespace-pre-wrap leading-relaxed">
                                                {generatedPlan}
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                                                Guardar en Calendario
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-40">
                                        <span className="material-symbols-outlined text-6xl mb-4">print_connect</span>
                                        <p className="font-medium">Introduce un objetivo arriba para generar una sesión personalizada</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Manual Editor Tab */
                        <div className="flex-1 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col h-full animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <span className="material-symbols-outlined">edit_note</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Mi Rutina Personalizada</h3>
                                        <p className="text-xs text-slate-400">
                                            {lastSaved ? `Guardado: ${lastSaved.toLocaleTimeString()}` : 'Escribe tu propio plan aquí'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveRoutine}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(19,236,146,0.2)] disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <span className="size-4 border-2 border-surface-darker border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">save</span>
                                    )}
                                    Guardar
                                </button>
                            </div>

                            <textarea
                                value={customRoutine}
                                onChange={(e) => setCustomRoutine(e.target.value)}
                                placeholder="# Mi Rutina de Hoy&#10;&#10;## Calentamiento&#10;- Movilidad articular&#10;- 5 min cinta&#10;&#10;## Bloque Principal&#10;1. Sentadilla 4x8&#10;2. Press Banca 4x10&#10;..."
                                className="flex-1 w-full bg-surface-darker border border-white/10 rounded-xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                            />

                            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                {/* Quick Insert Chips */}
                                {['# Título', '## Subtítulo', '- Lista', '[] Checkbox', '**Negrita**'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setCustomRoutine(prev => prev + (prev ? '\n' : '') + tag + ' ')}
                                        className="px-3 py-1.5 bg-surface-darker border border-white/10 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:border-white/30 transition-all whitespace-nowrap"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};