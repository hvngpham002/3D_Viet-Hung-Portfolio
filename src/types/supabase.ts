export interface experience {
  id?: number;
  year: string;
  company: string;
  role: string;
  country: string;
  logo: string;
  points: string[];
  linkText: string;
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
  linkText:string;
} 