import { useState, useCallback, useRef } from 'react';
import { PortfolioData } from '../../types/portfolio';
import { TerminalLine } from './types';
import { processCommand, getCommandNames } from './commands';

const nextId = () => crypto.randomUUID();

const WELCOME_LINES: readonly TerminalLine[] = [
  { id: 'welcome-1', type: 'system', content: 'Welcome to Jishnu\'s terminal.' },
  { id: 'welcome-2', type: 'system', content: 'Type "help" to see available commands.' },
  { id: 'welcome-3', type: 'system', content: '' },
];

export function useTerminal(data: PortfolioData) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<readonly TerminalLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const commandHistory = useRef<string[]>([]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleSubmit = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      commandHistory.current = [...commandHistory.current, trimmed];
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

      if (result.type === 'exit') {
        setIsOpen(false);
        setInputValue('');
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
      if (e.key === 'Enter') {
        handleSubmit(inputValue);
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
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const history = commandHistory.current;
        if (historyIndex === -1) return;

        const newIndex = historyIndex + 1;
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
        const current = inputValue.toLowerCase();
        if (!current) return;

        const matches = getCommandNames().filter((cmd) =>
          cmd.startsWith(current)
        );
        if (matches.length === 1) {
          setInputValue(matches[0]);
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
    [inputValue, historyIndex, handleSubmit, close]
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
