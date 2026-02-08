import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';

enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}

export const MediaAnalyzer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MediaType>(MediaType.IMAGE);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [prompt, setPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        setResult('');
        setPrompt('');

        // Basic validation
        if (activeTab === MediaType.IMAGE && !file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen.');
            return;
        }
        if (activeTab === MediaType.VIDEO && !file.type.startsWith('video/')) {
            alert('Por favor selecciona un video.');
            return;
        }
        
        // Size warning for video (client-side limit simulation)
        if (activeTab === MediaType.VIDEO && file.size > 20 * 1024 * 1024) {
            alert('Para esta demo, por favor usa videos cortos de menos de 20MB.');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        
        // Default prompts
        if (activeTab === MediaType.IMAGE) {
            setPrompt("Analiza la forma de esta sentadilla. Revisa la profundidad, ángulo de espalda y posición de rodillas.");
        } else {
            setPrompt("Analiza este levantamiento. ¿Cómo es el tempo? ¿Hay algún fallo en la fase concéntrica?");
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:image/jpeg;base64, prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!selectedFile || !prompt) return;

        setIsAnalyzing(true);
        setResult('');
        try {
            const base64 = await convertFileToBase64(selectedFile);
            
            let responseText = '';
            if (activeTab === MediaType.IMAGE) {
                responseText = await geminiService.analyzeImage(base64, selectedFile.type, prompt);
            } else {
                responseText = await geminiService.analyzeVideo(base64, selectedFile.type, prompt);
            }
            setResult(responseText);
        } catch (error) {
            console.error(error);
            setResult("Error analizando medio. Intenta de nuevo con un archivo más pequeño o formato diferente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white">Laboratorio de Análisis</h2>
                <p className="text-slate-400">Sube grabaciones de tu entrenamiento para recibir feedback biomecánico por IA.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
                {/* Left: Input Area */}
                <div className="flex flex-col gap-6 bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg h-fit">
                    {/* Tabs */}
                    <div className="flex p-1 bg-surface-darker rounded-xl border border-white/5">
                        <button 
                            onClick={() => { setActiveTab(MediaType.IMAGE); setSelectedFile(null); setPreviewUrl(null); setResult(''); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === MediaType.IMAGE ? 'bg-primary text-surface-darker shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">image</span> Análisis Imagen
                            </span>
                        </button>
                        <button 
                            onClick={() => { setActiveTab(MediaType.VIDEO); setSelectedFile(null); setPreviewUrl(null); setResult(''); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === MediaType.VIDEO ? 'bg-primary text-surface-darker shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">videocam</span> Análisis Video
                            </span>
                        </button>
                    </div>

                    {/* Dropzone / Preview */}
                    <div 
                        onClick={!previewUrl ? triggerFileSelect : undefined}
                        className={`
                            relative aspect-video rounded-xl border-2 border-dashed border-white/10 bg-surface-darker/50 
                            flex flex-col items-center justify-center overflow-hidden transition-colors
                            ${!previewUrl ? 'cursor-pointer hover:border-primary/50 hover:bg-surface-darker' : ''}
                        `}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept={activeTab === MediaType.IMAGE ? "image/*" : "video/*"}
                            onChange={handleFileChange}
                        />

                        {previewUrl ? (
                            <>
                                {activeTab === MediaType.IMAGE ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                                )}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); setResult(''); }}
                                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">cloud_upload</span>
                                <p className="text-slate-300 font-medium">Click para subir {activeTab === MediaType.IMAGE ? 'imagen' : 'video'}</p>
                                <p className="text-slate-500 text-xs mt-1">
                                    {activeTab === MediaType.VIDEO ? 'MP4, WebM (Max 20MB)' : 'JPG, PNG, WEBP'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-slate-400">Instrucción para el Análisis</label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 h-24 resize-none"
                            placeholder="¿Qué debe buscar la IA?"
                        ></textarea>
                        
                        <button 
                            onClick={handleAnalyze}
                            disabled={!selectedFile || isAnalyzing || !prompt}
                            className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-surface-darker font-bold text-lg transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="size-5 border-2 border-surface-darker border-t-transparent rounded-full animate-spin"></span>
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    Analizar
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Results Area */}
                <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-lg h-fit min-h-[500px]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        Resultados
                    </h3>
                    
                    {result ? (
                        <div className="bg-surface-darker rounded-xl p-6 border border-white/5">
                             <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed">{result}</p>
                             </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-4">science</span>
                            <p>Los resultados aparecerán aquí</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};