import React, { useState } from 'react';
import PromptForm from './components/PromptForm';
import ResultCard from './components/ResultCard';
import { PromptFormData, GeneratedResult } from './types';
import { generateOptimizedPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: PromptFormData) => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateOptimizedPrompt(data);
      setResult(generated);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Ocurrió un error inesperado. Por favor intenta de nuevo.";

      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes("clave api no configurada")) {
          errorMessage = "No se ha configurado la API Key en el entorno.";
        } else if (msg.includes("403") || msg.includes("invalid api key")) {
          errorMessage = "La API Key proporcionada es inválida o ha expirado.";
        } else if (msg.includes("429") || msg.includes("quota")) {
          errorMessage = "Has excedido el límite de solicitudes. Por favor espera un momento.";
        } else if (msg.includes("503") || msg.includes("overloaded")) {
          errorMessage = "El servicio de Gemini está saturado. Intenta de nuevo en unos segundos.";
        } else if (msg.includes("fetch failed") || msg.includes("network")) {
          errorMessage = "Error de conexión. Verifica tu internet y si tienes acceso a la API.";
        } else if (msg.includes("safety") || msg.includes("blocked")) {
          errorMessage = "La solicitud fue bloqueada por los filtros de seguridad de contenido.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              GrokPrompt <span className="text-neutral-500 font-normal">Master</span>
            </h1>
          </div>
          <div className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Diseñador de Video</h2>
              <p className="text-neutral-400 text-sm">
                Define los parámetros de tu video. Nuestra IA reescribirá tu idea usando 
                técnicas avanzadas de ingeniería de prompts (temporal consistency, physics descriptives) 
                para obtener los mejores resultados en Grok Imagine.
              </p>
            </div>
            <PromptForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>

          {/* Right Column: Result or Placeholder */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold block mb-1">Error</span>
                    {error}
                  </div>
                </div>
              )}

              {result ? (
                <ResultCard result={result} />
              ) : (
                <div className="bg-neutral-900/30 border border-dashed border-neutral-800 rounded-2xl h-[400px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-neutral-300 font-medium mb-1">Esperando Datos</h3>
                  <p className="text-neutral-500 text-sm">Completa el formulario para generar tu prompt maestro.</p>
                </div>
              )}

              {/* Tips Section */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Tips para Grok Video
                </h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Sujeto primero:</strong> Describe claramente quién o qué es el foco en las primeras 5 palabras.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Física:</strong> Usa verbos que impliquen peso e inercia (ej: "trudging", "floating", "sprinting").</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Continuidad:</strong> Evita cortes de escena en un solo prompt. Describe una toma continua.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;