import React, { useState } from 'react';
import { ArrowLeft, ArrowDown, Volume2, Pill, FlaskRound as Flask, Syringe, Wind, Check } from 'lucide-react';
import { ScreenId, DosageType } from '../../types';
import { MEDICINE_PRESCRIPTIONS } from '../../data/mockData';
import { playTextToSpeech, stopTextToSpeech } from '../../utils/audio';

interface MedicineScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const MedicineScreen: React.FC<MedicineScreenProps> = ({ onNavigate }) => {
  const [selectedDosage, setSelectedDosage] = useState<DosageType>('tablet');
  const [isPlayingEnglish, setIsPlayingEnglish] = useState(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);

  const currentPrescription = MEDICINE_PRESCRIPTIONS[selectedDosage];

  const handlePlayEnglish = () => {
    if (isPlayingEnglish) {
      stopTextToSpeech();
      setIsPlayingEnglish(false);
      return;
    }
    playTextToSpeech(
      currentPrescription.englishInstruction,
      'en-US',
      () => setIsPlayingEnglish(true),
      () => setIsPlayingEnglish(false)
    );
  };

  const handlePlayHindi = () => {
    if (isPlayingHindi) {
      stopTextToSpeech();
      setIsPlayingHindi(false);
      return;
    }
    playTextToSpeech(
      currentPrescription.hindiInstruction,
      'hi-IN',
      () => setIsPlayingHindi(true),
      () => setIsPlayingHindi(false)
    );
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-5 bg-slate-50 relative">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onNavigate('doctor_reply')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Medicine Instructions</h2>
            <p className="text-xs text-slate-500">Translate prescription and dosage</p>
          </div>
        </div>

        {/* Doctor Instruction Card (English) */}
        <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-sky-800 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Doctor (English)
            </span>
            <button
              onClick={handlePlayEnglish}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isPlayingEnglish ? 'bg-blue-600 text-white animate-pulse' : 'text-sky-700 hover:bg-sky-200/60'
              }`}
              title="Play English Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-900 font-medium text-base leading-snug">
            {currentPrescription.englishInstruction}
          </p>
          <div className="mt-2 text-[11px] text-sky-700/80 font-mono">
            Schedule: {currentPrescription.schedule} · Duration: {currentPrescription.duration}
          </div>
        </div>

        {/* Translation Flow Arrow */}
        <div className="flex justify-center my-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Translated Instruction Card (Hindi) */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Translated (Hindi)
            </span>
            <button
              onClick={handlePlayHindi}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isPlayingHindi ? 'bg-emerald-600 text-white animate-pulse' : 'text-emerald-700 hover:bg-emerald-200/60'
              }`}
              title="Play Hindi Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-900 font-medium text-lg leading-snug">
            {currentPrescription.hindiInstruction}
          </p>
        </div>
      </div>

      {/* Dosage Selector Navigation Bar at Bottom */}
      <div className="pt-4 border-t border-slate-200/80 mt-4">
        <div className="text-[11px] font-semibold text-slate-500 mb-2 text-center uppercase tracking-wider">
          Dosage Form Selector
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Tablet */}
          <button
            type="button"
            onClick={() => setSelectedDosage('tablet')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
              selectedDosage === 'tablet'
                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
              selectedDosage === 'tablet' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Pill className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Tablet</span>
          </button>

          {/* Syrup */}
          <button
            type="button"
            onClick={() => setSelectedDosage('syrup')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
              selectedDosage === 'syrup'
                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
              selectedDosage === 'syrup' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Flask className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Syrup</span>
          </button>

          {/* Injection */}
          <button
            type="button"
            onClick={() => setSelectedDosage('injection')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
              selectedDosage === 'injection'
                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
              selectedDosage === 'injection' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Syringe className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Injection</span>
          </button>

          {/* Inhaler */}
          <button
            type="button"
            onClick={() => setSelectedDosage('inhaler')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
              selectedDosage === 'inhaler'
                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
              selectedDosage === 'inhaler' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Inhaler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
