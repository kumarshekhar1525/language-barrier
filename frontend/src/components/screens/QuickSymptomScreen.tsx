import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Volume2 } from 'lucide-react';
import { ScreenId, SymptomItem } from '../../types';
import { SYMPTOMS_LIST } from '../../data/mockData';
import { playTextToSpeech } from '../../utils/audio';

interface QuickSymptomScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedSymptoms: string[];
  onToggleSymptom: (id: string) => void;
}

export const QuickSymptomScreen: React.FC<QuickSymptomScreenProps> = ({
  onNavigate,
  selectedSymptoms,
  onToggleSymptom,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlaySymptom = (e: React.MouseEvent, symptom: SymptomItem) => {
    e.stopPropagation();
    setPlayingId(symptom.id);
    playTextToSpeech(
      `${symptom.name}. ${symptom.hindiName}`,
      'en-US',
      undefined,
      () => setPlayingId(null)
    );
  };

  // Render dedicated medical iconography matching the illustrated reference
  const renderSymptomIcon = (id: string) => {
    switch (id) {
      case 'fever':
        return (
          <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
            <path d="M12 4v7" strokeWidth="2.5" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>
        );
      case 'cough':
        return (
          <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
            <path d="M18 11c1 .5 2 1.5 2 3" strokeWidth="2.5" />
            <path d="M19 8c1.5.5 3 2 3 4" strokeWidth="2" />
          </svg>
        );
      case 'breathing':
        return (
          <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v8" strokeWidth="2.5" />
            <path d="M12 9c-3-2-6-1-8 2-2 3.5-.5 7 2 8s5-1 6-5" fill="#f43f5e" fillOpacity="0.15" />
            <path d="M12 9c3-2 6-1 8 2 2 3.5.5 7-2 8s-5-1-6-5" fill="#f43f5e" fillOpacity="0.15" />
          </svg>
        );
      case 'chest_pain':
        return (
          <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" fill="#ef4444" fillOpacity="0.15" />
            <path d="M12 8l-2 4l3 1l-2 4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'headache':
        return (
          <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7" />
            <path d="M8 5l2 2" strokeWidth="2.5" />
            <path d="M16 5l-2 2" strokeWidth="2.5" />
            <path d="M12 2v3" strokeWidth="2.5" />
            <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" />
          </svg>
        );
      case 'stomach_pain':
        return (
          <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3" strokeWidth="2.5" />
            <path d="M10 6c-3 1-5 4-5 8 0 4.5 3.5 7 7 7s7-2.5 7-7c0-4-2-7-5-8" fill="#10b981" fillOpacity="0.15" />
            <path d="M9 14h6" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        );
      case 'vomiting':
        return (
          <svg className="w-8 h-8 text-lime-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="7" />
            <path d="M9 9h.01" strokeWidth="3" />
            <path d="M15 9h.01" strokeWidth="3" />
            <path d="M10 14c.5-1 3.5-1 4 0" strokeWidth="2" />
            <path d="M10 16l-2 6M12 16l-1 6M14 16l1 6" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'dizziness':
        return (
          <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7" />
            <path d="M8 9l2 2m0-2l-2 2" strokeWidth="2" />
            <path d="M14 9l2 2m0-2l-2 2" strokeWidth="2" />
            <path d="M9 16c1.5-1 4.5-1 6 0" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 2l1 2 2 .5-2 1 .5 2-1.5-1.5L10 8" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-5 bg-slate-50 relative">
      <div>
        {/* Top Header & Pagination */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => onNavigate('patient_translation')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-5 h-2 rounded-full bg-blue-600 transition-all"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>

          <div className="w-8"></div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Select Symptom</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose or tap to communicate</p>
        </div>

        {/* Responsive Symptom Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {SYMPTOMS_LIST.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            const isPlaying = playingId === symptom.id;

            return (
              <div
                key={symptom.id}
                role="button"
                tabIndex={0}
                onClick={() => onToggleSymptom(symptom.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleSymptom(symptom.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center group select-none ${
                  symptom.bgColor
                } ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md bg-white'
                    : `${symptom.borderColor} shadow-2xs`
                }`}
              >
                {/* Audio Pronunciation Pill in top right */}
                <button
                  type="button"
                  onClick={(e) => handlePlaySymptom(e, symptom)}
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isPlaying ? 'bg-blue-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700 bg-white/70'
                  }`}
                  title="Pronounce Symptom"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Selection check indicator */}
                {isSelected && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Symptom Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  {renderSymptomIcon(symptom.id)}
                </div>

                {/* Symptom Title & Hindi Translation */}
                <span className={`text-sm font-bold tracking-tight ${symptom.textColor}`}>
                  {symptom.name}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {symptom.hindiName}
                </span>

                {symptom.isCritical && (
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/80 px-1.5 py-0.5 rounded-sm">
                    Priority
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-4">
        <button
          onClick={() => onNavigate('body_map')}
          className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <span>View Body Map</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
