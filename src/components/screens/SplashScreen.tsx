import React from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Globe,
  Mic,
  ArrowRight,
  Siren,
  Activity,
  Layers,
  FileText,
  User,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { ScreenId } from '../../types';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-8 bg-gradient-to-b from-sky-50/60 via-white to-slate-50 relative">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="relative max-w-4xl mx-auto w-full text-center pt-2 sm:pt-6">
        {/* Compliance / Offline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Local Engine · Zero Internet Required · HIPPA/GDPR Local Data</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Instant Medical Translation for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Emergency Care & Clinics
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Break language barriers between patients and doctors anywhere. Designed with bidirectional
          voice-to-voice translation, visual pain mapping, clinical symptom triage, and prescription instructions.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={() => onNavigate('patient_translation')}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span>Open Translation Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('symptoms')}
            className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm sm:text-base flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Symptom Triage</span>
          </button>

          <button
            onClick={() => onNavigate('emergency')}
            className="px-5 py-3.5 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-700 font-bold text-sm sm:text-base flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Siren className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Columns Grid */}
      <div className="relative max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div
          onClick={() => onNavigate('languages')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">10+ Clinical Languages</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Offline speech recognition and synthesis for Hindi, Tamil, Telugu, Spanish, Arabic & more.
          </p>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Configure Models &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('symptoms')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Rapid Symptom Triage</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Visual clinical icon cards for immediate communication during acute emergency conditions.
          </p>
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Assess Symptoms &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('body_map')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Anatomical Body Map</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Touch-localized pain mapping with severity slider (1-10) for non-verbal or non-fluent patients.
          </p>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Open Body Map &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('medicine')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Prescription & Dosage</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Visual dosage schedules (Morning, Noon, Night, Meal instructions) with dual-language audio.
          </p>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Dosage Guide &rarr;
          </span>
        </div>
      </div>

      {/* Trust & Clinical Readiness Banner */}
      <div className="relative max-w-5xl mx-auto w-full mt-6 p-4 rounded-2xl bg-white/80 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Complete 10-Screen Clinical Architecture</h4>
            <p className="text-xs text-slate-500">All medical screens, audio synthesizers, and translation workflows active</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('patient_translation')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Launch Web Station
          </button>
        </div>
      </div>
    </div>
  );
};
