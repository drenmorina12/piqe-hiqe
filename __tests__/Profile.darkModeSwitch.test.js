// __tests__/Profile.darkModeSwitch.test.js
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Switch } from "react-native";

// ✅ Mock Theme hook (kështu s’ke nevojë ThemeProvider, s’ka AsyncStorage/act issues)
const mockToggleTheme = jest.fn();
jest.mock("../context/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      background: "#fff",
      card: "#fff",
      text: "#111",
      mutedText: "#666",
      primary: "#4F46E5",
      tint: "#4F46E5",
      border: "#ccc",
      overlay: "rgba(0,0,0,0.5)",
    },
    isDark: false,
    toggleTheme: mockToggleTheme,
  }),
}));

// ✅ Mock expo-router
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// ✅ Mock firebase/auth
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb({
      uid: "u1",
      email: "aurela@test.com",
      displayName: "Aurela",
    });
    return () => {};
  }),
  signOut: jest.fn(() => Promise.resolve()),
}));

// ✅ Mock firebaseConfig
jest.mock("../firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "u1" } },
  db: {},
}));

// ✅ Mock firestore (që mos me u thye te getDoc/updateDoc, etj)
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(async () => ({ exists: () => false, data: () => ({}) })),
  setDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(async () => ({ docs: [] })),
}));

// ✅ Mock subjectService
jest.mock("../firebase/subjectService", () => ({
  fetchSubjects: jest.fn(async () => [{ id: "1" }]),
}));

// ✅ Mock notification settings (që mos me dal “is not a function”)
jest.mock("../firebase/notificationSettings", () => ({
  getUserNotificationsEnabled: jest.fn(async () => false),
  setUserNotificationsEnabled: jest.fn(async () => {}),
}));

// ✅ Mock notifications utils (që mos me schedule/cancel real)
jest.mock("../utils/notifications", () => ({
  ensurePermissions: jest.fn(async () => true),
  scheduleDailyNotification: jest.fn(async () => "notif-id"),
  cancelDailyNotification: jest.fn(async () => {}),
}));

// ✅ Mock expo-notifications (nëse importohet diku poshtë)
jest.mock("expo-notifications", () => ({
  SchedulableTriggerInputTypes: { DATE: "date" },
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: "test-token" })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {},
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
}));

import ProfileScreen from "../app/profile";

describe("Profile - Dark Mode switch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("toggling Dark Mode calls toggleTheme", async () => {
    const { getByText, UNSAFE_getAllByType } = render(<ProfileScreen />);

    // prit deri sa me u shfaq UI (authReady -> true)
    await waitFor(() => {
      expect(getByText("Dark Mode")).toBeTruthy();
    });

    // gjeje Switch-in që e ka onValueChange = toggleTheme
    const switches = UNSAFE_getAllByType(Switch);
    const darkModeSwitch = switches.find(
      (s) => s?.props?.onValueChange === mockToggleTheme
    );

    expect(darkModeSwitch).toBeTruthy();

    // trigger switch
    fireEvent(darkModeSwitch, "valueChange", true);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
