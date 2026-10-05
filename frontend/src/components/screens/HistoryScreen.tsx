import React, { useState } from 'react';
import { ArrowLeft, User, UserCheck, Volume2, Trash2, RotateCcw } from 'lucide-react';
import { ScreenId, ChatMessage } from '../../types';
import { INITIAL_CONVERSATION } from '../../data/mockData';
import { playTextToSpeech, stopTextToSpeech } from '../../utils/audio';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const handlePlayAudio = (msg: ChatMessage) => {
    if (activePlayingId === msg.id) {
      stopTextToSpeech();
      setActivePlayingId(null);
      return;
    }

    const langCode = msg.sourceLang === 'Hindi' ? 'hi-IN' : 'en-US';
    setActivePlayingId(msg.id);
    
    playTextToSpeech(
      msg.text,
      langCode,
      undefined,
      () => setActivePlayingId(null)
    );
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleRestoreHistory = () => {
    setMessages(INITIAL_CONVERSATION);
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-5 bg-slate-50 relative">
      <div className="flex-1 flex flex-col">
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
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Conversation History</h2>
          </div>

          {messages.length === 0 && (
            <button
              onClick={handleRestoreHistory}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Message List */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">History cleared</p>
            <p className="text-xs text-slate-400 mt-1">Tap reset above to reload dialogue history</p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
            {messages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              const isPlaying = activePlayingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${
                          isPatient ? 'bg-blue-600' : 'bg-indigo-600'
                        }`}
                      >
                        {isPatient ? <User className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {isPatient ? 'Patient (Hindi)' : 'Doctor (English)'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between pl-9">
                    <div className="pr-2">
                      <p className="text-sm font-medium text-slate-900">
                        {msg.text}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 italic">
                        &rarr; {msg.translatedText}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(msg)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isPlaying
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50'
                      }`}
                      title="Replay Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear History Button */}
      {messages.length > 0 && (
        <div className="pt-4">
          <button
            onClick={handleClearHistory}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
};
