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
    join,
    resolve
} from 'path';
import {
    readFileSync
} from 'fs';

// Get the directory path
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Initialize environment variables
config({ path: resolve(__dirname, '../../.env') });

// Read translation files
const en = JSON.parse(readFileSync(join(__dirname, '../locales/en.json'), 'utf8'));
const zh = JSON.parse(readFileSync(join(__dirname, '../locales/zh.json'), 'utf8'));
const vi = JSON.parse(readFileSync(join(__dirname, '../locales/vi.json'), 'utf8'));

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Reset sequence for a table
const resetSequence = async (tableName) => {
    const { error } = await supabase.rpc('alter_sequence', { sequence_name: `${tableName}_id_seq` });
    if (error) {
        console.error(`Error resetting sequence for ${tableName}:`, error);
        return false;
    }
    return true;
};

// Flatten nested translations
const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

const migrateTranslations = async () => {
    console.log('Migrating translations...');

    // Clear existing translations
    const {
        error: deleteError
    } = await supabase
        .from('translations')
        .delete()
        .neq('id', 0); // This deletes all rows

    if (deleteError) {
        console.error('Error clearing translations:', deleteError);
        return;
    }
    console.log('✓ Cleared existing translations');

    // Reset sequence
    const sequenceReset = await resetSequence('translations');
    if (!sequenceReset) return;
    console.log('✓ Reset translations sequence');

    // Flatten translations
    const flatEn = flattenObject(en);
    const flatZh = flattenObject(zh);
    const flatVi = flattenObject(vi);

    // Create translation records
    const translations = Object.keys(flatEn).map(key => ({
        key,
        en: flatEn[key],
        zh: flatZh[key] || flatEn[key], // Fallback to English if Chinese translation is missing
        vi: flatVi[key] || flatEn[key] // Fallback to English if Vietnamese translation is missing
    }));

    // Insert new translations
    const {
        error: insertError
    } = await supabase
        .from('translations')
        .insert(translations);

    if (insertError) {
        console.error('Error migrating translations:', insertError);
        return;
    }

    console.log('✅ Translations migrated successfully');
};

// Run the migration
migrateTranslations().catch(console.error);