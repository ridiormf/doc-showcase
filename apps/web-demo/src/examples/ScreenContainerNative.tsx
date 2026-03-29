/**
 * React Native version of ScreenContainer — imported in the web-demo with
 * react-native aliased to react-native-web so it renders in the browser.
 *
 * Keep this in sync with apps/native-demo/components/ScreenContainer.tsx.
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@component-docs/theme';

export interface ScreenContainerNativeProps {
  title?: string;
  subtitle?: string;
  headerColor?: string;
  itemCount?: number;
}

export const ScreenContainerNative: React.FC<ScreenContainerNativeProps> = ({
  title = 'My Screen',
  subtitle = 'Welcome! Scroll down to see more content.',
  headerColor = '#3B82F6',
  itemCount = 8,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.root,
        { backgroundColor: headerColor },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Scrollable content */}
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: (theme.colors as any).textSecondary ?? theme.colors.text },
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
