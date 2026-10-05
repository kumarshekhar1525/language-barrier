import React from 'react';
import { ScreenId, Language, PainSeverity, PatientProfile } from '../types';
import { SplashScreen } from './screens/SplashScreen';
import { LanguageSelectScreen } from './screens/LanguageSelectScreen';
import { PatientTranslationScreen } from './screens/PatientTranslationScreen';
import { DoctorReplyScreen } from './screens/DoctorReplyScreen';
import { QuickSymptomScreen } from './screens/QuickSymptomScreen';
import { BodyMapScreen } from './screens/BodyMapScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { MedicineScreen } from './screens/MedicineScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MobileStatusBar } from './MobileStatusBar';
import { Eye, ExternalLink } from 'lucide-react';

interface AllScreensGalleryProps {
  onSelectScreenForInteractive: (screenId: ScreenId) => void;
  patientLang: Language;
  doctorLang: Language;
  onSelectPatientLang: (lang: Language) => void;
  onSelectDoctorLang: (lang: Language) => void;
  onSwapLanguages: () => void;
  selectedSymptoms: string[];
  onToggleSymptom: (id: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  painSeverity: PainSeverity;
  onChangeSeverity: (severity: PainSeverity) => void;
  patientProfile: PatientProfile;
  onSaveProfile: (profile: PatientProfile) => void;
}

interface GalleryCardConfig {
  id: ScreenId;
  index: number;
  label: string;
  component: React.ReactNode;
  isEmergency?: boolean;
}

export const AllScreensGallery: React.FC<AllScreensGalleryProps> = (props) => {
  const screens: GalleryCardConfig[] = [
    {
      id: 'splash',
      index: 1,
      label: '1. Splash / Landing Screen',
      component: <SplashScreen onNavigate={props.onSelectScreenForInteractive} />,
    },
    {
      id: 'languages',
      index: 2,
      label: '2. Language Selection',
      component: (
        <LanguageSelectScreen
          onNavigate={props.onSelectScreenForInteractive}
          patientLang={props.patientLang}
          doctorLang={props.doctorLang}
          onSelectPatientLang={props.onSelectPatientLang}
          onSelectDoctorLang={props.onSelectDoctorLang}
          onSwapLanguages={props.onSwapLanguages}
        />
      ),
    },
    {
      id: 'patient_translation',
      index: 3,
      label: '3. Main Translation Screen',
      component: (
        <PatientTranslationScreen
          onNavigate={props.onSelectScreenForInteractive}
          patientLang={props.patientLang}
          doctorLang={props.doctorLang}
        />
      ),
    },
    {
      id: 'doctor_reply',
      index: 4,
      label: '4. Doctor Reply',
      component: (
        <DoctorReplyScreen
          onNavigate={props.onSelectScreenForInteractive}
          patientLang={props.patientLang}
          doctorLang={props.doctorLang}
        />
      ),
    },
    {
      id: 'symptoms',
      index: 5,
      label: '5. Quick Symptom Selection',
      component: (
        <QuickSymptomScreen
          onNavigate={props.onSelectScreenForInteractive}
          selectedSymptoms={props.selectedSymptoms}
          onToggleSymptom={props.onToggleSymptom}
        />
      ),
    },
    {
      id: 'body_map',
      index: 6,
      label: '6. Body Map Screen',
      component: (
        <BodyMapScreen
          onNavigate={props.onSelectScreenForInteractive}
          selectedLocation={props.selectedLocation}
          onSelectLocation={props.onSelectLocation}
          painSeverity={props.painSeverity}
          onChangeSeverity={props.onChangeSeverity}
        />
      ),
    },
    {
      id: 'emergency',
      index: 7,
      label: '7. Emergency / SOS Mode',
      isEmergency: true,
      component: <EmergencyScreen onNavigate={props.onSelectScreenForInteractive} />,
    },
    {
      id: 'medicine',
      index: 8,
      label: '8. Medicine Instructions',
      component: <MedicineScreen onNavigate={props.onSelectScreenForInteractive} />,
    },
    {
      id: 'history',
      index: 9,
      label: '9. Conversation History',
      component: <HistoryScreen onNavigate={props.onSelectScreenForInteractive} />,
    },
    {
      id: 'profile',
      index: 10,
      label: '10. Patient Profile (Optional)',
      component: (
        <ProfileScreen
          onNavigate={props.onSelectScreenForInteractive}
          profile={props.patientProfile}
          onSaveProfile={props.onSaveProfile}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hear2Heal · 10 Screen System Blueprint
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          Faithful replica of all 10 clinical views shown in the design blueprint. Click "Interact" on any frame to test live audio synthesis, voice recording simulation, and body pain mapping.
        </p>
      </div>

      {/* Grid of 10 mobile frames arranged like the original artwork */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {screens.map((scr) => (
          <div key={scr.id} className="flex flex-col items-center">
            {/* Mobile Mockup Card Container */}
            <div className="relative w-full max-w-[340px] bg-slate-900 rounded-[32px] p-2.5 shadow-xl border border-slate-700/60 ring-1 ring-white/10 group">
              {/* Notch / Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2 border border-slate-800" />
                <span className="w-2 h-2 rounded-full bg-blue-950/60" />
              </div>

              {/* Screen Frame Interior */}
              <div className="relative w-full h-[620px] rounded-[24px] overflow-hidden bg-white flex flex-col shadow-inner">
                {/* Status Bar */}
                <MobileStatusBar isEmergency={scr.isEmergency} />

                {/* View Content */}
                <div className="flex-1 overflow-y-auto relative text-xs">
                  {scr.component}
                </div>

                {/* Home Indicator */}
                <div className="h-4 bg-white/95 flex items-center justify-center pb-1">
                  <div className="w-24 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>

              {/* Hover Overlay with button to launch interactive mode */}
              <div className="absolute inset-2.5 rounded-[24px] bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 z-40">
                <span className="text-white text-sm font-bold text-center px-2">
                  {scr.label}
                </span>
                <button
                  onClick={() => props.onSelectScreenForInteractive(scr.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Interact With Screen</span>
                </button>
              </div>
            </div>

            {/* Sub-label banner matching the screenshot footer pill */}
            <button
              onClick={() => props.onSelectScreenForInteractive(scr.id)}
              className="mt-3 px-4 py-1.5 rounded-lg bg-blue-950 text-white text-xs font-bold shadow-md hover:bg-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{scr.label}</span>
              <Eye className="w-3.5 h-3.5 text-blue-300" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
