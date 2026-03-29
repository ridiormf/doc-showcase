import React, { useState, useCallback, useMemo } from 'react';
import { ThemeProvider, useTheme } from '@component-docs/theme';
import { lightTheme, darkTheme } from '@component-docs/theme';
import { generateInitialProps } from '@component-docs/core';
import type { DocAppConfig, DocRoute, SettingDefinition } from '@component-docs/core';
import { Sidebar } from './Sidebar';
import { WelcomeScreen } from './WelcomeScreen';
import { SettingsScreen } from './SettingsScreen';
import { PropsPanel } from './PropsPanel';
import { ComponentDocArea, ComponentListScreen } from './ComponentDocArea';
import { CallbackToastProvider, useCallbackToast } from './CallbackToast';

function buildInitialSettings(defs?: SettingDefinition[]): Record<string, any> {
  const vals: Record<string, any> = {};
  defs?.forEach((d) => {
    vals[d.key] = d.defaultValue;
  });
  return vals;
}

function DocAppInner({ config }: { config: DocAppConfig }) {
  const { theme, setTheme } = useTheme();
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

  // Props state per component (keyed by id or title)
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

  const handleSettingChange = useCallback(
    (key: string, value: any) => {
      // Built-in: dark mode toggle
      if (key === '__theme') {
        setTheme(value ? darkTheme : lightTheme);
        return;
      }
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setTheme],
  );

  const navLabels = {
    welcome: config.navLabels?.welcome ?? 'Welcome',
    previews: config.navLabels?.previews ?? 'Components',
    settings: config.navLabels?.settings ?? 'Settings',
  };

  const showRightPanel = route.page === 'previews' && !!selectedComponent;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: showRightPanel ? '240px 1fr 280px' : '240px 1fr',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.fontFamily.regular,
      }}
    >
      {/* Left: Sidebar */}
      <Sidebar
        config={config}
        route={route}
        navLabels={navLabels}
        onNavigate={setRoute}
      />

      {/* Center */}
      <div style={{ overflow: 'auto', minWidth: 0 }}>
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
            theme={theme}
          />
        )}
        {route.page === 'previews' && selectedComponent && (
          <ComponentDocArea
            config={selectedComponent}
            currentProps={
              componentProps[selectedComponent.id ?? selectedComponent.title] ?? {}
            }
            onPropChange={handlePropChange}
          />
        )}
        {route.page === 'settings' && (
          <SettingsScreen
            settings={config.settings ?? []}
            values={settings}
            onChange={handleSettingChange}
            title={navLabels.settings}
          />
        )}
      </div>

      {/* Right: Props Panel (only when a component is selected) */}
      {showRightPanel && selectedComponent && (
        <PropsPanel
          config={selectedComponent}
          currentProps={
            componentProps[selectedComponent.id ?? selectedComponent.title] ?? {}
          }
          onPropChange={handlePropChange}
        />
      )}
    </div>
  );
}

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
