import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  Keyboard,
  Activity,
  ArrowLeft,
  Stethoscope,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Pill,
  Clock,
  Radio
} from 'lucide-react';
import { ScreenId, Language } from '../../types';
import { playTextToSpeech, stopTextToSpeech } from '../../utils/audio';

interface DoctorReplyScreenProps {
  onNavigate: (screen: ScreenId) => void;
  patientLang: Language;
  doctorLang: Language;
}

// Doctor clinical question templates with multi-language patient translations
const DOCTOR_TEMPLATES = [
  {
    id: 'medicine',
    questionEn: 'Have you taken any medicine today?',
    questionHi: 'क्या आपने आज कोई दवा ली है?',
    translations: {
      hi: 'क्या आपने आज कोई दवा ली है?',
      bn: 'আপনি কি আজ কোনো ওষুধ খেয়েছেন?',
      ta: 'இன்று ஏதேனும் மருந்து சாப்பிட்டீர்களா?',
      te: 'మీరు ఈ రోజు ఏదైనా మందు తీసుకున్నారా?',
      mr: 'तुम्ही आज कोणतेही औषध घेतले आहे का?',
      gu: 'શું તમે આજે કોઈ દવા લીધી છે?',
      pa: 'ਕੀ ਤੁਸੀਂ ਅੱਜ ਕੋਈ ਦਵਾਈ ਲਈ ਹੈ?',
      es: '¿Ha tomado algún medicamento hoy?',
      ar: 'هل تناولت أي دواء اليوم؟',
      fr: 'Avez-vous pris des médicaments aujourd’hui ?',
      ur: 'کیا آپ نے آج کوئی دوا لی ہے؟',
      en: 'Have you taken any medicine today?'
    }
  },
  {
    id: 'location',
    questionEn: 'Where exactly does it hurt the most?',
    questionHi: 'आपको ठीक कहां सबसे ज्यादा दर्द हो रहा है?',
    translations: {
      hi: 'आपको ठीक कहां सबसे ज्यादा दर्द हो रहा है?',
      bn: 'আপনার ঠিক কোথায় সবচেয়ে বেশি ব্যথা করছে?',
      ta: 'சரியாக எங்கு மிகவும் வலிக்கிறது?',
      te: 'సరిగ్గా ఎక్కడ చాలా నొప్పిగా ఉంది?',
      mr: 'नेमके कुठे सर्वात जास्त दुखत आहे?',
      gu: 'તમને બરાબર ક્યાં સૌથી વધુ દુખાવો થાય છે?',
      pa: 'ਤੁਹਾਨੂੰ ਬਿਲਕੁਲ ਕਿੱਥੇ ਸਭ ਤੋਂ ਵੱਧ ਦਰਦ ਹੋ ਰਿਹਾ ਹੈ?',
      es: '¿Dónde le duele exactamente más?',
      ar: 'أين يؤلمك بالتحديد أكثر؟',
      fr: 'Où avez-vous le plus mal exactement ?',
      ur: 'آپ کو بالکل کہاں سب سے زیادہ درد ہو رہا ہے؟',
      en: 'Where exactly does it hurt the most?'
    }
  },
  {
    id: 'oxygen',
    questionEn: 'Please take deep breaths. We are starting oxygen support now.',
    questionHi: 'कृपया गहरी सांस लें। हम अभी ऑक्सीजन सपोर्ट शुरू कर रहे हैं।',
    translations: {
      hi: 'कृपया गहरी सांस लें। हम अभी ऑक्सीजन सपोर्ट शुरू कर रहे हैं।',
      bn: 'দয়া করে গভীর শ্বাস নিন। আমরা এখনই অক্সিজেন সাপোর্ট শুরু করছি।',
      ta: 'தயவுசெய்து ஆழமாக மூச்சு விடுங்கள். நாங்கள் இப்போது ஆக்ஸிஜன் ஆதரவைத் தொடங்குகிறோம்.',
      te: 'దయచేసి లోతైన శ్వాస తీసుకోండి. మేము ఇప్పుడు ఆక్సిజన్ సపోర్ట్ ప్రారంభిస్తున్నాము.',
      mr: 'कृपया दीर्घ श्वास घ्या. आम्ही आता ऑक्सिजन सपोर्ट सुरू करत आहोत.',
      gu: 'કૃપા કરીને ઊંડા શ્વાસ લો. અમે હમણાં જ ઓક્સિજન સપોર્ટ શરૂ કરી રહ્યા છીએ.',
      pa: 'ਕਿਰਪਾ ਕਰਕੇ ਲੰਮਾ ਸਾਹ ਲਓ। ਅਸੀਂ ਹੁਣੇ ਆਕਸੀਜਨ ਸਹਾਇਤਾ ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ।',
      es: 'Por favor respire hondo. Estamos iniciando el soporte de oxígeno ahora.',
      ar: 'يرجى أخذ أنفاس عميقة. نحن نبدأ دعم الأكسجين الآن.',
      fr: 'Veuillez respirer profondément. Nous commençons l’assistance en oxygène maintenant.',
      ur: 'براہ کرم گہرے سانس لیں۔ ہم ابھی آکسیجن سپورٹ شروع کر رہے ہیں۔',
      en: 'Please take deep breaths. We are starting oxygen support now.'
    }
  },
  {
    id: 'calm',
    questionEn: 'Stay calm. You are in safe hands, help is right here.',
    questionHi: 'शांत रहें। आप सुरक्षित हाथों में हैं, डॉक्टर यहीं हैं।',
    translations: {
      hi: 'शांत रहें। आप सुरक्षित हाथों में हैं, डॉक्टर यहीं हैं।',
      bn: 'শান্ত থাকুন। আপনি নিরাপদ হাতে আছেন, ডাক্তার এখানেই আছেন।',
      ta: 'அமைதியாக இருங்கள். நீங்கள் பாதுகாப்பான கைகளில் உள்ளீர்கள்.',
      te: 'ప్రశాంతంగా ఉండండి. మీరు సురక్షితమైన చేతుల్లో ఉన్నారు.',
      mr: 'शांत राहा. आपण सुरक्षित हातात आहात, डॉक्टर इथेच आहेत.',
      gu: 'શાંત રહો. તમે સુરક્ષિત હાથોમાં છો, ડૉક્ટર અહીં જ છે.',
      pa: 'ਸ਼ਾਂਤ ਰਹੋ। ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੱਥਾਂ ਵਿੱਚ ਹੋ, ਡਾਕਟਰ ਇੱਥੇ ਹਨ।',
      es: 'Mantenga la calma. Está en buenas manos, la ayuda está aquí.',
      ar: 'ابق هادئا. أنت في أيد أمينة، المساعدة هنا.',
      fr: 'Restez calme. Vous êtes entre de bonnes mains, l’aide est là.',
      ur: 'پرسکون رہیں۔ آپ محفوظ ہاتھوں میں ہیں، ڈاکٹر یہیں موجود ہیں۔',
      en: 'Stay calm. You are in safe hands, help is right here.'
    }
  }
];

export const DoctorReplyScreen: React.FC<DoctorReplyScreenProps> = ({
  onNavigate,
  patientLang,
  doctorLang
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingPatientAudio, setIsPlayingPatientAudio] = useState(false);
  const [isPlayingDoctorAudio, setIsPlayingDoctorAudio] = useState(false);
  const [isTypingMode, setIsTypingMode] = useState(false);

  // Selected template or custom input
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('medicine');
  const [doctorQuestion, setDoctorQuestion] = useState<string>(DOCTOR_TEMPLATES[0].questionEn);
  const [translatedPatientText, setTranslatedPatientText] = useState<string>('');

  // Update translation whenever patientLang or question changes
  useEffect(() => {
    const currentTemplate = DOCTOR_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (currentTemplate) {
      const transMap = currentTemplate.translations as Record<string, string>;
      const match = transMap[patientLang.id] || transMap['hi'] || currentTemplate.questionEn;
      setTranslatedPatientText(match);
    } else {
      // Dynamic fallback for custom input
      setTranslatedPatientText(`(${patientLang.name}): ${doctorQuestion}`);
    }
  }, [patientLang, selectedTemplateId, doctorQuestion]);

  const handleSelectTemplate = (t: typeof DOCTOR_TEMPLATES[0]) => {
    setSelectedTemplateId(t.id);
    const q = doctorLang.id === 'hi' ? t.questionHi : t.questionEn;
    setDoctorQuestion(q);
  };

  const handlePlayPatientAudio = () => {
    if (isPlayingPatientAudio) {
      stopTextToSpeech();
      setIsPlayingPatientAudio(false);
      return;
    }
    playTextToSpeech(
      translatedPatientText,
      patientLang.id,
      () => setIsPlayingPatientAudio(true),
      () => setIsPlayingPatientAudio(false)
    );
  };

  const handlePlayDoctorAudio = () => {
    if (isPlayingDoctorAudio) {
      stopTextToSpeech();
      setIsPlayingDoctorAudio(false);
      return;
    }
    playTextToSpeech(
      doctorQuestion,
      doctorLang.id === 'hi' ? 'hi-IN' : 'en-US',
      () => setIsPlayingDoctorAudio(true),
      () => setIsPlayingDoctorAudio(false)
    );
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-4 sm:p-5 bg-slate-50 relative overflow-y-auto">
      <div>
        {/* Web Tool Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Doctor Clinical Response
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Clinician Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Doctor speaks in <span className="font-bold text-slate-700">{doctorLang.name}</span> &rarr; renders translated voice for Patient in <span className="font-bold text-blue-700">{patientLang.name} ({patientLang.nativeName})</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('patient_translation')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Speech</span>
            </button>
          </div>
        </div>

        {/* Quick Clinical Doctor Questions (One-Tap Pills) */}
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-600 mb-1.5 block">
            Rapid Doctor Inquiries (Quick Clinical Commands):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DOCTOR_TEMPLATES.map((t) => {
              const isSelected = selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <p className="line-clamp-2">{doctorLang.id === 'hi' ? t.questionHi : t.questionEn}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor Input Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 pb-1.5 border-b border-slate-100">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>{doctorLang.flag}</span>
              <span>Doctor Input ({doctorLang.name})</span>
            </span>
            <button
              onClick={handlePlayDoctorAudio}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isPlayingDoctorAudio ? 'text-blue-600 animate-pulse' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Play question audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {isTypingMode ? (
            <textarea
              value={doctorQuestion}
              onChange={(e) => {
                setDoctorQuestion(e.target.value);
                setSelectedTemplateId('');
              }}
              rows={2}
              className="w-full text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl p-2 border border-slate-200 resize-none leading-relaxed"
              placeholder="Type doctor's inquiry..."
            />
          ) : (
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed min-h-[50px] flex items-center py-1">
              "{doctorQuestion}"
            </div>
          )}

          {/* Audio Waveform Graphic */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-1">
              {[30, 60, 85, 45, 95, 40, 70, 50, 30].map((h, i) => (
                <span
                  key={i}
                  style={{ height: isRecording ? `${h}%` : `${Math.max(20, h * 0.4)}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">00:03</span>
          </div>
        </div>

        {/* Center Mic Action Section */}
        <div className="flex items-center justify-center my-3">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/25 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-blue-500/15 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                onClick={handleToggleRecord}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 shadow-red-600/35 ring-4 ring-red-200'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                }`}
                title="Tap to speak"
              >
                <Mic className="w-8 h-8" />
              </button>
            </div>

            <span className="text-xs font-bold text-slate-700 mt-2">
              {isRecording ? 'Listening Doctor Voice...' : `Tap to Speak (${doctorLang.name})`}
            </span>
          </div>
        </div>

        {/* Translated Output Card for the Patient */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-300/80 rounded-2xl shadow-xs mt-2">
          <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-2 pb-1.5 border-b border-emerald-200">
            <div className="flex items-center gap-1.5">
              <span>{patientLang.flag}</span>
              <span>
                Translated for Patient in {patientLang.name} ({patientLang.nativeName})
              </span>
            </div>

            <button
              onClick={handlePlayPatientAudio}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlayingPatientAudio
                  ? 'bg-emerald-600 text-white animate-pulse shadow-xs'
                  : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Play Patient Audio"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingPatientAudio ? 'Playing...' : 'Speak to Patient'}</span>
            </button>
          </div>

          <p className="text-slate-950 font-bold text-base sm:text-lg leading-snug">
            {translatedPatientText}
          </p>
        </div>

        {/* Doctor Quick Prescriptions / Guidance Quick Link */}
        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800">Need to prescribe medication?</span>
            <div className="text-[11px] text-slate-400">
              Provide tablet, syrup & dosage schedule in patient's language
            </div>
          </div>
          <button
            onClick={() => onNavigate('medicine')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Dosage &rarr;
          </button>
        </div>
      </div>

      {/* Navigation Shortcuts Bar at Screen Bottom */}
      <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-200 mt-4">
        <button
          onClick={() => onNavigate('patient_translation')}
          className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>&larr; Patient Translation</span>
        </button>
        <button
          onClick={() => onNavigate('history')}
          className="py-2 px-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>History</span>
        </button>
      </div>
    </div>
  );
};
