import { supabase } from "../lib/supabaseClient";

export interface experience {
  id?: number;
  year: string;
  company: string;
  role: string;
  country: string;
  logo: string;
  points: string[];
}

export interface skill {
  id?: number;
  name: string;
  icon: string;
}

export interface project {
  id?: number;
  images: string[];
  title: string;
  description: string;
  tags: string[];
  sourceCode: string;
  demo: string;
}

export interface translation {
  id?: number;
  key: string;
  en: string;
  zh: string;
  vi: string;
}

export interface homeInfo {
  id: number;
  stage: number;
  text: string;
  link: string;
  linkText: string;
}

// Experiences
export const getExperiences = async () => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("year", { ascending: false });

  if (error) throw error;
  return data;
};

// Skills
export const getSkills = async () => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")

  if (error) throw error;
  return data;
};

// Projects
export const getProjects = async () => {
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
