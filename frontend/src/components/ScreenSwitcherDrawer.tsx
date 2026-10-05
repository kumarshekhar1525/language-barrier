import React from 'react';
import { X, Layers, Check, Sparkles, Shield, Languages, MessageSquare, Stethoscope, Activity, User, Siren, Pill, Clock, ArrowRight } from 'lucide-react';
import { ScreenId } from '../types';

interface ScreenSwitcherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

interface ScreenInfo {
  id: ScreenId;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
}

const SCREENS_CONFIG: ScreenInfo[] = [
  {
    id: 'splash',
    number: 1,
    title: 'Splash / Landing Screen',
    subtitle: 'Branding, offline capabilities & get started CTA',
    category: 'Onboarding',
    icon: <Shield className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'languages',
    number: 2,
    title: 'Language Selection',
    subtitle: 'From/To language pickers, swap & offline pack status',
    category: 'Setup',
    icon: <Languages className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'patient_translation',
    number: 3,
    title: 'Main Translation Screen',
    subtitle: 'Patient mode with audio waves & critical symptom alert',
    category: 'Translation',
    icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'doctor_reply',
    number: 4,
    title: 'Doctor Reply',
    subtitle: 'Doctor question input & patient translated output',
    category: 'Translation',
    icon: <Stethoscope className="w-4 h-4 text-rose-600" />,
  },
  {
    id: 'symptoms',
    number: 5,
    title: 'Quick Symptom Selection',
    subtitle: '2-column pastel cards with audio pronunciation',
    category: 'Clinical',
    icon: <Activity className="w-4 h-4 text-orange-500" />,
  },
  {
    id: 'body_map',
    number: 6,
    title: 'Body Map Screen',
    subtitle: 'Interactive front/back silhouette & pain severity dial',
    category: 'Clinical',
    icon: <User className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'emergency',
    number: 7,
    title: 'Emergency / SOS Mode',
    subtitle: 'High-contrast red triage tiles & doctor audio broadcast',
    category: 'Urgent Care',
    icon: <Siren className="w-4 h-4 text-red-600" />,
  },
  {
    id: 'medicine',
    number: 8,
    title: 'Medicine Instructions',
    subtitle: 'Dosage translator for tablet, syrup, injection, inhaler',
    category: 'Pharmacy',
    icon: <Pill className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'history',
    number: 9,
    title: 'Conversation History',
    subtitle: 'Chronological transcript with audio replay and timestamps',
    category: 'Records',
    icon: <Clock className="w-4 h-4 text-slate-600" />,
  },
  {
    id: 'profile',
    number: 10,
    title: 'Patient Profile (Optional)',
    subtitle: 'Encrypted offline records: blood group, allergies, meds',
    category: 'Records',
    icon: <User className="w-4 h-4 text-blue-600" />,
  },
];

export const ScreenSwitcherDrawer: React.FC<ScreenSwitcherDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Hear2Heal Screens</h3>
              <p className="text-xs text-slate-500">Jump directly to any of the 10 mobile views</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of 10 screens */}
        <div className="p-3 space-y-1.5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {SCREENS_CONFIG.map((scr) => {
            const isActive = currentScreen === scr.id;
            return (
              <button
                key={scr.id}
                onClick={() => {
                  onSelectScreen(scr.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200 shadow-xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Screen Number Badge */}
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {scr.number}
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {scr.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {scr.title}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {scr.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{scr.subtitle}</p>
                  </div>
                </div>

                <div className="pl-2">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                      <Check className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Offline First Engine · High-reliability clinical terminology v2.4
          </p>
        </div>
      </div>
    </div>
  );
};
