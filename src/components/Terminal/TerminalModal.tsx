import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TerminalLine } from './types';
import TerminalOutput from './TerminalOutput';
import { PROMPT } from './constants';

interface TerminalModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly lines: readonly TerminalLine[];
  readonly inputValue: string;
  readonly onInputChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function TerminalModal({
  isOpen,
  onClose,
  lines,
  inputValue,
  onInputChange,
  onKeyDown,
}: TerminalModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevFocus = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [isOpen]);

  function handleFocusTrap(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = [inputRef.current, closeButtonRef.current].filter(
      Boolean
    ) as HTMLElement[];
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleFocusTrap}
      role="dialog"
      aria-label="Interactive terminal"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl h-[70vh] max-h-[500px] bg-gray-950 rounded-lg border border-gray-700 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={handleContainerClick}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400 text-xs font-mono ml-2">
              jishnu@portfolio — bash
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            aria-label="Close terminal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Output */}
        <TerminalOutput lines={lines} />

        {/* Input */}
        <div className="flex items-center px-4 py-3 border-t border-gray-800 font-mono text-sm shrink-0">
          <span className="text-emerald-400 shrink-0 whitespace-pre">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-gray-200 outline-none caret-emerald-400"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
