import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@component-docs/theme';

// ─── Context ─────────────────────────────────────────────────────────────────

interface ToastEntry {
  id: number;
  propName: string;
  args: unknown[];
}

interface CallbackToastContextValue {
  notify: (propName: string, args: unknown[]) => void;
}

export const CallbackToastContext =
  React.createContext<CallbackToastContextValue>({
    notify: () => {},
  });

export function useCallbackToast() {
  return React.useContext(CallbackToastContext);
}

// ─── Single Toast item ────────────────────────────────────────────────────────

interface ToastItemProps {
  entry: ToastEntry;
  onDone: (id: number) => void;
}

const VISIBLE_DURATION = 2000; // ms the toast stays visible

const ToastItem: React.FC<ToastItemProps> = ({ entry, onDone }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Fade + slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // After visible duration, fade out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDone(entry.id));
    }, VISIBLE_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const argsText =
    entry.args.length === 0
      ? 'no arguments'
      : entry.args
          .map((a) => {
            if (typeof a === 'function') return '[Function]';
            if (typeof a === 'object' && a !== null) return '[Object]';
            return String(a).slice(0, 40);
          })
          .join(', ');

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.primary,
          shadowColor: '#000',
        },
      ]}
    >
      {/* Icon + prop name row */}
      <View style={styles.toastHeader}>
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: theme.colors.primary + '22' },
          ]}
        >
          <Text style={[styles.iconText, { color: theme.colors.primary }]}>
            ƒ
          </Text>
        </View>
        <Text
          style={[
            styles.propName,
            {
              color: theme.colors.primary,
              fontFamily: theme.typography.fontFamily.mono,
            },
          ]}
          numberOfLines={1}
        >
          {entry.propName}()
        </Text>
        <Text style={[styles.calledLabel, { color: theme.colors.textSecondary }]}>
          called
        </Text>
      </View>

      {/* Args */}
      <Text
        style={[
          styles.argsText,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily.mono,
          },
        ]}
        numberOfLines={2}
      >
        {argsText}
      </Text>
    </Animated.View>
  );
};

// ─── Provider + stack ─────────────────────────────────────────────────────────

let _nextId = 1;

export const CallbackToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const notify = useCallback((propName: string, args: unknown[]) => {
    const id = _nextId++;
    setToasts((prev) => [...prev.slice(-3), { id, propName, args }]); // max 4
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <CallbackToastContext.Provider value={{ notify }}>
      {children}
      {/* Toast stack rendered above everything */}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((entry) => (
          <ToastItem key={entry.id} entry={entry} onDone={remove} />
        ))}
      </View>
    </CallbackToastContext.Provider>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
    gap: 8,
  },
  toast: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  toastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  propName: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  calledLabel: {
    fontSize: 11,
  },
  argsText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
