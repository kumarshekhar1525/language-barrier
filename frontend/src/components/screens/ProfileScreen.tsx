import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, ShieldCheck, Check, Save, Database, Key, AlertCircle, RefreshCw, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ScreenId, PatientProfile } from '../../types';
import {
  syncProfileToSupabase,
  fetchPatientProfilesFromSupabase,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  SUPABASE_SQL_SCHEMA
} from '../../utils/supabase';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenId) => void;
  profile: PatientProfile;
  onSaveProfile: (profile: PatientProfile) => void;
}

const BLOOD_GROUPS = ['Select', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<PatientProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseResult, setSupabaseResult] = useState<{ success: boolean; message: string } | null>(null);
  const [supabaseRecords, setSupabaseRecords] = useState<any[]>([]);

  // Inline Supabase key configuration state
  const [anonKeyInput, setAnonKeyInput] = useState('');
  const [isConfigured, setIsConfigured] = useState<boolean>(isSupabaseConfigured());
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);

  // Load existing records & configuration state on mount
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
    const config = getSupabaseConfig();
    if (config.anonKey && config.anonKey !== 'your-supabase-anon-key-here') {
      setAnonKeyInput(config.anonKey);
    }
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await fetchPatientProfilesFromSupabase();
      if (data && data.length > 0) {
        setSupabaseRecords(data);
      }
    } catch (e) {
      console.warn('Could not load patient profiles:', e);
    }
  };

  const handleSaveSupabaseKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonKeyInput.trim()) return;
    const currentConfig = getSupabaseConfig();
    const url = currentConfig.url || 'https://ztalwfvpxcfnjdxxszxg.supabase.co';
    saveSupabaseConfig(url, anonKeyInput.trim());
    setIsConfigured(isSupabaseConfigured());
    setSupabaseResult({
      success: true,
      message: '⚡ Supabase API Key saved! Ready to sync patient profiles.'
    });
    loadRecords();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    onSaveProfile(formData);

    // 1. Sync to Supabase directly from client
    const res = await syncProfileToSupabase(formData);
    setSupabaseResult(res);
    setIsSaved(true);
    setIsSyncing(false);

    // 2. Also attempt backend REST endpoint sync
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      // Backend optional
    }

    // 3. Refresh live database records list
    loadRecords();

    setTimeout(() => {
      setIsSaved(false);
    }, 5000);
  };

  const handleCopyRlsSql = () => {
    navigator.clipboard.writeText('ALTER TABLE public.patient_profiles DISABLE ROW LEVEL SECURITY;');
    setCopiedRlsSql(true);
    setTimeout(() => setCopiedRlsSql(false), 2500);
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-4 sm:p-5 bg-slate-50 relative overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('patient_translation')}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Profile</h2>
              <p className="text-xs text-slate-500">Clinical Record & Live Supabase Database Sync</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isConfigured ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 shadow-2xs">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Supabase Disconnected</span>
              </span>
            )}
          </div>
        </div>

        {/* SUPABASE KEY CONFIGURATION BANNER (Shown if key is missing) */}
        {!isConfigured && (
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl mb-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <h4 className="text-xs font-bold text-emerald-950">
                Connect Supabase Database for Live Patient Data Entry
              </h4>
            </div>
            <p className="text-[11px] text-emerald-800 mb-2.5 leading-relaxed">
              Paste your Supabase <code className="font-bold">Anon API Key</code> below to automatically sync every new patient entry to your Supabase cloud project (<code className="font-bold">ztalwfvpxcfnjdxxszxg.supabase.co</code>).
            </p>

            <form onSubmit={handleSaveSupabaseKey} className="flex gap-2">
              <div className="relative flex-1">
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={anonKeyInput}
                  onChange={(e) => setAnonKeyInput(e.target.value)}
                  placeholder="Paste Supabase Anon Key (eyJhbGci...)"
                  className="w-full pl-8 pr-3 py-2 text-xs font-mono bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Connect Key
              </button>
            </form>
          </div>
        )}

        {/* Profile Card / Header Avatar */}
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs mb-4 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              {formData.name || 'Add Patient Profile'}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved locally & auto-syncing to Supabase Cloud</span>
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <form id="profileForm" onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g. Rajesh Kumar"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Age & Blood Group Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age
              </label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="E.g. 42"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs cursor-pointer"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg === 'Select' ? '' : bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Known Allergies
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="E.g. Penicillin, Sulfa drugs"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Current Medicines */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Medicines
            </label>
            <input
              type="text"
              value={formData.currentMedicines}
              onChange={(e) => setFormData({ ...formData, currentMedicines: e.target.value })}
              placeholder="E.g. Metformin 500mg, Amlodipine 5mg"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>
        </form>

        {/* Sync Result Banner */}
        {supabaseResult && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold animate-fade-in ${
              supabaseResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {supabaseResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                <span>{supabaseResult.message}</span>

                {/* If RLS error is reported, show quick 1-click copy button */}
                {supabaseResult.message.includes('DISABLE ROW LEVEL SECURITY') && (
                  <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800">
                      Copy SQL command to run in Supabase SQL Editor:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRlsSql}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-amber-700 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedRlsSql ? 'Copied!' : 'Copy RLS Fix SQL'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Supabase Database Patient Records List */}
        {supabaseRecords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Live Table (`patient_profiles`) Records ({supabaseRecords.length})</span>
              </h4>
              <button
                type="button"
                onClick={loadRecords}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {supabaseRecords.map((rec, i) => (
                <div key={rec.id || i} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{rec.patient_name || rec.name}</span>
                    <span className="text-[11px] text-slate-500">
                      Age: {rec.age || 'N/A'} · Blood: {rec.blood_group || 'N/A'} · Allergies: {rec.allergies || 'None'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    Synced to Cloud
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <button
          type="submit"
          form="profileForm"
          disabled={isSyncing}
          className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-70"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Saving & Syncing to Supabase...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Profile Saved & Synced!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Patient Profile & Sync to Supabase</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

