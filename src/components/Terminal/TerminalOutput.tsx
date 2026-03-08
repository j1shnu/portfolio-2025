import { useEffect, useRef, ReactNode } from 'react';
import { TerminalLine } from './types';
import { PROMPT } from './constants';

interface TerminalOutputProps {
  readonly lines: readonly TerminalLine[];
}

const SPLIT_REGEX = /(https?:\/\/[^\s]+|mailto:[^\s]+|\/[^\s]+\.pdf)/g;
const TEST_REGEX = /^(https?:\/\/|mailto:|\/.*\.pdf$)/;

function stripTrailingPunct(url: string): string {
  return url.replace(/[.,;:!?)'"]+$/, '');
}

function linkify(text: string): ReactNode {
  const parts = text.split(SPLIT_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (TEST_REGEX.test(part)) {
      const href = stripTrailingPunct(part);
      const trailing = part.slice(href.length);
      return (
        <span key={i}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {href}
          </a>
          {trailing}
        </span>
      );
    }
    return part;
  });
}

function LineContent({ line }: { readonly line: TerminalLine }) {
  switch (line.type) {
    case 'input':
      return (
        <div className="flex">
          <span className="text-emerald-400 shrink-0 whitespace-pre">{PROMPT}</span>
          <span className="text-gray-200">{line.content}</span>
        </div>
      );
    case 'error':
      return <div className="text-red-400">{linkify(line.content)}</div>;
    case 'system':
      return <div className="text-amber-400">{linkify(line.content)}</div>;
    case 'output':
      return (
        <div className="text-gray-300 whitespace-pre-wrap break-words">
          {linkify(line.content)}
        </div>
      );
  }
}

export default function TerminalOutput({ lines }: TerminalOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed" aria-live="polite" aria-atomic="false">
      {lines.map((line) => (
        <LineContent key={line.id} line={line} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
