import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig, PropDefinition } from '@component-docs/core';
import { Playground } from './Playground';

interface ComponentDocViewProps {
  config: ComponentDocConfig;
  /** Props controladas externamente (pelo PropsDrawer no DocApp) */
  currentProps?: Record<string, any>;
  onPropChange?: (key: string, value: any) => void;
  onFullscreen?: () => void;
}

export const ComponentDocView: React.FC<ComponentDocViewProps> = ({
  config,
  currentProps,
  onPropChange,
  onFullscreen,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      {/* Header */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <View style={styles.titleRow}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.xxl,
              fontWeight: theme.typography.fontWeight.bold as 'bold' | 'normal',
              color: theme.colors.text,
              flexShrink: 1,
            }}
          >
            {config.title}
          </Text>
          {config.category && (
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.primary + '22' },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium as 'bold' | 'normal',
                }}
              >
                {config.category}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.textSecondary,
            lineHeight:
              theme.typography.fontSize.md * theme.typography.lineHeight.relaxed,
          }}
        >
          {config.description}
        </Text>
        {config.deprecated && (
          <View
            style={[
              styles.deprecatedBanner,
              {
                backgroundColor: theme.colors.warning + '22',
                borderColor: theme.colors.warning,
                borderRadius: theme.borderRadius.md,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <Text style={{ color: theme.colors.warning, fontWeight: 'bold' }}>
              ⚠️ Deprecated:{' '}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              {config.deprecatedMessage ?? 'This component is deprecated.'}
            </Text>
          </View>
        )}
      </View>

      {/* Playground */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold as 'bold' | 'normal',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Playground
        </Text>
        <Playground
          config={config}
          currentProps={currentProps}
          onPropChange={onPropChange}
          onFullscreen={onFullscreen}
        />
      </View>

      {/* Props list */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold as 'bold' | 'normal',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Props
        </Text>
        {Object.entries(config.props).map(([propName, def]: [string, PropDefinition]) => (
          <View
            key={propName}
            style={[
              styles.propRow,
              {
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.surface,
                marginBottom: theme.spacing.sm,
                padding: theme.spacing.md,
              },
            ]}
          >
            <View style={styles.propHeader}>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily.mono,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                  fontWeight: 'bold',
                }}
              >
                {propName}
              </Text>
              {def.required && (
                <Text
                  style={{
                    color: theme.colors.error,
                    fontSize: theme.typography.fontSize.xs,
                    marginLeft: theme.spacing.xs,
                  }}
                >
                  required
                </Text>
              )}
            </View>
            <Text
              style={{
                fontFamily: theme.typography.fontFamily.mono,
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.secondary,
                marginTop: 2,
              }}
            >
              {def.type}
            </Text>
            {def.description && (
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                }}
              >
                {def.description}
              </Text>
            )}
            {def.defaultValue !== undefined && (
              <Text
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.textSecondary,
                  marginTop: 2,
                }}
              >
                Default: {String(def.defaultValue)}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deprecatedBanner: {
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propRow: {
    borderWidth: 1,
  },
  propHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
