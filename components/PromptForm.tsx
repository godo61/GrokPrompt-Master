import React, { useState } from 'react';
import { PromptFormData, CameraMovement, LightingStyle, ArtStyle, VideoAspectRatio } from '../types';

interface PromptFormProps {
  onSubmit: (data: PromptFormData) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PromptFormData>({
    subject: '',
    action: '',
    environment: '',
    camera: CameraMovement.Static,
    lighting: LightingStyle.Cinematic,
    style: ArtStyle.Photorealistic,
    negativePrompt: '',
    aspectRatio: VideoAspectRatio.Landscape,
    duration: 5
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Subject Section */}
      <div className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-800">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Sujeto y Acción
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Sujeto Principal</label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Un astronauta, un gato cyber-punk, un coche deportivo..."
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Acción / Movimiento</label>
            <textarea
              name="action"
              required
              rows={2}
              placeholder="Caminando lentamente hacia la cámara, volando entre las nubes, bebiendo café..."
              value={formData.action}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Environment & Style */}
      <div className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-800">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Escena y Estilo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-1">Entorno / Fondo</label>
            <input
              type="text"
              name="environment"
              placeholder="Una ciudad futurista lluviosa, un bosque antiguo, Marte..."
              value={formData.environment}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Estilo Visual</label>
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            >
              {Object.values(ArtStyle).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Iluminación</label>
            <select
              name="lighting"
              value={formData.lighting}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            >
              {Object.values(LightingStyle).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-neutral-400 mb-1">Negative Prompt (Opcional)</label>
            <textarea
              name="negativePrompt"
              rows={2}
              placeholder="Lo que NO quieres ver: borroso, marca de agua, deforme, mala calidad, texto..."
              value={formData.negativePrompt}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder-neutral-600"
            />
          </div>
        </div>
      </div>

      {/* Technicals */}
      <div className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-800">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
          Técnica de Cámara
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Movimiento de Cámara</label>
            <select
              name="camera"
              value={formData.camera}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
            >
              {Object.values(CameraMovement).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Relación de Aspecto</label>
            <select
              name="aspectRatio"
              value={formData.aspectRatio}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
            >
              {Object.values(VideoAspectRatio).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]
          ${isLoading 
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ingeniando Prompt...
          </span>
        ) : (
          "Generar Prompt Optimizado"
        )}
      </button>
    </form>
  );
};

export default PromptForm;