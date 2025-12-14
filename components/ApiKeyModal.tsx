import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [inputKey, setInputKey] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-white">
          <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Configuración Inicial</h2>
        </div>
        
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
          Para utilizar la IA real, necesitas una <strong>Gemini API Key</strong> (es gratis). 
          Si solo quieres ver cómo funciona la interfaz, usa el modo demo.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Opción A: Tu API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Pegar tu clave API aquí..."
              className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-neutral-600"
            />
          </div>

          <button
            onClick={() => {
              if (inputKey.trim().length > 10) {
                onSave(inputKey);
              }
            }}
            disabled={inputKey.trim().length < 10}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              inputKey.trim().length > 10
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            Guardar y Comenzar
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-4 text-neutral-600 text-xs uppercase">O bien</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          <button
            onClick={() => onSave("DEMO_MODE")}
            className="w-full py-3 rounded-lg font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-all border border-neutral-700 hover:border-neutral-600"
          >
            Probar Modo Demo (Sin Key)
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
          >
            Obtener una API Key gratis de Google &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;