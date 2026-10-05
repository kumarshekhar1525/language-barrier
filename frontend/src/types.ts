export type ScreenId =
  | 'splash'
  | 'languages'
  | 'patient_translation'
  | 'doctor_reply'
  | 'symptoms'
  | 'body_map'
  | 'emergency'
  | 'medicine'
  | 'history'
  | 'profile';

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  isDownloaded: boolean;
  size: string;
}

export interface SymptomItem {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  isCritical?: boolean;
}

export interface PainPoint {
  id: string;
  name: string;
  hindiName: string;
  x: number; // percentage
  y: number; // percentage
  view: 'front' | 'back' | 'both';
}

export type PainSeverity = 'mild' | 'moderate' | 'severe';

export interface EmergencyAction {
  id: string;
  title: string;
  hindiTitle: string;
  iconName: string;
  detail: string;
  hindiDetail: string;
  criticalGrade: 'immediate' | 'high';
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  text: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
  audioActive?: boolean;
}

export interface PatientProfile {
  name: string;
  age: string;
  bloodGroup: string;
  allergies: string;
  currentMedicines: string;
  emergencyContact?: string;
}

export type DosageType = 'tablet' | 'syrup' | 'injection' | 'inhaler';

export interface MedicineInstruction {
  dosageType: DosageType;
  englishInstruction: string;
  hindiInstruction: string;
  schedule: string;
  duration: string;
}
