/**
 * Type shim for 'react-native' when used in the web-demo.
 * At runtime, Vite aliases 'react-native' → 'react-native-web'.
 * This shim just re-exports everything so TypeScript doesn't complain.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'react-native' {
  import type React from 'react';

  export interface ViewStyle {
    [key: string]: any;
  }
  export interface TextStyle {
    [key: string]: any;
  }
  export interface ImageStyle {
    [key: string]: any;
  }

  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const TouchableOpacity: React.ComponentType<any>;
  export const TouchableWithoutFeedback: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const Switch: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;
  export const FlatList: React.ComponentType<any>;
  export const SectionList: React.ComponentType<any>;
  export const Animated: any;
  export const Platform: { OS: string; select: (obj: any) => any };
  export const StatusBar: { currentHeight?: number; [key: string]: any };
  export const Dimensions: { get: (dim: string) => { width: number; height: number } };
  export type LayoutChangeEvent = { nativeEvent: { layout: { x: number; y: number; width: number; height: number } } };

  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
    absoluteFillObject: any;
    flatten: (style: any) => any;
  };
}
