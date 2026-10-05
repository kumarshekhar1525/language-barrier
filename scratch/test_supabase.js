import { createClient } from '@supabase/supabase-js';

const url = 'https://ztalwfvpxcfnjdxxszxg.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0YWx3ZnZweGNmbmpkeHhzenhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDg0NDQsImV4cCI6MjEwNjc4NDQ0NH0.D-Rj2CT4M27DYBWhe9RXtSVJakZ3gFXFOfny43wcWhs';

const supabase = createClient(url, anonKey);

async function testInsert() {
  console.log('Testing Supabase insert to patient_profiles table...');
  const { data, error } = await supabase
    .from('patient_profiles')
    .insert([
      {
        patient_name: 'Rajesh Kumar (Test)',
        age: '42',
        blood_group: 'B+',
        allergies: 'Penicillin, Sulfa drugs',
        current_medicines: 'Metformin 500mg, Amlodipine 5mg',
        emergency_contact: '+91 9876543210'
      }
    ])
    .select();

  if (error) {
    console.error('❌ Insert Error:', error);
  } else {
    console.log('✅ Insert Successful! Data:', data);
  }
}

testInsert();
