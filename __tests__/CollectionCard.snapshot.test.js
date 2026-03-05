import CollectionCard from "../components/ui/CollectionCard";
import { render } from "../test-utils";

jest.mock("../components/ui/ProgressBar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return (props) => React.createElement(View, { testID: "progressbar", ...props });
});

test("CollectionCard renders name and progress text", () => {
  const { getByText, getByTestId, toJSON } = render(
    <CollectionCard
      collection={{ id: "c1", name: "Algorithms", cards: 10, completed: 2 }}
      onPress={() => {}}
      onDelete={() => {}}
      gradientColors={["#111", "#222"]}
    />
  );

  expect(getByText("Algorithms")).toBeTruthy();
  expect(getByText(/2\s*\/\s*10/i)).toBeTruthy();
  expect(getByTestId("progressbar")).toBeTruthy();
  expect(toJSON()).toBeTruthy();
});
