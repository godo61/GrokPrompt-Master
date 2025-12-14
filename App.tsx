import React, { useState, useEffect } from 'react';
import PromptForm from './components/PromptForm';
import ResultCard from './components/ResultCard';
import ApiKeyModal from './components/ApiKeyModal';
import { PromptFormData, GeneratedResult } from './types';
import { generateOptimizedPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API Key Management
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
    // YA NO forzamos el modal al inicio. Dejamos que el usuario explore primero.
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    setShowKeyModal(true);
  };

  const handleFormSubmit = async (data: PromptFormData) => {
    // Aquí es donde pedimos la clave si no la tiene
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const generated = await generateOptimizedPrompt(data, apiKey);
      setResult(generated);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Ocurrió un error inesperado. Por favor intenta de nuevo.";

      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes("clave api no configurada")) {
          errorMessage = "Error de configuración de API Key.";
          setShowKeyModal(true);
        } else if (msg.includes("403") || msg.includes("invalid api key")) {
          errorMessage = "La API Key es inválida. Por favor actualízala.";
          handleClearKey(); // Force re-entry
        } else if (msg.includes("429") || msg.includes("quota")) {
          errorMessage = "Has excedido el límite de solicitudes. Por favor espera un momento.";
        } else if (msg.includes("503") || msg.includes("overloaded")) {
          errorMessage = "El servicio de Gemini está saturado. Intenta de nuevo en unos segundos.";
        } else if (msg.includes("fetch failed") || msg.includes("network")) {
          errorMessage = "Error de conexión. Verifica tu internet.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 selection:bg-blue-500/30">
      <ApiKeyModal isOpen={showKeyModal} onSave={handleSaveKey} />

      {/* Header */}
      <header className="border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
              GrokPrompt <span className="text-neutral-500 font-normal">Master</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {apiKey ? (
              <>
                <div className={`text-xs font-mono px-3 py-1 rounded-full border hidden sm:block ${apiKey === 'DEMO_MODE' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                  {apiKey === 'DEMO_MODE' ? 'MODO DEMO' : 'Gemini Activo'}
                </div>
                <button 
                  onClick={handleClearKey}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                  title="Cambiar API Key"
                >
                  Configuración ●
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowKeyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-full transition-all border border-neutral-700"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Configurar IA
              </button>
            )}
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
                Define los parámetros de tu video. Nuestra IA optimizará tu idea para 
                la tecnología de Grok Video, enfocándose en la física, iluminación y consistencia.
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-neutral-300 font-medium mb-1">Esperando Datos</h3>
                  <p className="text-neutral-500 text-sm">
                    Completa el formulario para generar tu prompt maestro.
                    <br/>
                    <span className="text-neutral-600 text-xs">(Requiere configuración de IA)</span>
                  </p>
                </div>
              )}

              {/* Tips Section */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Tips de Ingeniería Grok
                </h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Mecánica:</strong> Grok entiende mejor la acción si describes la fuerza aplicada (ej: "golpea con peso", "flota sin gravedad").</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span><strong>Cámara:</strong> Usa "Orbit" o "Truck" para dar tridimensionalidad a la escena.</span>
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