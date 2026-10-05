import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Keyboard,
  Activity,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Bot,
  ShieldAlert,
  Stethoscope,
  Radio,
  CheckCircle2,
  Globe2,
  Zap
} from 'lucide-react';
import { ScreenId, Language } from '../../types';
import { playTextToSpeech, stopTextToSpeech } from '../../utils/audio';
import {
  processPatientSpeech,
  EMERGENCY_PRESETS,
  PatientAnalysisResult,
  EmergencyPreset
} from '../../utils/aiTranslator';
import { LANGUAGES } from '../../data/mockData';
import { syncTranslationToSupabase } from '../../utils/supabase';

interface PatientTranslationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  patientLang: Language;
  doctorLang: Language;
  onSelectPatientLang?: (lang: Language) => void;
  onSelectDoctorLang?: (lang: Language) => void;
}

export const PatientTranslationScreen: React.FC<PatientTranslationScreenProps> = ({
  onNavigate,
  patientLang,
  doctorLang,
  onSelectPatientLang,
  onSelectDoctorLang
}) => {
  // AI Auto-Detection Mode (default ON for emergency readiness)
  const [isAutoDetectMode, setIsAutoDetectMode] = useState<boolean>(true);

  // Doctor preferred output language: 'en' (English) or 'hi' (Hindi)
  const [doctorOutputLangId, setDoctorOutputLangId] = useState<'en' | 'hi'>('en');

  // Input & analysis state
  const [inputText, setInputText] = useState<string>(EMERGENCY_PRESETS[0].patientText);
  const [analysis, setAnalysis] = useState<PatientAnalysisResult>(() =>
    processPatientSpeech(EMERGENCY_PRESETS[0].patientText, 'en')
  );

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  // Active emergency preset selected (if any)
  const [activePresetId, setActivePresetId] = useState<string>('hindi-chest-pain');

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);

  // Re-run analysis whenever input text or doctor's output language changes
  useEffect(() => {
    const result = processPatientSpeech(inputText, doctorOutputLangId);
    setAnalysis(result);

    // If auto-detect is on, sync detected language with app-wide state
    if (isAutoDetectMode && onSelectPatientLang) {
      if (result.detectedLanguage.id !== patientLang.id) {
        onSelectPatientLang(result.detectedLanguage);
      }
    }

    // Cloud sync to Supabase (if connected)
    if (inputText.trim()) {
      syncTranslationToSupabase(
        'patient',
        result.detectedLanguage.name,
        doctorOutputLangId === 'hi' ? 'Hindi' : 'English',
        inputText,
        result.doctorTranslation,
        result.triageLevel
      );
    }
  }, [inputText, doctorOutputLangId, isAutoDetectMode]);

  // Sync doctorLang from parent if changed
  useEffect(() => {
    if (doctorLang.id === 'hi' || doctorLang.id === 'en') {
      setDoctorOutputLangId(doctorLang.id as 'en' | 'hi');
    }
  }, [doctorLang]);

  // Handle switching doctor's output language
  const handleToggleDoctorLang = (targetId: 'en' | 'hi') => {
    setDoctorOutputLangId(targetId);
    if (onSelectDoctorLang) {
      const match = LANGUAGES.find((l) => l.id === targetId);
      if (match) onSelectDoctorLang(match);
    }
  };

  // Play audio in doctor's chosen language (English or Hindi)
  const handlePlayDoctorAudio = () => {
    if (isPlayingAudio) {
      stopTextToSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak =
      doctorOutputLangId === 'hi' ? analysis.hindiTranslation : analysis.englishTranslation;
    const langCode = doctorOutputLangId === 'hi' ? 'hi-IN' : 'en-US';

    playTextToSpeech(
      textToSpeak,
      langCode,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  // Handle preset pill click
  const handleSelectPreset = (preset: EmergencyPreset) => {
    setActivePresetId(preset.id);
    setInputText(preset.patientText);
  };

  // Toggle Microphone with real Web Speech API + simulated fallback
  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    setRecognitionError(null);
    setIsRecording(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        // In auto-detect mode, let browser use default locale or patient locale
        recognition.lang = isAutoDetectMode ? '' : patientLang.id;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setInputText(transcript);
            setActivePresetId('');
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error/blocked:', event.error);
          setRecognitionError('Microphone audio completed');
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition launch failed, using fallback simulation:', err);
      }
    }

    // Fallback simulation if speech recognition is unsupported or blocked
    setTimeout(() => {
      setIsRecording(false);
    }, 2800);
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[680px] p-4 sm:p-5 bg-slate-50 relative overflow-y-auto">
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Patient Speech Translation
              </h2>
              {/* AI Auto-Detect Active Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>AI Auto-Detect Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Emergency Mode: Patient speaks in <span className="font-semibold text-slate-700">ANY language</span> — AI auto-detects & renders clinical translation for the Doctor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('doctor_reply')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Doctor Reply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Emergency Triage Notice & Auto-Detect Banner */}
        <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200/80 rounded-2xl mb-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Emergency Zero-Click AI Detection
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                    No Manual Selection Needed
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Doctor or patient doesn't need to waste time searching language dropdowns in critical moments.
                </p>
              </div>
            </div>

            {/* Auto-detect toggle switch */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                onClick={() => setIsAutoDetectMode(true)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isAutoDetectMode
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Auto-Detect</span>
              </button>
              <button
                onClick={() => onNavigate('languages')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  !isAutoDetectMode
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Change manually in languages menu"
              >
                <Globe2 className="w-3 h-3" />
                <span>Manual</span>
              </button>
            </div>
          </div>
        </div>

        {/* PATIENT VOICE INPUT CARD */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs mb-3 relative">
          <div className="flex flex-wrap items-center justify-between text-xs mb-2.5 gap-2 pb-2 border-b border-slate-100">
            {/* Auto-Detected Language Pill */}
            <div className="flex items-center gap-2">
              <span className="text-base">{analysis.detectedLanguage.flag}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {analysis.detectedLanguage.name} ({analysis.detectedLanguage.nativeName})
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{analysis.confidence}% Match</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Script: {analysis.sourceScript} • Patient Voice Input
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                <Activity className={`w-3.5 h-3.5 ${isRecording ? 'animate-bounce' : ''}`} />
                <span>{isRecording ? 'Listening live...' : 'Voice input active'}</span>
              </div>

              {/* Type Mode Toggle */}
              <button
                onClick={() => setIsTypingMode(!isTypingMode)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isTypingMode
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Toggle manual text edit"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isTypingMode ? 'Voice Mode' : 'Type'}</span>
              </button>
            </div>
          </div>

          {/* Text input area */}
          {isTypingMode ? (
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setActivePresetId('');
              }}
              rows={3}
              className="w-full text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl p-2 border border-slate-200 resize-none leading-relaxed"
              placeholder="Speak or type patient symptoms in Hindi, Bengali, Tamil, Telugu, Spanish, Arabic, or any language..."
            />
          ) : (
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed min-h-[56px] flex items-center py-1">
              "{inputText}"
            </div>
          )}

          {/* Waveform Graphic */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-1">
              {[30, 60, 95, 45, 80, 25, 90, 50, 75, 35, 85, 40].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isRecording
                      ? `${Math.max(25, (h + (i % 3) * 15) % 100)}px`
                      : '8px'
                  }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording
                      ? 'bg-gradient-to-t from-blue-600 to-indigo-500 animate-pulse'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                {isRecording ? '🔴 REC 00:03' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Speak Action & Microphone */}
        <div className="flex items-center justify-center my-3">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-red-500/25 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                onClick={handleToggleRecord}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 shadow-red-600/40 ring-4 ring-red-200'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30'
                }`}
                title={isRecording ? 'Click to stop listening' : 'Tap to speak in ANY language'}
              >
                {isRecording ? <MicOff className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <span className="text-xs font-bold text-slate-700 mt-2 text-center">
              {isRecording
                ? '🎙️ Listening... Speak in Hindi, Bengali, Tamil, Telugu or any language'
                : `Tap Mic to Speak in Any Language`}
            </span>
            <span className="text-[10px] text-slate-400">
              AI automatically detects spoken language and translates immediately
            </span>
          </div>
        </div>

        {/* EMERGENCY SCENARIO PRESETS: Quick One-Tap Testing */}
        <div className="my-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Emergency Patient Speech (1-Tap Test):</span>
            </span>
            <span className="text-[11px] text-slate-400">Tap to test AI Auto-Detection</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {EMERGENCY_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{preset.flag}</span>
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DOCTOR TRANSLATION DISPLAY CARD */}
        <div className="p-4 bg-gradient-to-br from-sky-50/90 to-blue-50/70 border border-sky-200 rounded-2xl shadow-xs mt-2">
          <div className="flex items-center justify-between text-xs text-sky-900 font-bold mb-2 pb-1.5 border-b border-sky-200/60">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>
                Translated Output ({doctorOutputLangId === 'hi' ? 'हिन्दी - Hindi' : 'English'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Compact Doctor language switch inside the output card */}
              <div className="inline-flex p-0.5 bg-white rounded-lg border border-sky-200 shadow-2xs">
                <button
                  onClick={() => handleToggleDoctorLang('en')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    doctorOutputLangId === 'en'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Show in English"
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleToggleDoctorLang('hi')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    doctorOutputLangId === 'hi'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Show in Hindi"
                >
                  🇮🇳 हिन्दी
                </button>
              </div>

              {/* Play Speech button */}
              <button
                onClick={handlePlayDoctorAudio}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-blue-600 text-white shadow-xs animate-pulse'
                    : 'bg-white text-blue-700 border border-sky-300 hover:bg-blue-50'
                }`}
                title="Play Audio in Doctor's Language"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen Audio'}</span>
              </button>
            </div>
          </div>

          {/* Primary Translated Output Text */}
          <p className="text-slate-950 font-bold text-base sm:text-lg leading-snug">
            {analysis.doctorTranslation}
          </p>

          {/* Secondary Translation Subtext (shows English if Hindi selected, or Hindi if English selected) */}
          <div className="mt-2 pt-2 border-t border-sky-200/50 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600 font-medium">
            <span>
              {doctorOutputLangId === 'en'
                ? `हिन्दी अनुवाद: ${analysis.hindiTranslation}`
                : `English Ref: ${analysis.englishTranslation}`}
            </span>
          </div>
        </div>

        {/* EMERGENCY TRIAGE & CRITICAL SYMPTOMS ALERT */}
        {analysis.triageLevel === 'red' ? (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-sm animate-pulse" style={{ animationDuration: '3s' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide bg-red-600 text-white uppercase">
                      CRITICAL RED TRIAGE
                    </span>
                    <h4 className="text-sm font-bold text-red-950 tracking-tight">
                      Immediate Cardiopulmonary Emergency
                    </h4>
                  </div>
                  <button
                    onClick={() => onNavigate('emergency')}
                    className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Launch SOS Protocol</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-red-900 mt-1 font-semibold">
                  {analysis.clinicalSummary}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {analysis.criticalSymptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      <span>{symptom}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : analysis.triageLevel === 'yellow' ? (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                    YELLOW TRIAGE (URGENT)
                  </span>
                  <button
                    onClick={() => onNavigate('symptoms')}
                    className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                  >
                    Check Triage Symptoms &rarr;
                  </button>
                </div>
                <p className="text-xs text-amber-950 font-medium mt-1">
                  {analysis.clinicalSummary}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {analysis.criticalSymptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Navigation & Action Bar at Bottom */}
      <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={() => onNavigate('symptoms')}
          className="flex-1 py-2.5 px-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>Select Symptoms</span>
        </button>

        <button
          onClick={() => onNavigate('doctor_reply')}
          className="flex-1 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>Doctor Reply ({analysis.detectedLanguage.name})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="py-2.5 px-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>History</span>
        </button>
      </div>
    </div>
  );
};
