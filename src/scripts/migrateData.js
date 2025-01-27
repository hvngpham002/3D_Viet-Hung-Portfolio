import {
    config
} from 'dotenv';
import {
    createClient
} from '@supabase/supabase-js';
import {
    fileURLToPath
} from 'url';
import {
    dirname,
    join
} from 'path';
import {
    readFileSync
} from 'fs';

// Initialize environment variables
config();

// Get the directory path
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const experiences = JSON.parse(readFileSync(join(__dirname, '../data/experiences.json'), 'utf8'));
const skills = JSON.parse(readFileSync(join(__dirname, '../data/skills.json'), 'utf8'));
const projects = JSON.parse(readFileSync(join(__dirname, '../data/projects.json'), 'utf8'));
const homeInfo = JSON.parse(readFileSync(join(__dirname, '../data/homeInfo.json'), 'utf8'));

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const resetSequence = async (tableName) => {
    const {
        error
    } = await supabase.rpc('alter_sequence', {
        sequence_name: `${tableName}_id_seq`
    });
    if (error) {
        console.error(`Error resetting sequence for ${tableName}:`, error);
        return false;
    }
    return true;
};

const migrateExperiences = async () => {
    console.log('Migrating experiences...');

    // Clear existing data
    const {
        error: deleteError
    } = await supabase
        .from('experiences')
        .delete()
        .neq('id', 0); // This deletes all rows

    if (deleteError) {
        console.error('Error clearing experiences:', deleteError);
        return;
    }
    console.log('✓ Cleared existing experiences');

    // Reset sequence
    const sequenceReset = await resetSequence('experiences');
    if (!sequenceReset) return;
    console.log('✓ Reset experiences sequence');

    // Insert new data
    const {
        error: insertError
    } = await supabase
        .from('experiences')
        .insert(experiences);

    if (insertError) {
        console.error('Error migrating experiences:', insertError);
        return;
    }
    console.log('✅ Experiences migrated successfully');
};

const migrateSkills = async () => {
    console.log('Migrating skills...');

    // Clear existing data
    const {
        error: deleteError
    } = await supabase
        .from('skills')
        .delete()
        .neq('id', 0); // This deletes all rows

    if (deleteError) {
        console.error('Error clearing skills:', deleteError);
        return;
    }
    console.log('✓ Cleared existing skills');

    // Reset sequence
    const sequenceReset = await resetSequence('skills');
    if (!sequenceReset) return;
    console.log('✓ Reset skills sequence');

    // Insert new data
    const {
        error: insertError
    } = await supabase
        .from('skills')
        .insert(skills);

    if (insertError) {
        console.error('Error migrating skills:', insertError);
        return;
    }
    console.log('✅ Skills migrated successfully');
};

const migrateProjects = async () => {
    console.log('Migrating projects...');

    // Clear existing data
    const {
        error: deleteError
    } = await supabase
        .from('projects')
        .delete()
        .neq('id', 0); // This deletes all rows

    if (deleteError) {
        console.error('Error clearing projects:', deleteError);
        return;
    }
    console.log('✓ Cleared existing projects');

    // Reset sequence
    const sequenceReset = await resetSequence('projects');
    if (!sequenceReset) return;
    console.log('✓ Reset projects sequence');

    // Convert source_code to sourceCode in projects data
    const formattedProjects = projects.map(({
        source_code: sourceCodeOld,
        ...rest
    }) => ({
        ...rest,
        sourceCode: sourceCodeOld
    }));

    // Insert new data
    const {
        error: insertError
    } = await supabase
        .from('projects')
        .insert(formattedProjects);

    if (insertError) {
        console.error('Error migrating projects:', insertError);
        return;
    }
    console.log('✅ Projects migrated successfully');
};

const migrateHomeInfo = async () => {
    console.log('Migrating home info...');

    // Clear existing data
    const { error: deleteError } = await supabase
        .from('home_info')
        .delete()
        .neq('id', 0);

    if (deleteError) {
        console.error('Error clearing home info:', deleteError);
        return;
    }
    console.log('✓ Cleared existing home info');

    // Reset sequence
    const sequenceReset = await resetSequence('home_info');
    if (!sequenceReset) return;
    console.log('✓ Reset home info sequence');

    // Insert new data
    const { error: insertError } = await supabase
        .from('home_info')
        .insert(homeInfo);

    if (insertError) {
        console.error('Error migrating home info:', insertError);
        return;
    }
    console.log('✅ Home info migrated successfully');
};

const migrateAllData = async () => {
    try {
        await migrateExperiences();
        await migrateSkills();
        await migrateProjects();
        await migrateHomeInfo();
        console.log('🎉 All data migrated successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

// Run the migration
migrateAllData();