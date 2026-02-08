import React, { useState } from 'react';
import { UserProfile } from '../types';
import { geminiService } from '../services/geminiService';

interface OnboardingViewProps {
    onComplete: (profile: UserProfile, plan: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [aiPlan, setAiPlan] = useState('');
    
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        goal: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        daysPerWeek: 3
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const updateProfile = (key: keyof UserProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleFinish = async () => {
        if (!profile.name) return; // Basic validation
        setIsLoading(true);
        try {
            const plan = await geminiService.generateInitialPlan(profile);
            setAiPlan(plan);
        } catch (e) {
            console.error(e);
            setAiPlan("Hubo un error generando tu plan. Pero no te preocupes, ¡empecemos!");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Steps Rendering ---

    const renderStep1 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-bold text-white text-center">¿Cuál es tu objetivo principal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                    { id: 'Fuerza', icon: 'fitness_center', label: 'Fuerza Pura', desc: 'Levantar más pesado' },
                    { id: 'Hipertrofia', icon: 'accessibility_new', label: 'Hipertrofia', desc: 'Ganar masa muscular' },
                    { id: 'Pérdida de peso', icon: 'local_fire_department', label: 'Pérdida de Peso', desc: 'Quemar grasa y definir' }
                ].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => { updateProfile('goal', option.id); handleNext(); }}
                        className={`
                            p-6 rounded-2xl border text-left transition-all hover:scale-105 group
                            ${profile.goal === option.id 
                                ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(19,236,146,0.2)]' 
                                : 'bg-surface-dark border-white/10 hover:border-white/30 hover:bg-surface-darker'}
                        `}
                    >
                        <div className={`p-3 rounded-full w-fit mb-4 ${profile.goal === option.id ? 'bg-primary text-surface-darker' : 'bg-white/10 text-white group-hover:bg-primary group-hover:text-surface-darker'}`}>
                            <span className="material-symbols-outlined text-2xl">{option.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{option.label}</h3>
                        <p className="text-sm text-slate-400">{option.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500 max-w-lg mx-auto w-full">
            <h2 className="text-3xl font-bold text-white text-center">Cuéntanos sobre ti</h2>
            
            <div className="grid grid-cols-2 gap-4">
                {['Hombre', 'Mujer', 'Otro'].map(g => (
                    <button
                        key={g}
                        onClick={() => updateProfile('gender', g)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-colors ${profile.gender === g ? 'bg-primary text-surface-darker border-primary' : 'bg-surface-dark border-white/10 text-slate-400 hover:text-white'}`}
                    >
                        {g}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Edad</label>
                    <input 
                        type="number" 
                        value={profile.age}
                        onChange={(e) => updateProfile('age', e.target.value)}
                        className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50"
                        placeholder="25"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Altura (cm)</label>
                    <input 
                        type="number" 
                        value={profile.height}
                        onChange={(e) => updateProfile('height', e.target.value)}
                        className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50"
                        placeholder="175"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Peso Actual (kg)</label>
                <input 
                    type="number" 
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', e.target.value)}
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50"
                    placeholder="70"
                />
            </div>

            <div className="flex gap-4 mt-4">
                <button onClick={handleBack} className="flex-1 py-4 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Atrás</button>
                <button 
                    onClick={handleNext}
                    disabled={!profile.age || !profile.height || !profile.weight || !profile.gender}
                    className="flex-1 py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-xl mx-auto w-full">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Frecuencia Semanal</h2>
                <p className="text-slate-400">¿Cuántos días a la semana planeas entrenar?</p>
            </div>

            <div className="bg-surface-dark p-8 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-4xl font-bold text-primary">{profile.daysPerWeek}</span>
                    <span className="text-xl text-slate-500 font-medium">Días / Semana</span>
                </div>
                
                <input 
                    type="range" 
                    min="2" 
                    max="6" 
                    step="1"
                    value={profile.daysPerWeek}
                    onChange={(e) => updateProfile('daysPerWeek', parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-darker rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="flex justify-between text-xs text-slate-500 mt-4 font-bold uppercase">
                    <span>2 Días</span>
                    <span>4 Días</span>
                    <span>6 Días</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Atrás</button>
                <button onClick={handleNext} className="flex-1 py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold transition-all">Siguiente</button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500 max-w-lg mx-auto w-full">
            <h2 className="text-3xl font-bold text-white text-center">Último paso, ¿cómo te llamas?</h2>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre o Apodo</label>
                <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-primary/50 text-center"
                    placeholder="Tu nombre aquí..."
                />
            </div>

            <button 
                onClick={handleFinish}
                disabled={!profile.name}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold text-lg transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_30px_rgba(19,236,146,0.5)]"
            >
                Finalizar Configuración
            </button>
            
            <button onClick={handleBack} className="w-full py-2 text-slate-500 hover:text-white transition-colors text-sm">Atrás</button>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 text-center max-w-md mx-auto">
            <div className="relative size-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-surface-darker"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-primary animate-pulse">smart_toy</span>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analizando perfil...</h2>
            <p className="text-slate-400">La IA está diseñando tu estructura de entrenamiento basada en {profile.goal} para {profile.daysPerWeek} días.</p>
        </div>
    );

    const renderSummary = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-3xl mx-auto h-full">
            <header className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Perfil Completado</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">¡Todo listo, {profile.name}!</h2>
                <p className="text-slate-400">Aquí tienes tu plan inicial generado por IA.</p>
            </header>

            <div className="flex-1 bg-surface-dark rounded-2xl p-8 border border-white/5 shadow-2xl overflow-y-auto custom-scrollbar relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-primary max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                        {aiPlan}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => onComplete(profile, aiPlan)}
                className="w-full py-5 rounded-xl bg-primary hover:bg-primary-hover text-surface-darker font-bold text-xl transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_30px_rgba(19,236,146,0.5)] flex items-center justify-center gap-3"
            >
                <span>Entrar a la App</span>
                <span className="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>
    );

    return (
        <div className="h-screen w-full bg-background-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-surface-darker z-50">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: aiPlan ? '100%' : `${(step / 4) * 100}%` }}
                ></div>
            </div>
            <div className="absolute -left-20 top-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -right-20 bottom-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex justify-center h-full flex-col">
                {isLoading ? renderLoading() : 
                 aiPlan ? renderSummary() : 
                 (
                    <>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </>
                 )
                }
            </div>
        </div>
    );
};