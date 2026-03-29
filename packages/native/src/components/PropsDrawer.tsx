import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig } from '@component-docs/core';
import { PropControl } from './PropControl';

const DRAWER_WIDTH = 260;

interface PropsDrawerProps {
  config: ComponentDocConfig | null;
  currentProps: Record<string, any>;
  visible: boolean;
  onPropChange: (key: string, value: any) => void;
  onClose: () => void;
}

export const PropsDrawer: React.FC<PropsDrawerProps> = ({
  config,
  currentProps,
  visible,
  onPropChange,
  onClose,
}) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : DRAWER_WIDTH,
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

  if (!config) return null;

  const propKeys = Object.keys(config.props);

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
            borderLeftColor: theme.colors.border,
            transform: [{ translateX }],
            zIndex: 11,
          },
        ]}
      >
        {/* Header */}
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.surface,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : undefined,
          }}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: 'bold',
                color: theme.colors.text,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              Props
            </Text>
            <Text
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textDisabled,
                marginTop: 2,
              }}
            >
              {config.title}
            </Text>
          </View>
        </SafeAreaView>

        {/* Controls */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
          {propKeys.length === 0 && (
            <Text
              style={{
                textAlign: 'center',
                padding: 24,
                color: theme.colors.textDisabled,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              No controllable props
            </Text>
          )}
          {propKeys.map((key) => {
            const propDef = config.props[key as keyof typeof config.props];
            return (
              <View
                key={key}
                style={[
                  styles.propCard,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                <PropControl
                  name={key}
                  definition={propDef}
                  value={currentProps[key]}
                  onChange={(v) => onPropChange(key, v)}
                />
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    borderLeftWidth: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  propCard: {
    padding: 10,
    borderWidth: 1,
  },
});
