import React, { useState, useReducer } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig } from '@component-docs/core';
import {
  playgroundReducer,
  generateInitialProps,
  generateCode,
} from '@component-docs/core';
import { CodePreview } from './CodePreview';

// Viewport dimensions assumed for the component (like a phone screen)
// The preview box measures itself and scales the component down to fit.
const PREVIEW_VIEWPORT_W = 375;
const PREVIEW_VIEWPORT_H = 667;

interface PlaygroundProps {
  config: ComponentDocConfig;
  /** Props controladas externamente (quando usado dentro do DocApp) */
  currentProps?: Record<string, any>;
  onPropChange?: (key: string, value: any) => void;
  /** Chamado quando o usuário quer ver o preview em tela cheia */
  onFullscreen?: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  config,
  currentProps: externalProps,
  onPropChange: externalOnChange,
  onFullscreen,
}) => {
  const { theme } = useTheme();
  const [showCode, setShowCode] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 280 });

  const [state, dispatch] = useReducer(playgroundReducer, {
    props: generateInitialProps(config.props),
    showCode: false,
    theme: theme.mode,
  });

  // Se houver props externas, usa elas; senão usa o estado interno
  const activeProps = externalProps ?? state.props;
  const handlePropChange = externalOnChange
    ? externalOnChange
    : (key: string, value: any) => dispatch({ type: 'UPDATE_PROP', key, value });

  const Component = config.component as React.ComponentType<Record<string, unknown>>;

  // Scale factor: fit the virtual viewport into the actual preview box
  const scaleX = previewSize.width > 0 ? previewSize.width / PREVIEW_VIEWPORT_W : 1;
  const scaleY = previewSize.height > 0 ? previewSize.height / PREVIEW_VIEWPORT_H : 1;
  const scale = Math.min(scaleX, scaleY, 1); // never upscale, only downscale

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPreviewSize({ width, height });
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
    >
      {/* Preview header row */}
      <View
        style={[
          styles.previewHeader,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textDisabled,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}
        >
          Preview
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity
            onPress={() => setShowCode(!showCode)}
            activeOpacity={0.7}
            style={[
              styles.expandBtn,
              {
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.sm,
              },
            ]}
          >
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
              {showCode ? 'Hide Code' : 'View Code'}
            </Text>
          </TouchableOpacity>
          {onFullscreen && (
            <TouchableOpacity
              onPress={onFullscreen}
              activeOpacity={0.7}
              style={[
                styles.expandBtn,
                {
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.sm,
                },
              ]}
            >
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                ⛶  Tela cheia
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Preview — fixed-height sandbox, component is scaled to fit */}
      <View
        style={[
          styles.previewOuter,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
        onLayout={handleLayout}
      >
        {previewSize.width > 0 && (
          <View
            style={{
              width: PREVIEW_VIEWPORT_W,
              height: PREVIEW_VIEWPORT_H,
              transform: [{ scale }],
              // After scale the visual size shrinks — compensate to avoid gap
              marginTop: -(PREVIEW_VIEWPORT_H * (1 - scale)) / 2,
              marginBottom: -(PREVIEW_VIEWPORT_H * (1 - scale)) / 2,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Component {...activeProps} />
          </View>
        )}
      </View>

      {/* Code preview */}
      {showCode && (
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            padding: theme.spacing.md,
          }}
        >
          <CodePreview code={generateCode(config.title, activeProps)} title={config.title} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  previewOuter: {
    height: 280,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  expandBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
});
