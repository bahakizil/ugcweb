import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const initializeStatusBar = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Set status bar style based on initial theme
    const isDark = document.documentElement.classList.contains('dark');
    await setStatusBarTheme(isDark ? 'dark' : 'light');

    // Show status bar if hidden
    await StatusBar.show();
  } catch (error) {
    console.error('Status bar initialization error:', error);
  }
};

export const setStatusBarTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    if (theme === 'dark') {
      // Dark theme: light content (white text/icons) on dark background
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#020617' }); // slate-950
    } else {
      // Light theme: dark content (dark text/icons) on light background
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f8fafc' }); // slate-50
    }
  } catch (error) {
    console.error('Status bar theme error:', error);
  }
};

export const hideStatusBar = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await StatusBar.hide();
  } catch (error) {
    console.error('Status bar hide error:', error);
  }
};

export const showStatusBar = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await StatusBar.show();
  } catch (error) {
    console.error('Status bar show error:', error);
  }
};
