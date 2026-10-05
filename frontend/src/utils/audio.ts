/**
 * Audio synthesis helper using Web Speech API with fallback
 */
export function playTextToSpeech(
  text: string,
  lang: string = 'en-US',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onStart) onStart();
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 1500);
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Normalize language codes
    const code = lang.toLowerCase();
    if (code.startsWith('hi') || code === 'hindi') {
      utterance.lang = 'hi-IN';
    } else if (code.startsWith('en') || code === 'english') {
      utterance.lang = 'en-US';
    } else if (code.startsWith('bn') || code === 'bengali') {
      utterance.lang = 'bn-IN';
    } else if (code.startsWith('ta') || code === 'tamil') {
      utterance.lang = 'ta-IN';
    } else if (code.startsWith('te') || code === 'telugu') {
      utterance.lang = 'te-IN';
    } else if (code.startsWith('mr') || code === 'marathi') {
      utterance.lang = 'mr-IN';
    } else if (code.startsWith('gu') || code === 'gujarati') {
      utterance.lang = 'gu-IN';
    } else if (code.startsWith('pa') || code === 'punjabi') {
      utterance.lang = 'pa-IN';
    } else if (code.startsWith('es') || code === 'spanish') {
      utterance.lang = 'es-ES';
    } else if (code.startsWith('fr') || code === 'french') {
      utterance.lang = 'fr-FR';
    } else if (code.startsWith('ar') || code === 'arabic') {
      utterance.lang = 'ar-SA';
    } else if (code.startsWith('ur') || code === 'urdu') {
      utterance.lang = 'ur-PK';
    } else {
      utterance.lang = lang;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (onStart) {
      utterance.onstart = () => onStart();
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
    if (onStart) onStart();
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 1500);
    return false;
  }
}

export function stopTextToSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
