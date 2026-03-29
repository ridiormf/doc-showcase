const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all workspace files
config.watchFolders = [workspaceRoot];

// Resolve from local node_modules first, then workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Force a single React/RN instance across ALL workspace packages.
//
// WHY: pnpm creates per-package symlinks in node_modules for peer deps.
// e.g. packages/native/node_modules/react → react@19.2.4
//      apps/native-demo/node_modules/react → react@19.0.0
//
// Metro's extraNodeModules is a FALLBACK (used only when no local match is found),
// so pnpm symlinks take priority. resolveRequest runs FIRST and overrides everything.
//
// Without this, any workspace package that has a react symlink (even react@19.x)
// ends up as a DIFFERENT instance from the app, causing:
//   "Invalid hook call" / "Cannot read property 'useState' of null"
const FORCED_FROM_APP = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-native',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (FORCED_FROM_APP.some(m => moduleName === m || moduleName.startsWith(m + '/'))) {
    return {
      filePath: require.resolve(moduleName, {
        paths: [path.resolve(projectRoot, 'node_modules')],
      }),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// NOTE: Do NOT set disableHierarchicalLookup = true when using pnpm.
module.exports = mergeConfig(config, {});
