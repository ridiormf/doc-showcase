import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@component-docs/theme';

export interface ScreenContainerProps {
  /** Title shown in the header bar */
  title?: string;
  /** Introductory text at the top of the scrollable area */
  subtitle?: string;
  /** Header background color (hex string, e.g. "#3B82F6") */
  headerColor?: string;
  /** Number of placeholder list items to render */
  itemCount?: number;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  title = 'My Screen',
  subtitle = 'Welcome! Scroll down to see more content.',
  headerColor = '#3B82F6',
  itemCount = 8,
}) => {
  const { theme } = useTheme();

  return (
    /**
     * SafeAreaView as root:
     *  - fills the virtual 375×667 viewport (flex: 1 + alignSelf: stretch)
     *  - its backgroundColor matches the header so the notch area blends in
     *  - respects safe area on real devices when used outside the playground
     */
    <SafeAreaView
      style={[
        styles.root,
        { backgroundColor: headerColor },
      ]}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* ── Scrollable content ── */}
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary ?? theme.colors.text },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}

          {Array.from({ length: itemCount }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.item,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontWeight: '600',
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                Item {i + 1}
              </Text>
              <Text
                style={{
                  color: theme.colors.textDisabled,
                  fontSize: theme.typography.fontSize.xs,
                  marginTop: 2,
                }}
              >
                Description for item {i + 1}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Override parent's alignItems: 'center' in the playground preview box
    // so the component stretches to fill the full 375px width.
    alignSelf: 'stretch',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  item: {
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
});
