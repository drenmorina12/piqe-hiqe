import { render, waitFor } from "../test-utils";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("../firebase/subjectService", () => ({
  fetchSubjects: jest.fn(),
}));

jest.mock("../firebase/firebaseConfig", () => ({
  auth: { currentUser: { uid: "u1" } },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => {
    cb({ uid: "u1" });
    return () => {};
  }),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

test("Profile calls fetchSubjects", async () => {
  const { fetchSubjects } = require("../firebase/subjectService");
  fetchSubjects.mockResolvedValue([{ id: "1" }, { id: "2" }]);

  const ProfileScreen = require("../app/profile").default;

  render(<ProfileScreen />);

  await waitFor(() => {
    expect(fetchSubjects).toHaveBeenCalled();
  });
});
