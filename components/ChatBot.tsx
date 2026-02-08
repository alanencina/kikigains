import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatBotProps {
    userName?: string;
    variant?: 'full' | 'widget';
    onClose?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ userName = 'Atleta', variant = 'full', onClose }) => {
  // Initialize with empty array, populate in useEffect to handle userName prop
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
        setMessages([
            { 
                id: '1', 
                role: 'model', 
                text: `¡Hola ${userName}! Soy tu entrenador de rendimiento IA. ¿Cómo te sientes hoy?` 
            }
        ]);
        hasInitialized.current = true;
    }
  }, [userName]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal history to Gemini format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await geminiService.sendMessage(userMsg.text, history);
      
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "Lo siento, tengo problemas conectando con el enlace neural. Inténtalo de nuevo." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isWidget = variant === 'widget';
  const paddingClass = isWidget ? 'p-4' : 'p-6';

  return (
    <div className={`h-full flex flex-col bg-surface-dark rounded-2xl border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 ${isWidget ? 'text-sm' : ''}`}>
      <div className={`${paddingClass} border-b border-white/5 bg-surface-darker/50 backdrop-blur-md flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
            <div className={`${isWidget ? 'size-8' : 'size-10'} rounded-full bg-primary/20 flex items-center justify-center text-primary`}>
                <span className="material-symbols-outlined text-lg">smart_toy</span>
            </div>
            <div>
                <h2 className={`${isWidget ? 'text-base' : 'text-xl'} font-bold text-white`}>Entrenador IA</h2>
                <div className="flex items-center gap-2">
                    <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-400">En línea</span>
                </div>
            </div>
        </div>
        {isWidget && onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
            </button>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto ${paddingClass} space-y-4 custom-scrollbar`} ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-3 leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-primary text-surface-darker font-medium rounded-tr-none' 
                : 'bg-surface-darker border border-white/5 text-slate-200 rounded-tl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-surface-darker border border-white/5 text-slate-200 rounded-2xl rounded-tl-none p-4 flex gap-2">
                <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-surface-darker/50 border-t border-white/5">
        <div className="relative flex items-center">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre entrenamiento..."
                className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-surface-darker transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-xl">send</span>
            </button>
        </div>
      </div>
    </div>
  );
};