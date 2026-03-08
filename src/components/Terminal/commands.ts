import { PortfolioData } from '../../types/portfolio';
import { CommandResult } from './types';

const COMMANDS: Record<string, string> = {
  help: 'List available commands',
  whoami: 'Display name and title',
  about: 'About me',
  skills: 'Technical skills by category',
  experience: 'Work experience history',
  projects: 'Featured projects',
  contact: 'Contact information',
  resume: 'Resume download link',
  clear: 'Clear terminal',
  exit: 'Close terminal',
};

const COMMAND_NAMES = Object.keys(COMMANDS);

function helpCommand(): CommandResult {
  const lines = [
    'Available commands:',
    '',
    ...Object.entries(COMMANDS).map(
      ([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`
    ),
    '',
    'Tip: Use Tab for autocompletion, arrow keys for history.',
  ];
  return { type: 'output', lines };
}

function whoamiCommand(data: PortfolioData): CommandResult {
  return {
    type: 'output',
    lines: [`${data.personal.name} — ${data.personal.title}`],
  };
}

function aboutCommand(data: PortfolioData): CommandResult {
  const lines = [
    ...data.about.description,
    '',
    ...data.about.stats.map((s) => `  ${s.label}: ${s.number}`),
  ];
  return { type: 'output', lines };
}

function skillsCommand(data: PortfolioData): CommandResult {
  const lines: string[] = [];
  for (const [category, items] of Object.entries(data.skills.categories)) {
    lines.push(`  ${category}: ${items.join(', ')}`);
  }
  return { type: 'output', lines };
}

function experienceCommand(data: PortfolioData): CommandResult {
  const lines: string[] = [];
  for (const job of data.experience.jobs) {
    lines.push(`  ${job.title} @ ${job.company}`);
    lines.push(`  ${job.period}`);
    const descriptions = Array.isArray(job.description)
      ? job.description
      : [job.description];
    for (const desc of descriptions) {
      lines.push(`    • ${desc}`);
    }
    lines.push('');
  }
  return { type: 'output', lines };
}

function projectsCommand(data: PortfolioData): CommandResult {
  const lines: string[] = [];
  for (const project of data.projects.items) {
    lines.push(`  ${project.title}`);
    lines.push(`    ${project.description}`);
    lines.push(`    Impact: ${project.impact}`);
    if (project.repo) {
      lines.push(`    Repo: ${project.repo}`);
    }
    lines.push(`    Tech: ${project.technologies.join(', ')}`);
    lines.push('');
  }
  return { type: 'output', lines };
}

function contactCommand(data: PortfolioData): CommandResult {
  const lines = [
    ...data.contact.links.map((l) => `  ${l.label}: ${l.href}`),
    '',
    `  Resume: ${data.contact.resume.href}`,
  ];
  return { type: 'output', lines };
}

function resumeCommand(data: PortfolioData): CommandResult {
  return {
    type: 'output',
    lines: [
      `Resume: ${data.contact.resume.href}`,
      '',
      'Tip: Open the link above to download.',
    ],
  };
}

function easterEgg(input: string): CommandResult | null {
  const cmd = input.trim().toLowerCase();

  if (cmd === 'sudo' || cmd.startsWith('sudo ')) {
    return {
      type: 'error',
      lines: ['Nice try, but you don\'t have root access here.'],
    };
  }

  if (cmd === 'ls') {
    return {
      type: 'output',
      lines: ['about/  experience/  skills/  projects/  contact/  resume.pdf'],
    };
  }

  if (cmd === 'pwd') {
    return {
      type: 'output',
      lines: ['/home/visitor/jishnu-portfolio'],
    };
  }

  if (cmd.startsWith('cat ')) {
    const target = cmd.slice(4).trim().replace(/\/$/, '');
    const validSections = ['about', 'skills', 'experience', 'projects', 'contact', 'resume'];
    if (validSections.includes(target)) {
      return null; // let the main handler process it as a regular command
    }
    return {
      type: 'error',
      lines: [`cat: ${target}: No such file or directory`],
    };
  }

  if (cmd === 'cd' || cmd.startsWith('cd ')) {
    return {
      type: 'output',
      lines: ['You\'re already where you need to be. Try "help" instead.'],
    };
  }

  return null;
}

export function processCommand(
  input: string,
  data: PortfolioData
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: 'output', lines: [] };
  }

  // Check easter eggs first
  const egg = easterEgg(trimmed);
  if (egg) return egg;

  // Handle `cat <section>` as alias
  const cmd = trimmed.toLowerCase().startsWith('cat ')
    ? trimmed.slice(4).trim().toLowerCase().replace(/\/$/, '')
    : trimmed.toLowerCase();

  switch (cmd) {
    case 'help':
      return helpCommand();
    case 'whoami':
      return whoamiCommand(data);
    case 'about':
      return aboutCommand(data);
    case 'skills':
      return skillsCommand(data);
    case 'experience':
      return experienceCommand(data);
    case 'projects':
      return projectsCommand(data);
    case 'contact':
      return contactCommand(data);
    case 'resume':
      return resumeCommand(data);
    case 'clear':
      return { type: 'clear', lines: [] };
    case 'exit':
    case 'quit':
      return { type: 'exit', lines: [] };
    default:
      return {
        type: 'error',
        lines: [`Command not found: ${trimmed.length > 40 ? trimmed.slice(0, 40) + '…' : trimmed}. Type "help" for available commands.`],
      };
  }
}

export function getCommandNames(): readonly string[] {
  return COMMAND_NAMES;
}
