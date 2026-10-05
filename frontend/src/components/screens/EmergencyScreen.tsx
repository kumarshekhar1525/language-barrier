import React, { useState } from 'react';
import { ArrowLeft, BellRing, Volume2, HeartCrack, Droplets, UserX, AlertTriangle, Baby, Siren } from 'lucide-react';
import { ScreenId, EmergencyAction } from '../../types';
import { EMERGENCY_ACTIONS } from '../../data/mockData';
import { playTextToSpeech, stopTextToSpeech } from '../../utils/audio';
import { LungsIcon } from '../icons/MedicalIcons';

interface EmergencyScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onNavigate }) => {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyAction>(EMERGENCY_ACTIONS[1]); // Default severe chest pain
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayDoctorLanguage = () => {
    if (isPlayingAudio) {
      stopTextToSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const doctorEmergencyAnnouncement = `Medical emergency! The patient reports: ${selectedEmergency.title}. ${selectedEmergency.detail}. Immediate doctor assistance required!`;
    
    playTextToSpeech(
      doctorEmergencyAnnouncement,
      'en-US',
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const renderEmergencyIcon = (id: string) => {
    switch (id) {
      case 'cant_breathe':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <LungsIcon className="w-7 h-7" />
          </div>
        );
      case 'chest_pain':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <HeartCrack className="w-7 h-7" />
          </div>
        );
      case 'bleeding':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <Droplets className="w-7 h-7" />
          </div>
        );
      case 'unconscious':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <UserX className="w-7 h-7" />
          </div>
        );
      case 'allergy':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
        );
      case 'pregnancy':
        return (
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <Baby className="w-7 h-7" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] bg-slate-50 relative">
      {/* High-Contrast Red Header */}
      <div className="bg-red-600 text-white px-5 pt-4 pb-4 shadow-md">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('patient_translation')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-red-700/50 transition-colors cursor-pointer"
            aria-label="Back to Translation"
            title="Back to Patient Translation"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 animate-bounce text-red-200" />
            <h2 className="text-lg font-bold tracking-tight">Emergency Mode</h2>
          </div>

          <div className="w-8"></div>
        </div>
      </div>

      {/* 6 Quick-Action Emergency Tiles */}
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-3 text-center">
          <span className="text-xs font-semibold text-slate-500">
            Tap the critical condition to alert healthcare team
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {EMERGENCY_ACTIONS.map((item) => {
            const isSelected = selectedEmergency.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEmergency(item)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer text-center group ${
                  isSelected
                    ? 'bg-red-50 border-red-500 ring-2 ring-red-400 shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-red-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {renderEmergencyIcon(item.id)}

                <span className="mt-2.5 text-xs font-bold text-slate-900 leading-tight">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  {item.hindiTitle}
                </span>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Emergency Preview Banner */}
        <div className="mt-4 p-3 bg-white border border-red-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-red-600 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Selected Emergency
            </span>
            <span className="text-slate-400 font-normal">Hindi &rarr; English</span>
          </div>
          <div className="text-xs font-semibold text-slate-800">
            "{selectedEmergency.hindiTitle}"
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            &rarr; "{selectedEmergency.title}: {selectedEmergency.detail}"
          </div>
        </div>
      </div>

      {/* Bottom High-Priority Emergency Broadcast Button */}
      <div className="p-5 pt-2 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handlePlayDoctorLanguage}
          className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-red-700 shadow-red-600/50 scale-[0.98] ring-4 ring-red-200'
              : 'bg-red-600 hover:bg-red-700 shadow-red-600/35 active:scale-[0.98]'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <BellRing className="w-5 h-5" />
            )}
          </div>
          <div className="text-left">
            <div className="text-sm font-extrabold tracking-tight">Play in Doctor Language</div>
            <div className="text-[11px] text-red-100 font-normal">Quick translation with audio</div>
          </div>
        </button>
      </div>
    </div>
  );
};
