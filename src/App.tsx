/**
 * Hear2Heal - Offline Medical Translation Assistant
 * Production Web Portal
 */

import React, { useState } from 'react';
import {
  Layers,
  Menu,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Mic,
  Activity,
  User,
  Siren,
  Pill,
  FileText,
  Globe,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from 'lucide-react';
import { ScreenId, Language, PainSeverity, PatientProfile } from './types';
import { LANGUAGES, INITIAL_PATIENT_PROFILE } from './data/mockData';
import { MobileFrame } from './components/MobileFrame';
import { ScreenSwitcherDrawer } from './components/ScreenSwitcherDrawer';
import { SidebarDashboard } from './components/SidebarDashboard';
import { AllScreensGallery } from './components/AllScreensGallery';
import { LoginScreen, AppUser } from './components/screens/LoginScreen';
import { SplashScreen } from './components/screens/SplashScreen';
import { LanguageSelectScreen } from './components/screens/LanguageSelectScreen';
import { PatientTranslationScreen } from './components/screens/PatientTranslationScreen';
import { DoctorReplyScreen } from './components/screens/DoctorReplyScreen';
import { QuickSymptomScreen } from './components/screens/QuickSymptomScreen';
import { BodyMapScreen } from './components/screens/BodyMapScreen';
import { EmergencyScreen } from './components/screens/EmergencyScreen';
import { MedicineScreen } from './components/screens/MedicineScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

export default function App() {
  // Authentication State (Default: false to show Login first)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // Current active screen (when logged in, starts in Overview 'splash')
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [viewMode, setViewMode] = useState<'device' | 'gallery'>('device');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Left Dashboard Sidebar ON / OFF state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // App-wide state shared across screens
  const [patientLang, setPatientLang] = useState<Language>(LANGUAGES[0]); // Hindi
  const [doctorLang, setDoctorLang] = useState<Language>(LANGUAGES[1]); // English
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['chest_pain', 'breathing']);
  const [selectedLocation, setSelectedLocation] = useState<string>('chest');
  const [painSeverity, setPainSeverity] = useState<PainSeverity>('severe');
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(INITIAL_PATIENT_PROFILE);

  // Handle successful login -> Redirects directly to Overview ('splash')
  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentScreen('splash'); // 1st me hi login karke hi overview me enter karega
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Swap languages
  const handleSwapLanguages = () => {
    const temp = patientLang;
    setPatientLang(doctorLang);
    setDoctorLang(temp);
  };

  // Toggle symptoms
  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reset to initial demo state
  const handleResetDemo = () => {
    setCurrentScreen('splash');
    setPatientLang(LANGUAGES[0]);
    setDoctorLang(LANGUAGES[1]);
    setSelectedSymptoms(['chest_pain', 'breathing']);
    setSelectedLocation('chest');
    setPainSeverity('severe');
    setPatientProfile(INITIAL_PATIENT_PROFILE);
  };

  // Render current screen inside the web frame
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={setCurrentScreen} />;
      case 'languages':
        return (
          <LanguageSelectScreen
            onNavigate={setCurrentScreen}
            patientLang={patientLang}
            doctorLang={doctorLang}
            onSelectPatientLang={setPatientLang}
            onSelectDoctorLang={setDoctorLang}
            onSwapLanguages={handleSwapLanguages}
          />
        );
      case 'patient_translation':
        return (
          <PatientTranslationScreen
            onNavigate={setCurrentScreen}
            patientLang={patientLang}
            doctorLang={doctorLang}
            onSelectPatientLang={setPatientLang}
            onSelectDoctorLang={setDoctorLang}
          />
        );
      case 'doctor_reply':
        return (
          <DoctorReplyScreen
            onNavigate={setCurrentScreen}
            patientLang={patientLang}
            doctorLang={doctorLang}
          />
        );
      case 'symptoms':
        return (
          <QuickSymptomScreen
            onNavigate={setCurrentScreen}
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={handleToggleSymptom}
          />
        );
      case 'body_map':
        return (
          <BodyMapScreen
            onNavigate={setCurrentScreen}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            painSeverity={painSeverity}
            onChangeSeverity={setPainSeverity}
          />
        );
      case 'emergency':
        return <EmergencyScreen onNavigate={setCurrentScreen} />;
      case 'medicine':
        return <MedicineScreen onNavigate={setCurrentScreen} />;
      case 'history':
        return <HistoryScreen onNavigate={setCurrentScreen} />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={setCurrentScreen}
            profile={patientProfile}
            onSaveProfile={setPatientProfile}
          />
        );
      default:
        return <SplashScreen onNavigate={setCurrentScreen} />;
    }
  };

  // If user is not yet logged in, show the LoginScreen first
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-slate-800 overflow-hidden">
      {/* Top Website Header */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_18px_50px_-30px_rgba(15,23,42,0.38)]">
        <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo & Name (Left Corner) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentScreen('splash')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 text-white flex items-center justify-center shadow-[0_14px_28px_-12px_rgba(37,99,235,0.8)] group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-[11px] tracking-[0.2em]">H2H</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base tracking-tight">
                    Hear2Heal
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Offline Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  Clinical Triage & Speech Translation Suite
                </p>
              </div>
            </button>
          </div>

          {/* Active Language Pair Quick Bar (Center) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-2xl px-2.5 py-1.5 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
            <button
              onClick={() => setCurrentScreen('languages')}
              className="font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
              title="Change Patient Language"
            >
              <span>{patientLang.flag}</span>
              <span className="font-bold">{patientLang.name}</span>
              <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                (Patient)
              </span>
            </button>

            <button
              onClick={handleSwapLanguages}
              className="w-7 h-7 rounded-xl bg-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.5)] border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentScreen('languages')}
              className="font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
              title="Change Doctor Language"
            >
              <span>{doctorLang.flag}</span>
              <span className="font-bold">{doctorLang.name}</span>
              <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                (Doctor)
              </span>
            </button>
          </div>

          {/* TOP RIGHT CORNER: Conversations History, Profile, Languages, SOS, Clinician Info & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Conversations History / Transcripts */}
            <button
              onClick={() => setCurrentScreen('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_14px_28px_-18px_rgba(37,99,235,0.8)]'
                  : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700'
              }`}
              title="View Conversations History & Transcripts"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conversations History</span>
              <span className="sm:hidden">History</span>
            </button>

            {/* 2. Patient Profile */}
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'profile'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold shadow-[0_14px_28px_-18px_rgba(14,165,233,0.8)]'
                  : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700'
              }`}
              title="Patient Profile & Allergies"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* 3. Languages */}
            <button
              onClick={() => setCurrentScreen('languages')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'languages'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-[0_14px_28px_-18px_rgba(79,70,229,0.8)]'
                  : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700'
              }`}
              title="Manage Offline Language Packs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Languages</span>
            </button>

            {/* 4. Quick Emergency SOS Button */}
            <button
              onClick={() => setCurrentScreen('emergency')}
              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_16px_30px_-14px_rgba(239,68,68,0.8)] transition-all cursor-pointer"
              title="Emergency SOS Protocol"
            >
              <Siren className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS</span>
            </button>

            {/* Logged-in User Badge */}
            {currentUser && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[130px]">{currentUser.name}</span>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-all cursor-pointer ml-0.5"
              title="Lock / Sign Out of Portal"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Screens List Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="All Screens Drawer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Side Dashboard + Right Workspace Content */}
      <div className="flex-1 flex flex-row w-full min-h-0 overflow-hidden relative">
        {/* LEFT SIDE DASHBOARD (Containing Overview, Patient Translation, Doctor Reply, Symptoms Triage, Body Map, Conversation History, Emergency SOS, Prescriptions) */}
        <SidebarDashboard
          currentScreen={currentScreen}
          onNavigate={(screenId) => {
            setCurrentScreen(screenId);
            setViewMode('device');
          }}
          patientLang={patientLang}
          doctorLang={doctorLang}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
          className="hidden md:flex"
        />

        {/* Button to Turn Dashboard Back ON when collapsed (Icon/Symbol only) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute top-3.5 left-3.5 z-30 w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md text-slate-700 items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer group"
            title="Open Dashboard"
            aria-label="Open Dashboard"
          >
            <PanelLeftOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* CENTER / RIGHT WORKSPACE AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-slate-100/60">
          {/* Mobile Quick Action Pill Strip (Visible on mobile only when sidebar is hidden) */}
          <div className="md:hidden bg-white border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none shrink-0">
            <button
              onClick={() => setCurrentScreen('splash')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'splash'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <span>Overview</span>
            </button>
            <button
              onClick={() => setCurrentScreen('patient_translation')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'patient_translation'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>Translate</span>
            </button>
            <button
              onClick={() => setCurrentScreen('doctor_reply')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'doctor_reply'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Doctor Reply</span>
            </button>
            <button
              onClick={() => setCurrentScreen('symptoms')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'symptoms'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Symptoms</span>
            </button>
            <button
              onClick={() => setCurrentScreen('body_map')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'body_map'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Body Map</span>
            </button>
            <button
              onClick={() => setCurrentScreen('emergency')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 font-bold ${
                currentScreen === 'emergency' ? 'bg-red-600 text-white' : 'text-red-700 bg-red-50'
              }`}
            >
              <Siren className="w-3 h-3 animate-pulse" />
              <span>SOS</span>
            </button>
            <button
              onClick={() => setCurrentScreen('medicine')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'medicine'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>Prescriptions</span>
            </button>
            <button
              onClick={() => setCurrentScreen('history')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${
                currentScreen === 'history'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>History</span>
            </button>
          </div>

          <main className="flex-1 flex flex-col w-full h-full min-h-0 p-0 overflow-y-auto">
            {viewMode === 'device' ? (
              <MobileFrame
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
                onOpenDrawer={() => setIsDrawerOpen(true)}
              >
                {renderCurrentScreen()}
              </MobileFrame>
            ) : (
              <AllScreensGallery
                onSelectScreenForInteractive={(screenId) => {
                  setCurrentScreen(screenId);
                  setViewMode('device');
                }}
                patientLang={patientLang}
                doctorLang={doctorLang}
                onSelectPatientLang={setPatientLang}
                onSelectDoctorLang={setDoctorLang}
                onSwapLanguages={handleSwapLanguages}
                selectedSymptoms={selectedSymptoms}
                onToggleSymptom={handleToggleSymptom}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                painSeverity={painSeverity}
                onChangeSeverity={setPainSeverity}
                patientProfile={patientProfile}
                onSaveProfile={setPatientProfile}
              />
            )}
          </main>
        </div>
      </div>

      {/* Drawer for jumping quickly between all 10 screens */}
      <ScreenSwitcherDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={(screenId) => {
          setCurrentScreen(screenId);
          setViewMode('device');
        }}
      />
    </div>
  );
}
