import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Initialize environment variables
config();

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const experiences = JSON.parse(readFileSync(join(__dirname, '../data/experiences.json'), 'utf8'));
const skills = JSON.parse(readFileSync(join(__dirname, '../data/skills.json'), 'utf8'));
const projects = JSON.parse(readFileSync(join(__dirname, '../data/projects.json'), 'utf8'));

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrateExperiences = async () => {
  console.log('Migrating experiences...');
  const { error } = await supabase
    .from('experiences')
    .insert(experiences);
  
  if (error) {
    console.error('Error migrating experiences:', error);
    return;
  }
  console.log('✅ Experiences migrated successfully');
};

const migrateSkills = async () => {
  console.log('Migrating skills...');
  const { error } = await supabase
    .from('skills')
    .insert(skills);
  
  if (error) {
    console.error('Error migrating skills:', error);
    return;
  }
  console.log('✅ Skills migrated successfully');
};

const migrateProjects = async () => {
  console.log('Migrating projects...');
  // Convert source_code to sourceCode in projects data
  const formattedProjects = projects.map(({ source_code: sourceCodeOld, ...rest }) => ({
    ...rest,
    sourceCode: sourceCodeOld
  }));
  
  const { error } = await supabase
    .from('projects')
    .insert(formattedProjects);
  
  if (error) {
    console.error('Error migrating projects:', error);
    return;
  }
  console.log('✅ Projects migrated successfully');
};

const migrateAllData = async () => {
  try {
    await migrateExperiences();
    await migrateSkills();
    await migrateProjects();
    console.log('🎉 All data migrated successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Run the migration
migrateAllData(); 