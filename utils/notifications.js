import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const KEYS = {
  lastOpen: 'last_open_date',
  dailyId: 'daily_notification_id',
};

// ===============================
// NOTIFICATION HANDLER
// ===============================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// YYYY-MM-DD
function today() {
  return new Date().toISOString().slice(0, 10);
}

// ===============================
// APP USAGE
// ===============================
export async function updateLastOpenDate() {
  await AsyncStorage.setItem(KEYS.lastOpen, today());
}

export async function getLastOpenDate() {
  return AsyncStorage.getItem(KEYS.lastOpen);
}

// ===============================
// PERMISSIONS
// ===============================
export async function ensurePermissions() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const res = await Notifications.requestPermissionsAsync();
    if (res.status !== 'granted') return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

// ===============================
// DAILY REMINDER
// ===============================
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  const oldId = await AsyncStorage.getItem(KEYS.dailyId);
  if (oldId) {
    await Notifications.cancelScheduledNotificationAsync(oldId);
  }

  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Piqe-Hiqe 🧠',
      body: 'Sot nuk ke studiuar ende. Hape aplikacionin dhe mëso pak!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  await AsyncStorage.setItem(KEYS.dailyId, id);
}

// ===============================
// CANCEL
// ===============================
export async function cancelDailyReminder() {
  const id = await AsyncStorage.getItem(KEYS.dailyId);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(KEYS.dailyId);
  }
}
