import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const url = 'https://ztalwfvpxcfnjdxxszxg.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0YWx3ZnZweGNmbmpkeHhzenhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDg0NDQsImV4cCI6MjEwNjc4NDQ0NH0.D-Rj2CT4M27DYBWhe9RXtSVJakZ3gFXFOfny43wcWhs';

const supabase = createClient(url, anonKey);

async function testInsertWithUserId() {
  console.log('--- Testing insert with dummy user_id UUID ---');
  const payload = {
    user_id: crypto.randomUUID(),
    patient_name: 'Rajesh Kumar (Success Test)',
    age: '42',
    blood_group: 'B+',
    allergies: 'Penicillin, Sulfa drugs',
    current_medicines: 'Metformin 500mg',
    emergency_contact: '+91 9876543210'
  };
  const res = await supabase.from('patient_profiles').insert([payload]).select();
  console.log('Result:', JSON.stringify(res, null, 2));
}

testInsertWithUserId();
