// __tests__/Profile.editPhotoModal_and_notifications.test.js
import { Switch } from "react-native";
import ProfileScreen from "../app/profile";
import { fireEvent, render, waitFor } from "../test-utils";

// -------------------------------
// ✅ Mock expo-image-picker (Camera + Gallery)
// -------------------------------
jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(async () => ({
    status: "granted",
    granted: true,
  })),
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({
    status: "granted",
    granted: true,
  })),

  launchCameraAsync: jest.fn(async () => ({
    canceled: false,
    cancelled: false,
    assets: [{ uri: "file://camera.jpg" }],
  })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    cancelled: false,
    assets: [{ uri: "file://library.jpg" }],
  })),
}));

// -------------------------------
// ✅ Mock expo-notifications (FIX: add SchedulableTriggerInputTypes.DATE)
// -------------------------------
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: "test-token" })),

  scheduleNotificationAsync: jest.fn(async () => "notif-id"),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}),
  getAllScheduledNotificationsAsync: jest.fn(async () => []),

  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),

  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {},

  // ✅ KJO ishte missing -> e përdor utils/notifications.js
  SchedulableTriggerInputTypes: {
    DATE: "date",
    TIME_INTERVAL: "timeInterval",
    CALENDAR: "calendar",
  },
}));

// -------------------------------
// ✅ Mock Firestore
// -------------------------------
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => ({})),
  updateDoc: jest.fn(async () => {}),
  setDoc: jest.fn(async () => {}),
  getDoc: jest.fn(async () => ({
    exists: () => false,
    data: () => ({}),
  })),
  collection: jest.fn(() => ({})),
  getDocs: jest.fn(async () => ({ docs: [] })),
}));

// -------------------------------
// ✅ Mock subjectService
// -------------------------------
jest.mock("../firebase/subjectService", () => ({
  fetchSubjects: jest.fn(async () => [{ id: "1" }, { id: "2" }]),
}));

// -------------------------------
// ✅ Mock notificationSettings (real names)
// -------------------------------
jest.mock("../firebase/notificationSettings", () => ({
  getUserNotificationsEnabled: jest.fn(async () => false),
  setUserNotificationsEnabled: jest.fn(async () => {}),
  getUserNotificationId: jest.fn(async () => null),
  setUserNotificationId: jest.fn(async () => {}),
}));

// -------------------------------
// ✅ Mock firebaseConfig + firebase/auth
// -------------------------------
jest.mock("../firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "u1", email: "aurela@test.com" } },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb({ uid: "u1", email: "aurela@test.com" });
    return () => {};
  }),
  signOut: jest.fn(async () => {}),
}));

// -------------------------------
// ✅ Mock expo-router
// -------------------------------
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn() },
}));

// -------------------------------
// helper: shtyp prindin ma t’afërt që ka onPress
// -------------------------------
const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) cur = cur.parent;
  if (!cur) throw new Error("No pressable parent found");
  fireEvent.press(cur);
};

describe("Profile - Edit photo modal + camera/gallery/remove", () => {
  const EDIT_RE = /^Edit$/i;
  const TAKE_RE = /B[ëe]j foton/i;
  const PICK_RE = /Ndrysho foton/i;
  const REMOVE_RE = /Largo foton/i;
  const CLOSE_RE = /Mbyll/i;

  test("opens edit modal and closes it", async () => {
    const { getByText, queryByText } = render(<ProfileScreen />);

    await waitFor(() => expect(getByText(EDIT_RE)).toBeTruthy());

    pressClosestPressable(getByText(EDIT_RE));
    expect(getByText(TAKE_RE)).toBeTruthy();
    expect(getByText(PICK_RE)).toBeTruthy();
    expect(getByText(REMOVE_RE)).toBeTruthy();

    pressClosestPressable(getByText(CLOSE_RE));

    await waitFor(() => {
      expect(queryByText(TAKE_RE)).toBeNull();
    });
  });

  test("pressing 'Bëj foton' calls ImagePicker.launchCameraAsync", async () => {
    const ImagePicker = require("expo-image-picker");
    ImagePicker.launchCameraAsync.mockClear();

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => expect(getByText(EDIT_RE)).toBeTruthy());
    pressClosestPressable(getByText(EDIT_RE));

    pressClosestPressable(getByText(TAKE_RE));

    await waitFor(() => {
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
  });

  test("pressing 'Ndrysho foton' calls ImagePicker.launchImageLibraryAsync", async () => {
    const ImagePicker = require("expo-image-picker");
    ImagePicker.launchImageLibraryAsync.mockClear();

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => expect(getByText(EDIT_RE)).toBeTruthy());
    pressClosestPressable(getByText(EDIT_RE));

    pressClosestPressable(getByText(PICK_RE));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  test("pressing 'Largo foton' calls firestore updateDoc or setDoc", async () => {
    const { updateDoc, setDoc } = require("firebase/firestore");
    updateDoc.mockClear();
    setDoc.mockClear();

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => expect(getByText(EDIT_RE)).toBeTruthy());
    pressClosestPressable(getByText(EDIT_RE));

    pressClosestPressable(getByText(REMOVE_RE));

    await waitFor(() => {
      expect(updateDoc.mock.calls.length + setDoc.mock.calls.length).toBeGreaterThan(0);
    });
  });
});

describe("Profile - Daily Notifications switch", () => {
  test("toggles Daily Notifications switch value AND calls setUserNotificationsEnabled", async () => {
    const notifSettings = require("../firebase/notificationSettings");
    notifSettings.setUserNotificationsEnabled.mockClear();

    const { getByText, UNSAFE_getAllByType } = render(<ProfileScreen />);

    await waitFor(() => expect(getByText(/Daily Notifications/i)).toBeTruthy());

    const switches = UNSAFE_getAllByType(Switch);
    expect(switches.length).toBeGreaterThanOrEqual(2);

    // rendi në JSX: 1) Dark Mode 2) Daily Notifications
    const notifSwitch = switches[1];
    const before = !!notifSwitch.props.value;

    fireEvent(notifSwitch, "valueChange", !before);

    await waitFor(() => {
      const updated = UNSAFE_getAllByType(Switch)[1];
      expect(!!updated.props.value).toBe(!before);
    });

    await waitFor(() => {
      expect(notifSettings.setUserNotificationsEnabled).toHaveBeenCalled();
    });
  });
});
