import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ThemeProvider, useTheme } from '@component-docs/theme';
import { generateInitialProps } from '@component-docs/core';
import type {
  DocAppConfig,
  DocRoute,
  SettingDefinition,
  ComponentDocConfig,
} from '@component-docs/core';
import { NavDrawer } from './NavDrawer';
import { PropsDrawer } from './PropsDrawer';
import { WelcomeScreen } from './WelcomeScreen';
import { SettingsScreen } from './SettingsScreen';
import { ComponentDocView } from './ComponentDocView';
import { CallbackToastProvider, useCallbackToast } from './CallbackToast';

// ─── Component List Screen ────────────────────────────────────────────────────

interface ComponentListScreenProps {
  config: DocAppConfig;
  onSelect: (id: string) => void;
}

const ComponentListScreen: React.FC<ComponentListScreenProps> = ({ config, onSelect }) => {
  const { theme } = useTheme();

  const grouped: Record<string, ComponentDocConfig[]> = {};
  config.components.forEach((c) => {
    const cat = c.category ?? 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(c);
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text
        style={{
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
        }}
      >
        Components
      </Text>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xl,
        }}
      >
        {config.components.length} component
        {config.components.length !== 1 ? 's' : ''} available
      </Text>

      {Object.entries(grouped).map(([category, components]) => (
        <View key={category} style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: 'bold',
              color: theme.colors.textDisabled,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: theme.spacing.sm,
            }}
          >
            {category}
          </Text>
          {components.map((comp) => {
            const id = comp.id ?? comp.title;
            return (
              <TouchableOpacity
                key={id}
                onPress={() => onSelect(id)}
                style={[
                  styles.compCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: theme.spacing.md,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.compCardRow}>
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.md,
                      fontWeight: 'bold',
                      color: theme.colors.text,
                    }}
                  >
                    {comp.title}
                  </Text>
                  {comp.deprecated && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: theme.colors.warning + '22' },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.warning,
                        }}
                      >
                        deprecated
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.textSecondary,
                  }}
                  numberOfLines={2}
                >
                  {comp.description}
                </Text>
                <Text
                  style={{
                    marginTop: theme.spacing.sm,
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.primary,
                    fontWeight: 'bold',
                  }}
                >
                  {Object.keys(comp.props).length} props →
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

// ─── Slider / Controls icon (single-tone, no external deps) ─────────────────

const SliderIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 18 }) => {
  const lineH = Math.round(size * 0.1);
  const knobD = Math.round(size * 0.32);
  const lines = [
    { top: Math.round(size * 0.08), knobLeft: Math.round(size * 0.52) },
    { top: Math.round(size * 0.45), knobLeft: Math.round(size * 0.2) },
    { top: Math.round(size * 0.82), knobLeft: Math.round(size * 0.6) },
  ];
  return (
    <View style={{ width: size, height: size }}>
      {lines.map((l, i) => (
        <React.Fragment key={i}>
          {/* Line */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: l.top,
              height: lineH,
              backgroundColor: color,
              borderRadius: lineH / 2,
            }}
          />
          {/* Knob circle */}
          <View
            style={{
              position: 'absolute',
              left: l.knobLeft,
              top: l.top + lineH / 2 - knobD / 2,
              width: knobD,
              height: knobD,
              borderRadius: knobD / 2,
              backgroundColor: color,
            }}
          />
        </React.Fragment>
      ))}
    </View>
  );
};

// ─── Top Bar ─────────────────────────────────────────────────────────────────

interface TopBarProps {
  title: string;
  subtitle?: string;
  showPropsButton: boolean;
  onMenuPress: () => void;
  onPropsPress: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showPropsButton,
  onMenuPress,
  onPropsPress,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.topBar,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn} activeOpacity={0.7}>
        <Text style={{ fontSize: 20, color: theme.colors.text }}>☰</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: 'bold',
            color: theme.colors.text,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.textSecondary,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {showPropsButton && (
        <TouchableOpacity onPress={onPropsPress} style={styles.iconBtn} activeOpacity={0.7}>
          <SliderIcon color={theme.colors.text} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── DocApp Inner ─────────────────────────────────────────────────────────────

function buildInitialSettings(defs?: SettingDefinition[]): Record<string, any> {
  const vals: Record<string, any> = {};
  defs?.forEach((d) => {
    vals[d.key] = d.defaultValue;
  });
  return vals;
}

function DocAppInner({ config }: { config: DocAppConfig }) {
  const { theme } = useTheme();
  const { notify } = useCallbackToast();

  const defaultRoute: DocRoute =
    config.defaultRoute === 'previews'
      ? { page: 'previews' }
      : config.defaultRoute === 'settings'
      ? { page: 'settings' }
      : { page: 'welcome' };

  const [route, setRoute] = useState<DocRoute>(defaultRoute);
  const [settings, setSettings] = useState<Record<string, any>>(
    buildInitialSettings(config.settings),
  );
  const [navOpen, setNavOpen] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Per-component props state
  const [componentProps, setComponentProps] = useState<Record<string, Record<string, any>>>(() => {
    const init: Record<string, Record<string, any>> = {};
    config.components.forEach((c) => {
      const id = c.id ?? c.title;
      const base = generateInitialProps(c.props);
      // Inject function stubs for function-type props
      Object.entries(c.props).forEach(([key, def]) => {
        if (
          (def.control as string) === 'function' ||
          (def.type?.includes('=>') && def.control == null)
        ) {
          // Ignore args from the component — they may be SyntheticEvents (circular/released)
          base[key] = () => notify(key, []);
        }
      });
      init[id] = base;
    });
    return init;
  });

  const selectedComponent = useMemo(() => {
    if (route.page !== 'previews') return null;
    const r = route as { page: 'previews'; selectedId?: string };
    if (!r.selectedId) return null;
    return config.components.find((c) => (c.id ?? c.title) === r.selectedId) ?? null;
  }, [route, config.components]);

  const handlePropChange = useCallback(
    (key: string, value: any) => {
      if (!selectedComponent) return;
      const id = selectedComponent.id ?? selectedComponent.title;
      const propDef = selectedComponent.props[key as keyof typeof selectedComponent.props];
      // Preserve function wrapper — don't let external value overwrite the stub
      if (
        propDef &&
        ((propDef.control as string) === 'function' ||
          (propDef.type?.includes('=>') && propDef.control == null))
      ) {
        return;
      }
      setComponentProps((prev) => ({
        ...prev,
        [id]: { ...prev[id], [key]: value },
      }));
    },
    [selectedComponent],
  );

  const navLabels = {
    welcome: config.navLabels?.welcome ?? 'Welcome',
    previews: config.navLabels?.previews ?? 'Components',
    settings: config.navLabels?.settings ?? 'Settings',
  };

  // TopBar title based on route
  const topBarTitle =
    route.page === 'welcome'
      ? navLabels.welcome
      : route.page === 'settings'
      ? navLabels.settings
      : selectedComponent
      ? selectedComponent.title
      : navLabels.previews;

  const topBarSubtitle =
    route.page === 'previews' && selectedComponent ? selectedComponent.category : undefined;

  const showPropsButton = route.page === 'previews' && !!selectedComponent;

  const currentCompProps = selectedComponent
    ? componentProps[selectedComponent.id ?? selectedComponent.title] ?? {}
    : {};

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
      }}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      {/* Top bar */}
      <TopBar
        title={topBarTitle}
        subtitle={topBarSubtitle}
        showPropsButton={showPropsButton}
        onMenuPress={() => setNavOpen(true)}
        onPropsPress={() => setPropsOpen(true)}
      />

      {/* Content — fills remaining space with background color */}
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {route.page === 'welcome' && (
          <WelcomeScreen
            config={config}
            navLabels={navLabels}
            onStart={() => setRoute({ page: 'previews' })}
          />
        )}
        {route.page === 'previews' && !selectedComponent && (
          <ComponentListScreen
            config={config}
            onSelect={(id) => setRoute({ page: 'previews', selectedId: id })}
          />
        )}
        {route.page === 'previews' && selectedComponent && (
          <ComponentDocView
            config={selectedComponent}
            currentProps={currentCompProps}
            onPropChange={handlePropChange}
            onFullscreen={() => setFullscreen(true)}
          />
        )}
        {route.page === 'settings' && (
          <SettingsScreen
            settings={config.settings ?? []}
            values={settings}
            onChange={(key, value) => setSettings((prev) => ({ ...prev, [key]: value }))}
            title={navLabels.settings}
          />
        )}
      </View>

      {/* Left nav drawer */}
      <NavDrawer
        config={config}
        route={route}
        navLabels={navLabels}
        visible={navOpen}
        onNavigate={setRoute}
        onClose={() => setNavOpen(false)}
      />

      {/* Right props drawer */}
      <PropsDrawer
        config={selectedComponent}
        currentProps={currentCompProps}
        visible={propsOpen}
        onPropChange={handlePropChange}
        onClose={() => setPropsOpen(false)}
      />

      {/* ── Fullscreen preview overlay ── */}
      {/* Absolute view at root level (no Modal) — safe from nested-modal issues */}
      {fullscreen && selectedComponent && (() => {
        const FullComp = selectedComponent.component as React.ComponentType<Record<string, unknown>>;
        return (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100,
              backgroundColor: theme.colors.background,
            }}
          >
            {/* Component centered so small components are visible; full-screen components fill via alignSelf:'stretch' */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <FullComp {...currentCompProps} />
            </View>

            {/* Floating exit button — always on top */}
            <TouchableOpacity
              onPress={() => setFullscreen(false)}
              activeOpacity={0.85}
              style={[
                styles.exitBtn,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  shadowColor: '#000',
                },
              ]}
            >
              <Text style={{ fontSize: 16, color: theme.colors.text }}>✕</Text>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text,
                  marginLeft: 6,
                  fontWeight: 'bold',
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </SafeAreaView>
  );
}

// ─── Public DocApp component ──────────────────────────────────────────────────

interface DocAppProps {
  config: DocAppConfig;
}

export const DocApp: React.FC<DocAppProps> = ({ config }) => {
  return (
    <ThemeProvider defaultMode={config.initialTheme ?? 'light'}>
      <CallbackToastProvider>
        <DocAppInner config={config} />
      </CallbackToastProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compCard: {
    padding: 16,
    borderWidth: 1,
  },
  compCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  exitBtn: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
