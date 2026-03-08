import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTerminal } from './useTerminal';
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
    description: ['About me.'],
    stats: [],
    expertise: [],
  },
  experience: {
    title: 'Experience',
    description: 'Work history',
    jobs: [],
  },
  skills: {
    title: 'Skills',
    description: 'Tech stack',
    categories: {},
  },
  projects: {
    title: 'Projects',
    description: 'Featured work',
    items: [],
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch',
    links: [],
    resume: { href: '/resume.pdf', label: 'Download Resume' },
  },
  footer: {
    name: 'Test User',
    title: 'Test Engineer',
    copyright: '© 2026',
  },
  navigation: {
    sections: ['hero', 'about'],
    homeLabel: 'Home',
  },
};

describe('useTerminal', () => {
  it('starts closed with welcome lines', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.lines.length).toBeGreaterThan(0);
    expect(result.current.lines[0].type).toBe('system');
  });

  it('opens and closes', () => {
    const { result } = renderHook(() => useTerminal(mockData));

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('processes a command on Enter', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    const initialLineCount = result.current.lines.length;

    act(() => result.current.setInputValue('whoami'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.lines.length).toBeGreaterThan(initialLineCount);
    expect(result.current.lines.some((l) => l.content.includes('Test User'))).toBe(true);
    expect(result.current.inputValue).toBe('');
  });

  it('ignores empty input on Enter', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    const initialLineCount = result.current.lines.length;

    act(() => result.current.setInputValue(''));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.lines.length).toBe(initialLineCount);
  });

  it('navigates command history with arrow keys', () => {
    const { result } = renderHook(() => useTerminal(mockData));

    // Submit two commands
    act(() => result.current.setInputValue('whoami'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });

    act(() => result.current.setInputValue('help'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });

    // Arrow up should show last command
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('help');

    // Arrow up again should show first command
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('whoami');

    // Arrow down should go back to second command
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('help');

    // Arrow down past end should clear input
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('');
  });

  it('does nothing on ArrowUp with empty history', () => {
    const { result } = renderHook(() => useTerminal(mockData));

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('');
  });

  it('closes on Escape key', () => {
    const { result } = renderHook(() => useTerminal(mockData));

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('clears terminal on clear command', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    const welcomeLineCount = result.current.lines.length;

    // Add some output
    act(() => result.current.setInputValue('whoami'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.lines.length).toBeGreaterThan(welcomeLineCount);

    // Clear
    act(() => result.current.setInputValue('clear'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.lines.length).toBe(welcomeLineCount);
  });

  it('handles Tab autocompletion with single match', () => {
    const { result } = renderHook(() => useTerminal(mockData));

    act(() => result.current.setInputValue('who'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Tab',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.inputValue).toBe('whoami');
  });

  it('shows hints for multiple Tab matches', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    const initialLineCount = result.current.lines.length;

    // 'c' matches 'clear' and 'contact'
    act(() => result.current.setInputValue('c'));
    act(() => {
      result.current.handleKeyDown({
        key: 'Tab',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.lines.length).toBeGreaterThan(initialLineCount);
    expect(result.current.inputValue).toBe('c'); // not autocompleted
  });

  it('does nothing on Tab with empty input', () => {
    const { result } = renderHook(() => useTerminal(mockData));
    const initialLineCount = result.current.lines.length;

    act(() => {
      result.current.handleKeyDown({
        key: 'Tab',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.lines.length).toBe(initialLineCount);
  });
});
