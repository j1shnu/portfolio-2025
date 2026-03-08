import { useState, useCallback, useRef } from 'react';
import { PortfolioData } from '../../types/portfolio';
import { TerminalLine } from './types';
import { processCommand, getCommandNames, getFsEntries } from './commands';

const nextId = () => crypto.randomUUID();

const WELCOME_LINES: readonly TerminalLine[] = [
  { id: 'welcome-1', type: 'system', content: 'Welcome to Jishnu\'s terminal.' },
  { id: 'welcome-2', type: 'system', content: 'Type "help" to see available commands.' },
  { id: 'welcome-3', type: 'system', content: '' },
];

export function useTerminal(data: PortfolioData, scrollToSection?: (sectionId: string) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<readonly TerminalLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const commandHistory = useRef<string[]>([]);
  const inputRef = useRef(inputValue);
  const historyIndexRef = useRef(historyIndex);
  const scrollToSectionRef = useRef(scrollToSection);

  // Keep refs in sync with state
  inputRef.current = inputValue;
  historyIndexRef.current = historyIndex;
  scrollToSectionRef.current = scrollToSection;

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleSubmit = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      const MAX_HISTORY = 200;
      commandHistory.current = [...commandHistory.current, trimmed].slice(-MAX_HISTORY);
      setHistoryIndex(-1);

      const inputLine: TerminalLine = {
        id: nextId(),
        type: 'input',
        content: trimmed,
      };

      const result = processCommand(trimmed, data);

      if (result.type === 'clear') {
        setLines(WELCOME_LINES);
        setInputValue('');
        return;
      }

      if (result.type === 'open') {
        const resumeHref = data.contact.resume.href;
        const isDownload = result.url === 'resume-download';
        const outputLines: readonly TerminalLine[] = result.lines.map((line) => ({
          id: nextId(),
          type: 'output' as const,
          content: line,
        }));
        setLines((prev) => [...prev, inputLine, ...outputLines]);
        setInputValue('');
        if (isDownload) {
          const link = document.createElement('a');
          link.href = resumeHref;
          link.download = '';
          link.click();
        } else {
          window.open(resumeHref, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      if (result.type === 'navigate') {
        const navigateLines: readonly TerminalLine[] = result.lines.map((line) => ({
          id: nextId(),
          type: 'output' as const,
          content: line,
        }));
        setLines((prev) => [...prev, inputLine, ...navigateLines]);
        setInputValue('');
        setTimeout(() => {
          setIsOpen(false);
          if (result.target && scrollToSectionRef.current) {
            scrollToSectionRef.current(result.target);
          }
        }, 400);
        return;
      }

      const outputLines: readonly TerminalLine[] = result.lines.map((line) => ({
        id: nextId(),
        type: result.type as 'output' | 'error',
        content: line,
      }));

      setLines((prev) => [...prev, inputLine, ...outputLines, { id: nextId(), type: 'output', content: '' }]);
      setInputValue('');
    },
    [data]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentInput = inputRef.current;
      const currentHistoryIndex = historyIndexRef.current;

      if (e.key === 'Enter') {
        handleSubmit(currentInput);
        return;
      }

      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const history = commandHistory.current;
        if (history.length === 0) return;

        const newIndex =
          currentHistoryIndex === -1
            ? history.length - 1
            : Math.max(0, currentHistoryIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const history = commandHistory.current;
        if (currentHistoryIndex === -1) return;

        const newIndex = currentHistoryIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(history[newIndex]);
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const current = currentInput.toLowerCase();
        if (!current) return;

        // Check if completing an argument for cd/open/wget
        const argCommands = ['cd ', 'open ', 'wget '] as const;
        const argMatch = argCommands.find((c) => current.startsWith(c));
        const prefix = argMatch ? current.slice(argMatch.length).trim() : current;
        const candidates = argMatch ? getFsEntries() : getCommandNames();

        const matches = prefix
          ? candidates.filter((c) => c.startsWith(prefix))
          : argMatch ? [...candidates] : [];

        if (matches.length === 1) {
          setInputValue(argMatch ? `${argMatch}${matches[0]}` : matches[0]);
        } else if (matches.length > 1) {
          const hintLine: TerminalLine = {
            id: nextId(),
            type: 'system',
            content: matches.join('  '),
          };
          setLines((prev) => [...prev, hintLine]);
        }
      }
    },
    [handleSubmit, close]
  );

  return {
    isOpen,
    open,
    close,
    lines,
    inputValue,
    setInputValue,
    handleKeyDown,
  } as const;
}
