/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Minimalist white and gray color scheme
const grayPrimary = '#6B7280';
const grayDark = '#1F2937';
const grayMedium = '#9CA3AF';
const grayLight = '#E5E7EB';
const grayBg = '#F9FAFB';

export const Colors = {
  light: {
    text: grayDark,              // #1F2937 - Dark gray for text
    background: '#fff',          // #FFFFFF - White background
    tint: grayPrimary,           // #6B7280 - Medium gray primary
    icon: grayMedium,            // #9CA3AF - Medium gray for icons
    tabIconDefault: '#D1D5DB',   // Light gray for inactive tabs
    tabIconSelected: grayPrimary,// #6B7280 - Gray for active tab
    border: grayLight,           // #E5E7EB - Light gray borders
    card: '#fff',                // White card background
    inputBg: grayBg,             // #F9FAFB - Light gray input background
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: grayPrimary,
    icon: grayMedium,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: grayPrimary,
    border: grayLight,
    card: '#1C1E1F',
    inputBg: '#1C1E1F',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
