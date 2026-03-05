// __tests__/Profile.imagePicker.test.js
import * as ImagePicker from "expo-image-picker";
import ProfileScreen from "../app/profile";
import { fireEvent, render, waitFor } from "../test-utils";

// ✅ expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// ✅ expo-image -> stable
jest.mock("expo-image", () => {
  const React = require("react");
  const RN = require("react-native");
  return {
    Image: (props) => React.createElement(RN.Image, props),
  };
});

// ✅ expo-image-picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({
    status: "granted",
    granted: true, // ✅ kjo është e rëndësishme për kodin tënd
  })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [{ uri: "file://picked.jpg" }],
  })),
  MediaTypeOptions: { Images: "Images" },
}));

// ✅ expo-notifications safe mock
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: "test-token" })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {},
  SchedulableTriggerInputTypes: { DATE: "date" },
  scheduleNotificationAsync: jest.fn(async () => "notif-id"),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
}));

// ✅ notification settings (që mos me crash në mount)
jest.mock("../firebase/notificationSettings", () => ({
  getUserNotificationsEnabled: jest.fn(async () => false),
  setUserNotificationsEnabled: jest.fn(async () => {}),
}));

// ✅ subject service
jest.mock("../firebase/subjectService", () => ({
  fetchSubjects: jest.fn(async () => []),
}));

// ✅ firestore mocks
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(async () => {}),
  setDoc: jest.fn(async () => {}),
  getDoc: jest.fn(async () => ({
    exists: () => false,
    data: () => ({}),
  })),
  collection: jest.fn(),
  getDocs: jest.fn(async () => ({ docs: [] })),
}));

// ✅ firebaseConfig + auth
jest.mock("../firebase/firebaseConfig", () => ({
  auth: {
    currentUser: {
      uid: "u1",
      email: "aurela@test.com",
      displayName: "Aurela",
    },
  },
  db: {},
}));

// ✅ firebase/auth
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb({ uid: "u1", email: "aurela@test.com", displayName: "Aurela" });
    return () => {};
  }),
  signOut: jest.fn(async () => {}),
}));

// helper: press prindin më të afërt me onPress
const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) cur = cur.parent;
  if (!cur) throw new Error("No pressable parent found");
  fireEvent.press(cur);
};

describe("Profile - Edit Photo (ImagePicker)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ fix për "alert is not defined"
    global.alert = jest.fn();
  });

  test("opens edit modal and calls ImagePicker when pressing 'Ndrysho foton'", async () => {
    const { getByText } = render(<ProfileScreen />);

    // prit sa të shfaqet UI
    await waitFor(() => {
      expect(getByText("Edit")).toBeTruthy();
    });

    // hape modalin
    pressClosestPressable(getByText("Edit"));

    // kliko "Ndrysho foton"
    pressClosestPressable(getByText("Ndrysho foton"));

    // verifiko calls
    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    // sigurohu që alert s’u thirr (pra permissions ishin granted)
    expect(global.alert).not.toHaveBeenCalled();
  });
});
