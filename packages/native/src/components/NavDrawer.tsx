import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { DocAppConfig, DocRoute, DocNavLabels, ComponentDocConfig } from '@component-docs/core';

const DRAWER_WIDTH = 260;

interface NavDrawerProps {
  config: DocAppConfig;
  route: DocRoute;
  navLabels: Required<DocNavLabels>;
  visible: boolean;
  onNavigate: (route: DocRoute) => void;
  onClose: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  config,
  route,
  navLabels,
  visible,
  onNavigate,
  onClose,
}) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 0.5 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const selectedId = route.page === 'previews' ? (route as any).selectedId : undefined;

  const grouped: Record<string, ComponentDocConfig[]> = {};
  config.components.forEach((c) => {
    const cat = c.category ?? 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(c);
  });

  const handleNavigate = (r: DocRoute) => {
    onNavigate(r);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: '#000', opacity: overlayOpacity, zIndex: 10 },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: theme.colors.surface,
            borderRightColor: theme.colors.border,
            transform: [{ translateX }],
            zIndex: 11,
          },
        ]}
      >
        {/* App title */}
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.surface,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            // Android: SafeAreaView is a no-op, add status bar height manually
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : undefined,
          }}
        >
          <View
            style={[
              styles.drawerHeader,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {config.title}
            </Text>
            {config.version && (
              <Text
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.textDisabled,
                  marginTop: 2,
                }}
              >
                v{config.version}
              </Text>
            )}
          </View>
        </SafeAreaView>

        <ScrollView style={{ flex: 1 }}>
          {/* Main nav items */}
          <View style={[styles.navSection, { borderBottomColor: theme.colors.border }]}>
            {(
              [
                { label: `🏠  ${navLabels.welcome}`, route: { page: 'welcome' } as DocRoute },
                { label: `📦  ${navLabels.previews}`, route: { page: 'previews' } as DocRoute },
                { label: `⚙️  ${navLabels.settings}`, route: { page: 'settings' } as DocRoute },
              ] as { label: string; route: DocRoute }[]
            ).map((item) => {
              const active = route.page === item.route.page;
              return (
                <TouchableOpacity
                  key={item.route.page}
                  onPress={() => handleNavigate(item.route)}
                  style={[
                    styles.navItem,
                    {
                      backgroundColor: active
                        ? theme.colors.primary + '22'
                        : 'transparent',
                      borderRadius: theme.borderRadius.md,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: active ? theme.colors.primary : theme.colors.text,
                      fontWeight: active ? 'bold' : 'normal',
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Component list */}
          <View style={{ padding: 8 }}>
            {Object.entries(grouped).map(([category, components]) => (
              <View key={category} style={{ marginBottom: 8 }}>
                <Text
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.textDisabled,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  {category}
                </Text>
                {components.map((comp) => {
                  const id = comp.id ?? comp.title;
                  const active = selectedId === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      onPress={() =>
                        handleNavigate({ page: 'previews', selectedId: id })
                      }
                      style={[
                        styles.navItem,
                        {
                          paddingLeft: 20,
                          backgroundColor: active
                            ? theme.colors.primary + '22'
                            : 'transparent',
                          borderRadius: theme.borderRadius.md,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: active ? theme.colors.primary : theme.colors.text,
                          fontWeight: active ? 'bold' : 'normal',
                        }}
                      >
                        {comp.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
  },
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  navSection: {
    padding: 8,
    borderBottomWidth: 1,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 2,
  },
});
