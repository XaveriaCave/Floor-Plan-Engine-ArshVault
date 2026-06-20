import React from 'react';
import { EnvironmentPreset } from '../types';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface EnvironmentalControlsProps {
  activePreset: EnvironmentPreset;
  onSetPreset: (preset: EnvironmentPreset) => void;
}

export const EnvironmentalControls: React.FC<EnvironmentalControlsProps> = ({
  activePreset,
  onSetPreset,
}) => {
  const options = [
    {
      id: 'day' as EnvironmentPreset,
      name: 'Midday Sunlight',
      icon: Sun,
      description: 'High overhead light casts razor-sharp shadows with pastel blue scatter.',
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      activeClass: 'bg-amber-600 text-white border-amber-400 shadow-amber-500/10',
    },
    {
      id: 'night' as EnvironmentPreset,
      name: 'Cyberpunk Night',
      icon: Moon,
      description: 'Low midnight skylight triggers building window grids and lamppost neon emissions.',
      colorClass: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      activeClass: 'bg-blue-600 text-white border-blue-400 shadow-blue-500/10',
    },
  ];

  return (
    <div className="p-4 bg-slate-900 border-b border-slate-800 text-slate-100 flex flex-col gap-3 font-mono">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Atmosphere Engine</span>
        </h4>
        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700 uppercase">
          Dynamic Lighting
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = activePreset === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSetPreset(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? opt.activeClass + ' scale-102 ring-1 ring-white/10 shadow-lg'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-white/10 border-white/20 text-white' : opt.colorClass}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {opt.name}
                  </span>
                  <span className="text-[8.5px] text-slate-500 truncate max-w-[150px]">
                    {opt.id.toUpperCase()} PRESET
                  </span>
                </div>
              </div>
              <p className={`mt-1.5 text-[10px] leading-relaxed transition-colors ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
