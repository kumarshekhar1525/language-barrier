import React, { useState } from 'react';
import { ArrowLeft, ArrowUpDown, ShieldCheck, Check, ChevronDown, DownloadCloud } from 'lucide-react';
import { ScreenId, Language } from '../../types';
import { LANGUAGES } from '../../data/mockData';

interface LanguageSelectScreenProps {
  onNavigate: (screen: ScreenId) => void;
  patientLang: Language;
  doctorLang: Language;
  onSelectPatientLang: (lang: Language) => void;
  onSelectDoctorLang: (lang: Language) => void;
  onSwapLanguages: () => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onNavigate,
  patientLang,
  doctorLang,
  onSelectPatientLang,
  onSelectDoctorLang,
  onSwapLanguages,
}) => {
  const [openFromDropdown, setOpenFromDropdown] = useState(false);
  const [openToDropdown, setOpenToDropdown] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-6 bg-slate-50 relative">
      {/* Top Header & Pagination */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('splash')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-5 h-2 rounded-full bg-blue-600 transition-all"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>

          <div className="w-8"></div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Select Languages</h2>
          <p className="text-sm text-slate-500 mt-0.5">Choose languages for translation</p>
        </div>

        {/* Language Selection Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start relative mb-4">
          {/* Patient Language Box */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Patient Language (From)
            </label>
            <button
              type="button"
              onClick={() => {
                setOpenFromDropdown(!openFromDropdown);
                setOpenToDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-blue-400 focus:border-blue-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{patientLang.flag}</span>
                <div>
                  <div className="font-semibold text-slate-900 text-base">{patientLang.name}</div>
                  <div className="text-xs text-slate-400">{patientLang.nativeName}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFromDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {openFromDropdown && (
              <div className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl max-h-56 overflow-y-auto p-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={`from-${lang.id}`}
                    onClick={() => {
                      onSelectPatientLang(lang);
                      setOpenFromDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      patientLang.id === lang.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-xs text-slate-400">({lang.nativeName})</span>
                    </div>
                    {lang.isDownloaded && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Offline
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Doctor Language Box */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Doctor Language (To)
            </label>
            <button
              type="button"
              onClick={() => {
                setOpenToDropdown(!openToDropdown);
                setOpenFromDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-blue-400 focus:border-blue-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{doctorLang.flag}</span>
                <div>
                  <div className="font-semibold text-slate-900 text-base">{doctorLang.name}</div>
                  <div className="text-xs text-slate-400">{doctorLang.nativeName}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openToDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {openToDropdown && (
              <div className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl max-h-56 overflow-y-auto p-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={`to-${lang.id}`}
                    onClick={() => {
                      onSelectDoctorLang(lang);
                      setOpenToDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      doctorLang.id === lang.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-xs text-slate-400">({lang.nativeName})</span>
                    </div>
                    {lang.isDownloaded && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Offline
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button In-Between */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={onSwapLanguages}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer font-semibold text-xs"
            title="Swap Languages"
          >
            <ArrowUpDown className="w-4 h-4 text-blue-600" />
            <span>Swap Translation Direction</span>
          </button>
        </div>

        {/* Offline Pack Status Badge */}
        <div className="mt-8 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Offline Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-xs text-emerald-700">Language packs downloaded ({patientLang.name} & {doctorLang.name})</div>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6">
        <button
          onClick={() => onNavigate('patient_translation')}
          className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <span>Continue</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
};
