import React from 'react';

/**
 * High-performance, lightweight TypeScript & Code syntax tokenizer & highlighter for VS Code Dark theme.
 */
export function highlightLine(line: string, language: string = 'typescript'): React.ReactNode[] {
  // Empty line
  if (!line) {
    return [<span key="empty">&nbsp;</span>];
  }

  // Comments (// or # for markdown)
  const commentIdx = line.indexOf('//');
  if (commentIdx !== -1) {
    const beforeComment = line.slice(0, commentIdx);
    const commentPart = line.slice(commentIdx);
    return [
      ...highlightTokens(beforeComment, 'pre-comment', language),
      <span key="comment" className="text-[#6a9955] italic">
        {commentPart}
      </span>,
    ];
  }

  if (language === 'markdown' && line.trim().startsWith('#')) {
    return [
      <span key="md-heading" className="text-[#569cd6] font-bold">
        {line}
      </span>,
    ];
  }

  return highlightTokens(line, 'line', language);
}

function highlightTokens(text: string, keyPrefix: string, language: string): React.ReactNode[] {
  // Tokenizer pattern
  const tokenRegex = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`|\b(?:export|interface|class|public|private|const|let|var|return|function|async|await|if|else|throw|new|try|catch|import|from|type|describe|it|beforeEach|expect)\b|\b(?:string|number|boolean|void|any|never|unknown|undefined|null|User|Promise|Map|Set|Array|Record|Error|React)\b|\b(?:getUser|getUserDisplayName|getUserById|deleteUser|updateUserRole|find|findIndex|splice|filter|map|push|pop|toBe|not|toThrow|json|fetch|log|error)\b|\b\d+\b|[a-zA-Z_$][a-zA-Z0-9_$]*|[{}()[\].,;:?!=<>+\-*/&|~^]+|\s+)/g;

  const matches = text.match(tokenRegex) || [text];

  const keywords = new Set([
    'export', 'interface', 'class', 'public', 'private', 'const', 'let', 'var',
    'return', 'function', 'async', 'await', 'if', 'else', 'throw', 'new', 'try', 'catch', 'import', 'from', 'type',
    'describe', 'it', 'beforeEach', 'expect',
  ]);

  const types = new Set([
    'string', 'number', 'boolean', 'void', 'any', 'never', 'unknown', 'undefined', 'null',
    'User', 'Promise', 'Map', 'Set', 'Array', 'Record', 'Error', 'React',
  ]);

  const functions = new Set([
    'getUser', 'getUserDisplayName', 'getUserById', 'deleteUser', 'updateUserRole',
    'find', 'findIndex', 'splice', 'filter', 'map', 'push', 'pop', 'toBe', 'not', 'toThrow', 'json', 'fetch', 'log', 'error',
  ]);

  return matches.map((token, idx) => {
    const key = `${keyPrefix}-${idx}`;

    // 1. Whitespace
    if (/^\s+$/.test(token)) {
      return <span key={key}>{token}</span>;
    }

    // 2. String literals
    if (/^('|"|`).*('|"|`)$/.test(token)) {
      return (
        <span key={key} className="text-[#ce9178]">
          {token}
        </span>
      );
    }

    // 3. Keywords
    if (keywords.has(token)) {
      return (
        <span key={key} className="text-[#569cd6] font-medium">
          {token}
        </span>
      );
    }

    // 4. Types
    if (types.has(token)) {
      return (
        <span key={key} className="text-[#4ec9b0]">
          {token}
        </span>
      );
    }

    // 5. Functions / Methods
    if (functions.has(token)) {
      return (
        <span key={key} className="text-[#dcdcaa]">
          {token}
        </span>
      );
    }

    // 6. Numbers
    if (/^\d+$/.test(token)) {
      return (
        <span key={key} className="text-[#b5cea8]">
          {token}
        </span>
      );
    }

    // 7. Symbols & Punctuation
    if (/^[{}()[\].,;:?!=<>+\-*/&|~^]+$/.test(token)) {
      return (
        <span key={key} className="text-[#cccccc]">
          {token}
        </span>
      );
    }

    // 8. Properties / identifiers
    return (
      <span key={key} className="text-[#9cdcfe]">
        {token}
      </span>
    );
  });
}
