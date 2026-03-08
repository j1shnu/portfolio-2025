import { describe, it, expect } from 'vitest';
import { processCommand, getCommandNames } from './commands';
import { PortfolioData } from '../../types/portfolio';

const mockData: PortfolioData = {
  personal: {
    name: 'Test User',
    title: 'Test Engineer',
    tagline: 'Building things',
    profileImage: '/photo.webp',
    altText: 'Test User photo',
  },
  about: {
    title: 'About',
    description: ['First paragraph.', 'Second paragraph.'],
    stats: [
      { number: '5+', label: 'Years Experience', color: 'text-blue-400' },
    ],
    expertise: [],
  },
  experience: {
    title: 'Experience',
    description: 'Work history',
    jobs: [
      {
        title: 'Senior Engineer',
        company: 'Acme Corp',
        period: '2023 - Present',
        description: ['Built systems.', 'Led team.'],
        technologies: ['TypeScript', 'React'],
      },
      {
        title: 'Junior Engineer',
        company: 'Startup Inc',
        period: '2020 - 2023',
        description: 'Wrote code.',
        technologies: ['JavaScript'],
      },
    ],
  },
  skills: {
    title: 'Skills',
    description: 'Tech stack',
    categories: {
      'Languages': ['TypeScript', 'Python'],
      'Cloud': ['AWS', 'GCP'],
    },
  },
  projects: {
    title: 'Projects',
    description: 'Featured work',
    items: [
      {
        title: 'Project Alpha',
        description: 'A cool project',
        technologies: ['React', 'Node'],
        impact: 'Reduced latency by 50%',
        repo: 'https://github.com/test/alpha',
      },
      {
        title: 'Project Beta',
        description: 'Internal tool',
        technologies: ['Python'],
        impact: 'Automated workflows',
        internal: true,
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch',
    links: [
      { label: 'Email', href: 'mailto:test@example.com', color: 'from-red-600 to-red-700', icon: 'mail' },
      { label: 'GitHub', href: 'https://github.com/test', color: 'from-gray-600 to-gray-700', icon: 'github' },
    ],
    resume: { href: '/resume.pdf', label: 'Download Resume' },
  },
  footer: {
    name: 'Test User',
    title: 'Test Engineer',
    copyright: '© 2026',
  },
  navigation: {
    sections: ['hero', 'about', 'experience', 'skills', 'projects', 'contact'],
    homeLabel: 'Home',
  },
};

describe('processCommand', () => {
  describe('help', () => {
    it('lists available commands', () => {
      const result = processCommand('help', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('help'))).toBe(true);
      expect(result.lines.some((l) => l.includes('about'))).toBe(true);
      expect(result.lines.some((l) => l.includes('skills'))).toBe(true);
    });

    it('is case insensitive', () => {
      const result = processCommand('HELP', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('Available commands'))).toBe(true);
    });
  });

  describe('whoami', () => {
    it('returns name and title', () => {
      const result = processCommand('whoami', mockData);
      expect(result.type).toBe('output');
      expect(result.lines[0]).toContain('Test User');
      expect(result.lines[0]).toContain('Test Engineer');
    });
  });

  describe('about', () => {
    it('returns description and stats', () => {
      const result = processCommand('about', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('First paragraph.'))).toBe(true);
      expect(result.lines.some((l) => l.includes('Years Experience'))).toBe(true);
    });
  });

  describe('skills', () => {
    it('returns skills by category', () => {
      const result = processCommand('skills', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('Languages'))).toBe(true);
      expect(result.lines.some((l) => l.includes('TypeScript'))).toBe(true);
      expect(result.lines.some((l) => l.includes('AWS'))).toBe(true);
    });
  });

  describe('experience', () => {
    it('returns job history with array descriptions', () => {
      const result = processCommand('experience', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('Senior Engineer'))).toBe(true);
      expect(result.lines.some((l) => l.includes('Acme Corp'))).toBe(true);
      expect(result.lines.some((l) => l.includes('Built systems.'))).toBe(true);
    });

    it('handles string description', () => {
      const result = processCommand('experience', mockData);
      expect(result.lines.some((l) => l.includes('Wrote code.'))).toBe(true);
    });
  });

  describe('projects', () => {
    it('returns projects with repo links', () => {
      const result = processCommand('projects', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('Project Alpha'))).toBe(true);
      expect(result.lines.some((l) => l.includes('github.com/test/alpha'))).toBe(true);
    });

    it('omits repo for internal projects', () => {
      const result = processCommand('projects', mockData);
      const betaIdx = result.lines.findIndex((l) => l.includes('Project Beta'));
      const nextProjectOrEnd = result.lines.findIndex(
        (l, i) => i > betaIdx && l.includes('Tech:')
      );
      const betaLines = result.lines.slice(betaIdx, nextProjectOrEnd + 1);
      expect(betaLines.some((l) => l.includes('Repo:'))).toBe(false);
    });
  });

  describe('contact', () => {
    it('returns contact links and resume', () => {
      const result = processCommand('contact', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('test@example.com'))).toBe(true);
      expect(result.lines.some((l) => l.includes('resume.pdf'))).toBe(true);
    });
  });

  describe('resume', () => {
    it('returns resume link', () => {
      const result = processCommand('resume', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('/resume.pdf'))).toBe(true);
    });
  });

  describe('clear and exit', () => {
    it('returns clear signal', () => {
      expect(processCommand('clear', mockData).type).toBe('clear');
    });

  });

  describe('empty and unknown input', () => {
    it('returns empty output for blank input', () => {
      const result = processCommand('', mockData);
      expect(result.type).toBe('output');
      expect(result.lines).toHaveLength(0);
    });

    it('returns empty output for whitespace-only input', () => {
      const result = processCommand('   ', mockData);
      expect(result.type).toBe('output');
      expect(result.lines).toHaveLength(0);
    });

    it('returns error for unknown command', () => {
      const result = processCommand('foobar', mockData);
      expect(result.type).toBe('error');
      expect(result.lines[0]).toContain('Command not found');
    });

    it('truncates long unknown commands', () => {
      const longCmd = 'a'.repeat(100);
      const result = processCommand(longCmd, mockData);
      expect(result.type).toBe('error');
      expect(result.lines[0]).toContain('…');
      expect(result.lines[0].length).toBeLessThan(150);
    });
  });

  describe('easter eggs', () => {
    it('sudo returns error', () => {
      const result = processCommand('sudo rm -rf /', mockData);
      expect(result.type).toBe('error');
      expect(result.lines[0]).toContain('root access');
    });

    it('ls lists sections', () => {
      const result = processCommand('ls', mockData);
      expect(result.type).toBe('output');
      expect(result.lines[0]).toContain('about/');
    });

    it('pwd returns fake path', () => {
      const result = processCommand('pwd', mockData);
      expect(result.type).toBe('output');
      expect(result.lines[0]).toContain('jishnu-portfolio');
    });

    it('cd with valid section returns navigate', () => {
      const result = processCommand('cd about', mockData);
      expect(result.type).toBe('navigate');
      expect(result.target).toBe('about');
      expect(result.lines[0]).toContain('Navigating to about');
    });

    it('cd without target navigates to home', () => {
      const result = processCommand('cd', mockData);
      expect(result.type).toBe('navigate');
      expect(result.target).toBe('hero');
    });

    it('cd ~ navigates to home', () => {
      const result = processCommand('cd ~', mockData);
      expect(result.type).toBe('navigate');
      expect(result.target).toBe('hero');
    });

    it('cd with invalid section returns error', () => {
      const result = processCommand('cd /tmp', mockData);
      expect(result.type).toBe('error');
      expect(result.lines[0]).toContain('No such section');
    });

    it('cat with valid section passes through to command handler', () => {
      const result = processCommand('cat about', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('First paragraph.'))).toBe(true);
    });

    it('cat with uppercase section works', () => {
      const result = processCommand('cat ABOUT', mockData);
      expect(result.type).toBe('output');
      expect(result.lines.some((l) => l.includes('First paragraph.'))).toBe(true);
    });

    it('cat with invalid target returns error', () => {
      const result = processCommand('cat /etc/passwd', mockData);
      expect(result.type).toBe('error');
      expect(result.lines[0]).toContain('No such file or directory');
    });
  });
});

describe('getCommandNames', () => {
  it('returns all command names', () => {
    const names = getCommandNames();
    expect(names).toContain('help');
    expect(names).toContain('about');
    expect(names).toContain('cd');
    expect(names).toContain('open');
    expect(names).toContain('wget');
    expect(names.length).toBeGreaterThanOrEqual(12);
  });
});
