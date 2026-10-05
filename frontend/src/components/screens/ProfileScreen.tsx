import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, ShieldCheck, Check, Heart, Save } from 'lucide-react';
import { ScreenId, PatientProfile } from '../../types';
import { INITIAL_PATIENT_PROFILE } from '../../data/mockData';
import { syncProfileToSupabase, fetchPatientProfilesFromSupabase } from '../../utils/supabase';

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
  const [supabaseSynced, setSupabaseSynced] = useState<boolean | null>(null);
  const [supabaseRecords, setSupabaseRecords] = useState<any[]>([]);

  // Load existing records from Supabase on mount
  React.useEffect(() => {
    fetchPatientProfilesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setSupabaseRecords(data);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    const synced = await syncProfileToSupabase(formData);
    setSupabaseSynced(synced);
    setIsSaved(true);

    // Refresh records list from Supabase
    fetchPatientProfilesFromSupabase().then((data) => {
      setSupabaseRecords(data);
    });

    setTimeout(() => {
      setIsSaved(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-5 bg-slate-50 relative overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onNavigate('patient_translation')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Profile</h2>
            <p className="text-xs text-slate-500">Save important information</p>
          </div>
        </div>

        {/* Profile Card / Header Avatar */}
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs mb-5 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {formData.name || 'Add Patient Profile'}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Offline, saved on device</span>
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <form id="profileForm" onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
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
                placeholder="Enter age"
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
              placeholder="E.g. Penicillin"
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
              placeholder="E.g. Diabetes, BP"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>
        </form>

        {isSaved && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-xs font-semibold animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Patient Profile Saved!{' '}
                {supabaseSynced
                  ? '⚡ Live Synced to Supabase (patient_profiles table)'
                  : '💾 Saved locally'}
              </span>
            </div>
          </div>
        )}

        {/* Live Supabase Database Patient Records */}
        {supabaseRecords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Live Patients Database ({supabaseRecords.length})</span>
              </h4>
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
                    Synced
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
          className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Saved Profile</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
