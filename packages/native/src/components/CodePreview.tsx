import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@component-docs/theme';

// ── VS Code Dark+ colour palette ─────────────────────────────────────────────
const C = {
  bg: '#1E1E1E',
  gutter: '#1A1A1A',
  border: '#333',
  header: '#252526',
  lineNum: '#858585',
  plain: '#D4D4D4',
  comment: '#6A9955',
  string: '#CE9178',
  keyword: '#569CD6',
  jsxComp: '#4EC9B0',
  number: '#B5CEA8',
};

const PATTERNS: Array<{ re: RegExp; color: string }> = [
  { re: /\/\/.*/g, color: C.comment },
  { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`/g, color: C.string },
  { re: /<\/?[A-Z][A-Za-z0-9.]*/g, color: C.jsxComp },
  {
    re: /\b(import|export|from|const|let|var|function|return|type|interface|default|extends|class|new|true|false|null|undefined|if|else|for|while|do|switch|case|async|await|of|in|as|React)\b/g,
    color: C.keyword,
  },
  { re: /\b\d+(\.\d+)?\b/g, color: C.number },
];

interface Token {
  text: string;
  color: string;
}

function tokenizeLine(line: string): Token[] {
  type Match = { start: number; end: number; color: string };
  const matches: Match[] = [];

  for (const { re, color } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, color });
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered: Match[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start >= cursor) {
      filtered.push(m);
      cursor = m.end;
    }
  }

  if (filtered.length === 0) return [{ text: line, color: C.plain }];

  const tokens: Token[] = [];
  let pos = 0;
  for (const m of filtered) {
    if (m.start > pos) tokens.push({ text: line.slice(pos, m.start), color: C.plain });
    tokens.push({ text: line.slice(m.start, m.end), color: m.color });
    pos = m.end;
  }
  if (pos < line.length) tokens.push({ text: line.slice(pos), color: C.plain });
  return tokens;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CodePreviewProps {
  code: string;
  title?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, title }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await Share.share({ message: code });
    } catch {
      // dismissed
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const lines = code.split('\n');
  const fontSize = theme.typography.fontSize.sm;
  const lineHeight = Math.round(fontSize * 1.6);
  const fontFamily = theme.typography.fontFamily.mono;

  return (
    <View style={[styles.wrapper, { borderRadius: theme.borderRadius.md, borderColor: C.border }]}>
      {/* ── header bar ── */}
      <View style={styles.header}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
          <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
          <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
        </View>
        <Text style={styles.filename} numberOfLines={1}>
          {title ? `${title}.tsx` : 'Component.tsx'}
        </Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn} activeOpacity={0.7}>
          <Text style={[styles.copyText, copied && styles.copiedText]}>
            {copied ? '✓ Copiado!' : '⎘ Copiar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── code body ── */}
      <ScrollView
        style={{ maxHeight: 320 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        {lines.map((line, lineIdx) => {
          const tokens = tokenizeLine(line);
          return (
            <ScrollView
              key={lineIdx}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.lineRow}>
                {/* line number */}
                <Text
                  style={[styles.lineNum, { fontSize, lineHeight, fontFamily }]}
                >
                  {lineIdx + 1}
                </Text>
                {/* code tokens */}
                <Text style={[styles.lineCode, { fontSize, lineHeight, fontFamily }]}>
                  {tokens.map((tok, ti) => (
                    <Text key={ti} style={{ color: tok.color }}>
                      {tok.text}
                    </Text>
                  ))}
                </Text>
              </View>
            </ScrollView>
          );
        })}
        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.header,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filename: {
    flex: 1,
    color: '#9CDCFE',
    fontSize: 11,
    fontWeight: '500',
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  copyText: {
    color: '#CCC',
    fontSize: 11,
  },
  copiedText: {
    color: '#28C840',
  },
  lineRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  lineNum: {
    width: 32,
    textAlign: 'right',
    color: C.lineNum,
    marginRight: 16,
    userSelect: 'none' as any,
  },
  lineCode: {
    color: C.plain,
  },
});
