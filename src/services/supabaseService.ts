import {
  experience,
  skill,
  project,
  homeInfo,
} from "../types/supabase";
import getSupabase from "../lib/supabaseClient";

const supabase = getSupabase();

// Experiences
export const getExperiences = async (): Promise<experience[]> => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("year", { ascending: false });

  if (error) throw error;
  return data;
};

// Skills
export const getSkills = async (): Promise<skill[]> => {
  const { data, error } = await supabase
    .from("skills")
    .select("*");

  if (error) throw error;
  return data;
};

// Projects
export const getProjects = async (): Promise<project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*");

  if (error) throw error;
  return data;
};

// Translations
export const getTranslations = async () => {
  const { data, error } = await supabase
    .from("translations")
    .select("*");

  if (error) throw error;

  // Convert the flat array into a nested object structure for i18next
  const translations = data.reduce((acc: Record<string, Record<string, string>>, curr) => {
    if (!acc.en) acc.en = {};
    if (!acc.zh) acc.zh = {};
    if (!acc.vi) acc.vi = {};
    
    acc.en[curr.key] = curr.en;
    acc.zh[curr.key] = curr.zh;
    acc.vi[curr.key] = curr.vi;
    
    return acc;
  }, {});

  return translations;
};

// Initialize translations
export const initializeTranslations = async () => {
  try {
    const translations = await getTranslations();
    return translations;
  } catch (error) {
    console.error('Error loading translations:', error);
    return null;
  }
};

export const getHomeInfo = async (): Promise<homeInfo[]> => {
  const { data, error } = await supabase
    .from('home_info')
    .select('*')
    .order('stage', { ascending: true });

  if (error) {
    console.error('Error fetching home info:', error);
    throw new Error(error.message);
  }

  return data || [];
};
