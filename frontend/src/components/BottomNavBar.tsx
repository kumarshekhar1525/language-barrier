import React from 'react';
import { Mic, Activity, User, Siren, Pill, Layers } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenDrawer: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenDrawer,
}) => {
  // Don't show bottom nav on splash screen for clean initial view
  if (currentScreen === 'splash') {
    return null;
  }

  const isTranslateActive = currentScreen === 'patient_translation' || currentScreen === 'doctor_reply';
  const isSymptomsActive = currentScreen === 'symptoms';
  const isBodyMapActive = currentScreen === 'body_map';
  const isEmergencyActive = currentScreen === 'emergency';
  const isMedicineActive = currentScreen === 'medicine';

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around sm:justify-center sm:gap-4 md:gap-8 z-20 shrink-0">
      {/* 1. Translate */}
      <button
        onClick={() => onNavigate('patient_translation')}
        className={`flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
          isTranslateActive ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Mic className="w-4 h-4 stroke-[2.2]" />
        <span className="text-[11px] sm:text-xs font-semibold">Translate</span>
      </button>

      {/* 2. Symptoms */}
      <button
        onClick={() => onNavigate('symptoms')}
        className={`flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
          isSymptomsActive ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Activity className="w-4 h-4 stroke-[2.2]" />
        <span className="text-[11px] sm:text-xs font-semibold">Symptoms</span>
      </button>

      {/* 3. Body Map */}
      <button
        onClick={() => onNavigate('body_map')}
        className={`flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
          isBodyMapActive ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <User className="w-4 h-4 stroke-[2.2]" />
        <span className="text-[11px] sm:text-xs font-semibold">Body Map</span>
      </button>

      {/* 4. SOS Mode */}
      <button
        onClick={() => onNavigate('emergency')}
        className={`relative flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
          isEmergencyActive ? 'text-red-600 bg-red-50 font-bold' : 'text-slate-600 hover:text-red-600 hover:bg-red-50/50'
        }`}
      >
        <div className="relative">
          <Siren className="w-4 h-4 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        </div>
        <span className="text-[11px] sm:text-xs font-semibold">Emergency</span>
      </button>

      {/* 5. Prescription */}
      <button
        onClick={() => onNavigate('medicine')}
        className={`flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
          isMedicineActive ? 'text-blue-600 bg-blue-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Pill className="w-4 h-4 stroke-[2.2]" />
        <span className="text-[11px] sm:text-xs font-semibold">Prescriptions</span>
      </button>

      {/* 6. All 10 Screens Drawer Button */}
      <button
        onClick={onOpenDrawer}
        className="flex sm:flex-row flex-col items-center gap-1 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
        title="View All 10 Screens"
      >
        <Layers className="w-4 h-4 stroke-[2]" />
        <span className="text-[11px] sm:text-xs font-semibold">All Screens</span>
      </button>
    </div>
  );
};
