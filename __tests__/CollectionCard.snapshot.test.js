import { render } from "@testing-library/react-native";
import CollectionCard from "../components/ui/CollectionCard";

// Mock icons (që snapshots me qenë stabil)
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }) => React.createElement(Text, null, name),
  };
});

// Mock ProgressBar (që me qenë stabil + pa animacione)
jest.mock("../components/ui/ProgressBar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return (props) => React.createElement(View, { testID: "progressbar", ...props });
});

test("CollectionCard snapshot (not completed)", () => {
  const { toJSON } = render(
    <CollectionCard
      collection={{ id: "c1", name: "Algorithms", cards: 10, completed: 2 }}
      onPress={() => {}}
      gradientColors={["#111", "#222"]}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});
