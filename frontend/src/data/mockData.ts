import {
  Language,
  SymptomItem,
  EmergencyAction,
  ChatMessage,
  MedicineInstruction,
  PatientProfile,
  DosageType
} from '../types';

export const LANGUAGES: Language[] = [
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isDownloaded: true, size: '28 MB' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isDownloaded: true, size: '32 MB' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', isDownloaded: true, size: '25 MB' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isDownloaded: true, size: '26 MB' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isDownloaded: true, size: '27 MB' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isDownloaded: true, size: '26 MB' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isDownloaded: true, size: '24 MB' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', isDownloaded: true, size: '25 MB' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isDownloaded: true, size: '26 MB' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isDownloaded: true, size: '30 MB' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isDownloaded: false, size: '24 MB' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isDownloaded: true, size: '27 MB' }
];

export const SYMPTOMS_LIST: SymptomItem[] = [
  {
    id: 'fever',
    name: 'Fever',
    hindiName: 'बुखार',
    iconName: 'Thermometer',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-950',
    iconColor: 'text-orange-500'
  },
  {
    id: 'cough',
    name: 'Cough',
    hindiName: 'खांसी',
    iconName: 'Wind',
    bgColor: 'bg-sky-50 hover:bg-sky-100',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-950',
    iconColor: 'text-sky-500'
  },
  {
    id: 'breathing',
    name: 'Breathing Difficulty',
    hindiName: 'सांस लेने में दिक्कत',
    iconName: 'Lungs',
    bgColor: 'bg-rose-50 hover:bg-rose-100',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-950',
    iconColor: 'text-rose-500',
    isCritical: true
  },
  {
    id: 'chest_pain',
    name: 'Chest Pain',
    hindiName: 'सीने में दर्द',
    iconName: 'HeartPulse',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-950',
    iconColor: 'text-red-500',
    isCritical: true
  },
  {
    id: 'headache',
    name: 'Headache',
    hindiName: 'सिरदर्द',
    iconName: 'Brain',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-950',
    iconColor: 'text-purple-500'
  },
  {
    id: 'stomach_pain',
    name: 'Stomach Pain',
    hindiName: 'पेट दर्द',
    iconName: 'Apple',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-950',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'vomiting',
    name: 'Vomiting',
    hindiName: 'उल्टी',
    iconName: 'AlertCircle',
    bgColor: 'bg-lime-50 hover:bg-lime-100',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-950',
    iconColor: 'text-lime-600'
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    hindiName: 'चक्कर आना',
    iconName: 'Compass',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-950',
    iconColor: 'text-amber-500'
  }
];

export const EMERGENCY_ACTIONS: EmergencyAction[] = [
  {
    id: 'cant_breathe',
    title: "I can't breathe",
    hindiTitle: "मुझे सांस नहीं आ रही है",
    iconName: 'Lungs',
    detail: "Severe respiratory distress / choking",
    hindiDetail: "गंभीर सांस की तकलीफ",
    criticalGrade: 'immediate'
  },
  {
    id: 'chest_pain',
    title: 'Severe chest pain',
    hindiTitle: 'सीने में बहुत तेज दर्द',
    iconName: 'HeartCrack',
    detail: "Crushing chest pressure, possible cardiac event",
    hindiDetail: "दिल का दौरा या तीव्र सीने में खिंचाव",
    criticalGrade: 'immediate'
  },
  {
    id: 'bleeding',
    title: 'Severe bleeding',
    hindiTitle: 'बहुत खून बह रहा है',
    iconName: 'Droplets',
    detail: "Heavy uncontrolled hemorrhage / trauma",
    hindiDetail: "अनियंत्रित रक्तस्राव",
    criticalGrade: 'immediate'
  },
  {
    id: 'unconscious',
    title: 'Unconscious',
    hindiTitle: 'बेहोश / चेतना खो दी',
    iconName: 'UserX',
    detail: "Patient unresponsive or collapsed",
    hindiDetail: "मरीज प्रतिक्रिया नहीं दे रहा है",
    criticalGrade: 'immediate'
  },
  {
    id: 'allergy',
    title: 'Allergic reaction',
    hindiTitle: 'गंभीर एलर्जी रिएक्शन',
    iconName: 'AlertTriangle',
    detail: "Anaphylaxis, swelling, rash, airway closing",
    hindiDetail: "अचानक सूजन और एलर्जी शॉक",
    criticalGrade: 'high'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy emergency',
    hindiTitle: 'गर्भावस्था आपातकाल',
    iconName: 'Baby',
    detail: "Severe abdominal labor pain, bleeding during pregnancy",
    hindiDetail: "गर्भावस्था में अत्यधिक दर्द या रक्तस्राव",
    criticalGrade: 'immediate'
  }
];

export const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'patient',
    text: 'मुझे बुखार है।',
    translatedText: 'I have a fever.',
    sourceLang: 'Hindi',
    targetLang: 'English',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-2',
    sender: 'doctor',
    text: 'Do you have cough?',
    translatedText: 'क्या आपको खांसी है?',
    sourceLang: 'English',
    targetLang: 'Hindi',
    timestamp: '10:31 AM'
  },
  {
    id: 'msg-3',
    sender: 'patient',
    text: 'हाँ, खांसी है।',
    translatedText: 'Yes, I have cough.',
    sourceLang: 'Hindi',
    targetLang: 'English',
    timestamp: '10:31 AM'
  },
  {
    id: 'msg-4',
    sender: 'doctor',
    text: 'Take this medicine after food.',
    translatedText: 'यह दवा खाना खाने के बाद लें।',
    sourceLang: 'English',
    targetLang: 'Hindi',
    timestamp: '10:32 AM'
  }
];

export const MEDICINE_PRESCRIPTIONS: Record<DosageType, MedicineInstruction> = {
  tablet: {
    dosageType: 'tablet',
    englishInstruction: 'Take 1 tablet after food twice a day for 5 days.',
    hindiInstruction: 'इस दवा की 1 गोली खाना खाने के बाद दिन में दो बार, 5 दिनों तक लें।',
    schedule: 'Twice daily after meals',
    duration: '5 Days'
  },
  syrup: {
    dosageType: 'syrup',
    englishInstruction: 'Take 10ml syrup after dinner before sleeping for 7 days.',
    hindiInstruction: 'रात के खाने के बाद सोने से पहले 10ml सिरप 7 दिनों तक पिएं।',
    schedule: 'Once daily at bedtime',
    duration: '7 Days'
  },
  injection: {
    dosageType: 'injection',
    englishInstruction: '1 subcutaneous injection administered once every 24 hours.',
    hindiInstruction: 'हर 24 घंटे में एक बार 1 इंजेक्शन त्वचा के नीचे लगाएं।',
    schedule: 'Every 24 hours',
    duration: '3 Days'
  },
  inhaler: {
    dosageType: 'inhaler',
    englishInstruction: 'Inhale 2 puffs when experiencing shortness of breath or every 8 hours.',
    hindiInstruction: 'सांस फूलने पर या हर 8 घंटे में इनहेलर के 2 पफ अंदर खींचें।',
    schedule: '2 Puffs as needed / 8 hrs',
    duration: 'As needed'
  }
};

export const INITIAL_PATIENT_PROFILE: PatientProfile = {
  name: 'Rajesh Kumar',
  age: '42',
  bloodGroup: 'B+',
  allergies: 'Penicillin, Sulfa drugs',
  currentMedicines: 'Metformin 500mg, Amlodipine 5mg',
  emergencyContact: '+91 98765 43210'
};
