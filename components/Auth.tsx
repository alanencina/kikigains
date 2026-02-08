
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Registro exitoso! Por favor revisa tu email para confirmar.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-4">
            <div className="w-full max-w-md bg-surface-dark rounded-2xl p-8 shadow-2xl border border-white/5">
                <div className="flex justify-center mb-8">
                    <span className="material-symbols-outlined text-5xl text-primary">fitness_center</span>
                </div>

                <h2 className="text-3xl font-display font-bold text-white text-center mb-2">
                    {isSignUp ? 'Crear Cuenta' : 'Bienvenido a KikiGains'}
                </h2>
                <p className="text-slate-400 text-center mb-8">
                    {isSignUp ? 'Únete y empieza tu transformación' : 'Ingresa para continuar tu entrenamiento'}
                </p>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-surface-darker font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            isSignUp ? 'Registrarse' : 'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-medium"
                    >
                        {isSignUp ? 'Inicia Sesión' : 'Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
};
