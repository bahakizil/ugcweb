import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/**
 * Trigger a light haptic feedback
 * Use for: button taps, selections, minor interactions
 */
export const hapticLight = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger a medium haptic feedback
 * Use for: important buttons, form submissions
 */
export const hapticMedium = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger a heavy haptic feedback
 * Use for: major actions, destructive actions
 */
export const hapticHeavy = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger a success notification haptic
 * Use for: successful operations, task completion
 */
export const hapticSuccess = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger a warning notification haptic
 * Use for: warnings, cautions
 */
export const hapticWarning = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger an error notification haptic
 * Use for: errors, failures
 */
export const hapticError = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

/**
 * Trigger a selection haptic (iOS only)
 * Use for: changing selections in pickers or sliders
 */
export const hapticSelection = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch (error) {
    console.error('Haptic error:', error);
  }
};

// Vibrate for a specific duration (Android style, also works on iOS)
export const vibrate = async (duration: number = 300): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.vibrate({ duration });
  } catch (error) {
    console.error('Haptic error:', error);
  }
};
