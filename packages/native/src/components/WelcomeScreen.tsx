import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { DocAppConfig, DocNavLabels } from '@component-docs/core';

interface WelcomeScreenProps {
  config: DocAppConfig;
  navLabels: Required<DocNavLabels>;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, navLabels, onStart }) => {
  const { theme } = useTheme();
  const w = config.welcome;

  const title = w?.title ?? config.title;
  const subtitle = w?.subtitle ?? config.description ?? '';
  const description = w?.description ?? '';
  const badges = w?.badges ?? (config.version ? [{ label: 'Version', value: config.version }] : []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconBox,
          { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.lg },
        ]}
      >
        <Text style={styles.iconEmoji}>📦</Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: theme.typography.fontWeight.bold as 'bold',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: theme.spacing.sm,
        }}
      >
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle ? (
        <Text
          style={{
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          {subtitle}
        </Text>
      ) : null}

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.map((b, i) => (
            <View
              key={i}
              style={[
                styles.badge,
                {
                  backgroundColor: theme.colors.primary + '22',
                  borderColor: theme.colors.primary + '44',
                  borderRadius: theme.borderRadius.full ?? 999,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                }}
              >
                {b.label}:{' '}
                <Text style={{ fontWeight: 'bold' }}>{b.value}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Description */}
      {description ? (
        <Text
          style={{
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight:
              theme.typography.fontSize.md * theme.typography.lineHeight.relaxed,
            marginBottom: theme.spacing.xl,
          }}
        >
          {description}
        </Text>
      ) : null}

      {/* CTA */}
      <TouchableOpacity
        onPress={onStart}
        style={[
          styles.ctaButton,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.lg,
          },
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: theme.typography.fontSize.lg,
            fontWeight: 'bold',
          }}
        >
          {navLabels.previews} →
        </Text>
      </TouchableOpacity>

      {config.components.length > 0 && (
        <Text
          style={{
            marginTop: theme.spacing.lg,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textDisabled,
          }}
        >
          {config.components.length} component{config.components.length !== 1 ? 's' : ''} documented
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconBox: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 36,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
});
