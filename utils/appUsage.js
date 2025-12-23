import {
    cancelDailyReminder,
    ensurePermissions,
    getLastOpenDate,
    scheduleDailyReminder,
    updateLastOpenDate,
} from './notifications';

import { getUserNotificationsEnabled } from '../firebase/notificationSettings';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function onAppOpened(user) {
  if (!user) return;

  const lastOpen = await getLastOpenDate();

  if (lastOpen === today()) {
    await cancelDailyReminder();
  }

  await updateLastOpenDate();

  const enabled = await getUserNotificationsEnabled(user.uid);
  if (!enabled) return;

  const ok = await ensurePermissions();
  if (!ok) return;

  await scheduleDailyReminder(20, 0);
}
