export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  profileImage: string;
  altText: string;
}

export interface Stat {
  number: string;
  label: string;
  color: string;
}

export interface Expertise {
  title: string;
  desc: string;
  color: string;
}

export interface About {
  title: string;
  description: string[];
  stats: Stat[];
  expertise: Expertise[];
}

export interface Job {
  title: string;
  company: string;
  period: string;
  description: string | string[];
  technologies: string[];
}

export interface Experience {
  title: string;
  description: string;
  jobs: Job[];
}

export interface Skills {
  title: string;
  description: string;
  categories: { [key: string]: string[] };
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  impact: string;
  repo?: string;
  internal?: boolean;
}

export interface Projects {
  title: string;
  description: string;
  items: Project[];
}

export interface ContactLink {
  label: string;
  href: string;
  color: string;
}

export interface Resume {
  href: string;
  label: string;
}

export interface Contact {
  title: string;
  description: string;
  links: ContactLink[];
  resume: Resume;
}

export interface Footer {
  name: string;
  title: string;
  copyright: string;
}

export interface Navigation {
  sections: string[];
  homeLabel: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  about: About;
  experience: Experience;
  skills: Skills;
  projects: Projects;
  contact: Contact;
  footer: Footer;
  navigation: Navigation;
} 