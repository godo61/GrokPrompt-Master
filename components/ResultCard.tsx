import React, { useState } from 'react';
import { GeneratedResult } from '../types';

interface ResultCardProps {
  result: GeneratedResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Grok often takes the prompt first, then technicals
    const fullText = `${result.optimizedPrompt} ${result.technicalDetails}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Prompt Generado</h2>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar Todo'}
          </button>
        </div>

        {/* The Prompt */}
        <div className="bg-black/50 rounded-xl p-4 border border-neutral-800 mb-6">
          <p className="text-gray-100 text-lg leading-relaxed font-light">
            {result.optimizedPrompt}
          </p>
          <div className="mt-3 pt-3 border-t border-neutral-800 text-sm font-mono text-blue-400">
            {result.technicalDetails}
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            Análisis de Ingeniería
          </h4>
          <p className="text-neutral-300 text-sm leading-relaxed bg-neutral-800/50 p-3 rounded-lg border border-neutral-700/50">
            <span className="text-yellow-500 mr-2">✦</span>
            {result.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;