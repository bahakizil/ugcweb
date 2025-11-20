import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

let isInitialized = false;

export const initializePushNotifications = async (userId: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push: Not a native platform, skipping initialization');
    return false;
  }

  if (isInitialized) {
    console.log('Push: Already initialized');
    return true;
  }

  try {
    // Request permission
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      // Register with Apple Push Notification service
      await PushNotifications.register();

      // On registration success
      await PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration success, token: ' + token.value);

        // Save the token to Supabase for later use
        await savePushToken(userId, token.value);
      });

      // On registration error
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Push registration error: ', error);
      });

      // Show notification when app is in foreground
      await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push notification received: ', notification);

          // You can show a custom UI here or use the default notification
        }
      );

      // Handle notification action (when user taps on notification)
      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log('Push notification action performed', notification);

          // Navigate to gallery if it's a video completion notification
          if (notification.notification.data?.type === 'video_complete') {
            // You can use React Router here to navigate
            window.location.href = '/dashboard/gallery';
          }
        }
      );

      isInitialized = true;
      console.log('Push: Initialized successfully');
      return true;
    } else {
      console.warn('Push: Permission not granted');
      return false;
    }
  } catch (error) {
    console.error('Push: Initialization failed', error);
    return false;
  }
};

const savePushToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Save or update the push token in the profiles table
    await supabase
      .from('profiles')
      .update({
        push_token: token,
        push_token_updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    console.log('Push token saved to database');
  } catch (error) {
    console.error('Failed to save push token:', error);
  }
};

export const checkPushPermissions = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  if (!Capacitor.isNativePlatform()) {
    return 'denied';
  }

  try {
    const permStatus = await PushNotifications.checkPermissions();
    return permStatus.receive;
  } catch (error) {
    console.error('Failed to check push permissions:', error);
    return 'denied';
  }
};

export const removePushToken = async (userId: string): Promise<void> => {
  try {
    // Remove token from database (e.g., on logout)
    await supabase
      .from('profiles')
      .update({
        push_token: null,
      })
      .eq('id', userId);

    console.log('Push token removed from database');
  } catch (error) {
    console.error('Failed to remove push token:', error);
  }
};

// Backend function to send push notification (to be called from n8n or Supabase Edge Function)
// This is a reference implementation - you'll implement this on your backend
export const sendPushNotificationReference = `
/**
 * Backend Implementation Reference (Node.js / Supabase Edge Function)
 *
 * This should be implemented in your n8n workflow or Supabase Edge Function
 * when a video generation is complete.
 */

// Using node-apn library for sending iOS push notifications
const apn = require('apn');

async function sendVideoCompleteNotification(userId, jobId) {
  // 1. Get user's push token from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('push_token')
    .eq('id', userId)
    .single();

  if (!profile?.push_token) {
    console.log('No push token found for user');
    return;
  }

  // 2. Configure APNs provider
  const provider = new apn.Provider({
    token: {
      key: process.env.APPLE_APN_KEY, // Your .p8 key file
      keyId: process.env.APPLE_APN_KEY_ID,
      teamId: process.env.APPLE_TEAM_ID,
    },
    production: true, // or false for development
  });

  // 3. Create notification
  const notification = new apn.Notification({
    alert: {
      title: 'Video Ready!',
      body: 'Your AI-generated video is ready to view.',
    },
    topic: 'com.aistudio.app', // Your bundle ID
    badge: 1,
    sound: 'default',
    payload: {
      type: 'video_complete',
      job_id: jobId,
    },
  });

  // 4. Send notification
  try {
    const result = await provider.send(notification, profile.push_token);
    console.log('Push notification sent:', result);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }

  provider.shutdown();
}
`;
