import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { DocAppConfig, DocRoute, DocNavLabels, ComponentDocConfig } from '@component-docs/core';

interface SidebarProps {
  config: DocAppConfig;
  route: DocRoute;
  navLabels: Required<DocNavLabels>;
  onNavigate: (route: DocRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, route, navLabels, onNavigate }) => {
  const { theme } = useTheme();

  const isActive = (page: string) => route.page === page;
  const selectedId = route.page === 'previews' ? (route as any).selectedId : undefined;

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    backgroundColor: active ? theme.colors.primary + '22' : 'transparent',
    color: active ? theme.colors.primary : theme.colors.text,
    fontWeight: active
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.regular,
    fontSize: theme.typography.fontSize.sm,
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'background-color 0.15s',
  });

  // Group components by category
  const grouped: Record<string, ComponentDocConfig[]> = {};
  config.components.forEach((c) => {
    const cat = c.category ?? 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(c);
  });

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}
    >
      {/* App title */}
      <div
        style={{
          padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
          borderBottom: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
          }}
        >
          {config.title}
        </div>
        {config.version && (
          <div
            style={{
              marginTop: 2,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.textDisabled,
            }}
          >
            v{config.version}
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav
        style={{
          padding: `${theme.spacing.sm}px`,
          borderBottom: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
        }}
      >
        <button
          style={navItemStyle(isActive('welcome'))}
          onClick={() => onNavigate({ page: 'welcome' })}
        >
          🏠 {navLabels.welcome}
        </button>
        <button
          style={navItemStyle(isActive('previews'))}
          onClick={() => onNavigate({ page: 'previews' })}
        >
          📦 {navLabels.previews}
        </button>
        <button
          style={navItemStyle(isActive('settings'))}
          onClick={() => onNavigate({ page: 'settings' })}
        >
          ⚙️ {navLabels.settings}
        </button>
      </nav>

      {/* Component list (only on previews page) */}
      {route.page === 'previews' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: `${theme.spacing.sm}px`,
          }}
        >
          {Object.entries(grouped).map(([category, components]) => (
            <div key={category} style={{ marginBottom: theme.spacing.sm }}>
              <div
                style={{
                  padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textDisabled,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {category}
              </div>
              {components.map((comp) => {
                const id = comp.id ?? comp.title;
                return (
                  <button
                    key={id}
                    style={{
                      ...navItemStyle(selectedId === id),
                      paddingLeft: theme.spacing.xl,
                    }}
                    onClick={() => onNavigate({ page: 'previews', selectedId: id })}
                  >
                    {comp.title}
                    {comp.deprecated && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.warning,
                        }}
                      >
                        deprecated
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
