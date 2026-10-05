import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Key,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Code
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA
} from '../utils/supabase';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql'>('connect');

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url.includes('your-supabase-project') ? '' : config.url);
      setAnonKey(config.anonKey === 'your-supabase-anon-key-here' ? '' : config.anonKey);
      if (isSupabaseConfigured()) {
        setStatus('success');
        setStatusMessage('Connected to Supabase cloud database!');
      } else {
        setStatus('idle');
        setStatusMessage('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatus('error');
      setStatusMessage('Please enter both Supabase URL and Anon API key.');
      return;
    }

    setStatus('testing');
    setStatusMessage('Connecting to Supabase...');

    const res = await testSupabaseConnection(url, anonKey);
    if (res.success) {
      saveSupabaseConfig(url, anonKey);
      setStatus('success');
      setStatusMessage(res.message);
    } else {
      setStatus('error');
      setStatusMessage(res.message);
    }
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setStatus('idle');
    setStatusMessage('Supabase configuration reset.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Supabase Integration Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  Cloud DB
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Directly attach your Supabase project URL & API keys for instant cloud database sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-100/50 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'connect'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Connect & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'sql'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-600" />
            <span>Supabase SQL Schema</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'connect' ? (
            <>
              {/* Direct Supabase Console Link Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Direct Link to Supabase Dashboard
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      https://supabase.com/dashboard
                    </span>
                  </div>
                </div>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Status Message Alert */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    status === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : status === 'error'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-spin" />
                  )}
                  <span className="font-semibold text-xs leading-relaxed">{statusMessage}</span>
                </div>
              )}

              {/* Supabase Form */}
              <form onSubmit={handleTestAndSave} className="space-y-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-project-id.supabase.co"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supabase Anon / Public API Key
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={anonKey}
                      onChange={(e) => setAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={status === 'testing'}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'testing' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Supabase Key...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save & Connect Supabase</span>
                      </>
                    )}
                  </button>

                  {isSupabaseConfigured() && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold transition-all cursor-pointer"
                      title="Clear saved keys"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <>
              {/* SQL Schema Copy Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Supabase Database Tables Script</h4>
                  <p className="text-xs text-slate-500">
                    Run this SQL in Supabase SQL Editor to create <code className="text-emerald-700 font-bold">translation_logs</code>, <code className="text-emerald-700 font-bold">patient_profiles</code> & <code className="text-emerald-700 font-bold">triage_records</code>.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Script</span>
                    </>
                  )}
                </button>
              </div>

              {/* SQL Code Block */}
              <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Ready to execute in Supabase?</span>
                <a
                  href="https://supabase.com/dashboard/project/_/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <span>Open Supabase SQL Editor &rarr;</span>
                </a>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase SSL Encrypted Integration</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
