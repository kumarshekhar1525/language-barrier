import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-supabase-project-id.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-supabase-project-id')) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Connected to Supabase Cloud Database');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase client:', err.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// 1. Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Hear2Heal Medical Translation API Server',
    supabaseConnected: Boolean(supabase),
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'POST /api/translate',
      'POST /api/triage',
      'POST /api/profile',
      'GET /api/history'
    ]
  });
});

// 2. Health Check Route
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  if (supabase) {
    try {
      const { error } = await supabase.from('translation_logs').select('count', { count: 'exact', head: true });
      dbStatus = error && error.code !== 'PGRST116' ? `error: ${error.message}` : 'connected';
    } catch (e) {
      dbStatus = `failed: ${e.message}`;
    }
  }

  res.json({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    server: 'healthy'
  });
});

// 3. Save Translation Log API
app.post('/api/translate', async (req, res) => {
  const { sender, sourceLang, targetLang, sourceText, translatedText, triageLevel } = req.body;

  if (!sourceText || !translatedText) {
    return res.status(400).json({ error: 'sourceText and translatedText are required' });
  }

  const logEntry = {
    sender: sender || 'patient',
    source_language: sourceLang || 'Auto-Detect',
    target_language: targetLang || 'English',
    source_text: sourceText,
    translated_text: translatedText,
    triage_level: triageLevel || 'green',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('translation_logs').insert([logEntry]).select();
      if (error) {
        console.error('Supabase Error:', error.message);
        return res.status(500).json({ success: false, error: error.message, data: logEntry });
      }
      return res.json({ success: true, syncedToSupabase: true, data: data[0] });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message, data: logEntry });
    }
  }

  res.json({ success: true, syncedToSupabase: false, message: 'Saved locally (Supabase keys pending)', data: logEntry });
});

// 4. Save Emergency Triage API
app.post('/api/triage', async (req, res) => {
  const { conditionTitle, triageGrade, symptoms, clinicalNote } = req.body;

  const record = {
    condition_title: conditionTitle || 'Emergency Alert',
    triage_grade: triageGrade || 'red',
    symptoms: symptoms || [],
    clinical_note: clinicalNote || 'Immediate resuscitation protocol triggered',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('triage_records').insert([record]).select();
      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.json({ success: true, syncedToSupabase: true, data: data[0] });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  res.json({ success: true, syncedToSupabase: false, data: record });
});

// 5. Save Patient Profile API
app.post('/api/profile', async (req, res) => {
  const { name, age, bloodGroup, allergies, currentMedicines, emergencyContact } = req.body;

  const profile = {
    patient_name: name || 'Anonymous Patient',
    age: age || '',
    blood_group: bloodGroup || '',
    allergies: allergies || '',
    current_medicines: currentMedicines || '',
    emergency_contact: emergencyContact || '',
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('patient_profiles').insert([profile]).select();
      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.json({ success: true, syncedToSupabase: true, data: data[0] });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  res.json({ success: true, syncedToSupabase: false, data: profile });
});

// 6. Fetch Translation History API
app.get('/api/history', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('translation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, logs: data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.json({ success: true, logs: [], message: 'Supabase client not connected' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Hear2Heal Backend API Server running on http://localhost:${PORT}`);
});
