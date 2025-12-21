import { render, waitFor } from "@testing-library/react-native";

// 1) Mock Firestore (fix "Unexpected token export")
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

// 2) Mock subjectService me jest.fn() (pa variabla jashtë)
jest.mock("../firebase/subjectService", () => ({
  fetchSubjects: jest.fn(),
}));

// 3) Mock firebaseConfig (mos lejo import real)
jest.mock("../firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "u1" } },
  db: {},
}));

// 4) Mock firebase/auth
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb({ uid: "u1" });
    return () => {};
  }),
  signOut: jest.fn(() => Promise.resolve()),
}));

// 5) Mock expo-router (nëse e përdor)
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

import ProfileScreen from "../app/profile";
import { fetchSubjects } from "../firebase/subjectService";

test("Profile calls fetchSubjects", async () => {
  fetchSubjects.mockResolvedValue([{ id: "1" }, { id: "2" }]);

  render(<ProfileScreen />);

  await waitFor(() => {
    expect(fetchSubjects).toHaveBeenCalled();
  });
});
