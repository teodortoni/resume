export type SocialLinks = {
  github?: string;
  linkedin?: string;
  website?: string;
};

export type Profile = {
  name: string;
  title: string;
  location?: string;
  highlights?: Array<{
    value: string;
    label: string;
  }>;
  authorization?: {
    authorizedToWorkInUS?: {
      enabled: boolean;
      text: string;
    };
    noSponsorshipRequired?: {
      enabled: boolean;
      text: string;
    };
  } | string;
  jobPreference?: string;
  headline: string;
  stack?: string;
  supporting?: string;
  yearsOfExperience: number;
  education?: EducationItem;
  email?: string;
  socialLinks?: SocialLinks;
  languages?: Language[];
};

export type Project = {
  id: string;
  title: string;
  date: string;
  badge: string;
  summary: string;
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  division: string;
  title: string;
  dates: string;
  projects: Array<{
    projectName: string;
    projectDescription: string;
    highlights: string[];
    metrics?: Array<{ value: string; label: string }>;
    problem: string;
    approach: string[];
    outcome: string[];
    stack: string[];
  }>;
};

export type EducationItem = {
  degree: string;
  school: string;
  location?: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type Certification = {
  name: string;
  issuer?: string;
  year?: string;
};

export type Language = {
  code?: string;
  name: string;
  nativeName?: string;
  direction?: "ltr" | "rtl";
  proficiency?: string;
};

export type Resume = {
  profile: Profile;
  experience: ExperienceItem[];
  projects: Project[];
  skills: SkillGroup[];
  certifications?: Certification[];
};
