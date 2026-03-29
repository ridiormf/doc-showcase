/**
 * Entry point for the native-demo React Native app.
 * This is a bare React Native project (no Expo) used to test @component-docs/native.
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
