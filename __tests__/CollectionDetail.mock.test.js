import { render, waitFor } from "../test-utils";

import CollectionDetailScreen from "../app/subjects/[subjectId]/collections/[collectionId]";

import { fetchCards } from "../firebase/cardService";
import { getCollectionById } from "../firebase/collectionService";
import { getSubjectById } from "../firebase/subjectService";

// expo-router mock
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// useFocusEffect mock once
jest.mock("@react-navigation/native", () => {
  const React = require("react");
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useFocusEffect: (effect) => {
      React.useEffect(() => {
        const cleanup = effect?.();
        return cleanup;
      }, []);
    },
  };
});

// services mocks
jest.mock("../firebase/subjectService", () => ({ getSubjectById: jest.fn() }));
jest.mock("../firebase/collectionService", () => ({ getCollectionById: jest.fn() }));
jest.mock("../firebase/cardService", () => ({
  fetchCards: jest.fn(),
  addCard: jest.fn(),
  deleteCard: jest.fn(),
  resetCardsDifficulty: jest.fn(),
}));

describe("CollectionDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useLocalSearchParams } = require("expo-router");
    useLocalSearchParams.mockReturnValue({ subjectId: "s1", collectionId: "c1" });
  });

  it("loads subject, collection and cards on mount", async () => {
    getSubjectById.mockResolvedValue({ id: "s1", name: "Math" });
    getCollectionById.mockResolvedValue({ id: "c1", name: "Chapter 1" });
    fetchCards.mockResolvedValue([
      { id: "card1", question: "Q1", answer: "A1" },
      { id: "card2", question: "Q2", answer: "A2" },
    ]);

    render(<CollectionDetailScreen />);

    await waitFor(() => expect(getSubjectById).toHaveBeenCalledWith("s1"));
    await waitFor(() => expect(getCollectionById).toHaveBeenCalledWith("s1", "c1"));
    await waitFor(() => expect(fetchCards).toHaveBeenCalled());
  });
});
