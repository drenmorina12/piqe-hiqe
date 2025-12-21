import { fireEvent, render } from "@testing-library/react-native";
import CollectionCard from "../components/ui/CollectionCard";

// Mock icons -> stabil + pa "act" warnings
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
});

// Mock ProgressBar -> mos na prish testet/snapshot (sidomos nese ka animacione)
jest.mock("../components/ui/ProgressBar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function MockProgressBar(props) {
    return <View testID="progress-bar" {...props} />;
  };
});

// helper: gjen prindin ma t'afert qe ka onPress dhe e shtyp
const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) {
    cur = cur.parent;
  }
  if (!cur) throw new Error("No pressable parent found for this element");
  fireEvent.press(cur);
};

describe("CollectionCard (interaction)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("press on card calls onPress", () => {
    const onPress = jest.fn();
    const onDelete = jest.fn();

    const collection = { id: "c1", name: "Biology", completed: 1, cards: 5 };

    const { getByText } = render(
      <CollectionCard
        collection={collection}
        onPress={onPress}
        onDelete={onDelete}
        gradientColors={["#000", "#111"]}
      />
    );

    // Shtype kartën duke nis prej tekstit të emrit, pastaj ngjit te Pressable me onPress
    pressClosestPressable(getByText("Biology"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("cancel delete closes modal and does not call onDelete", () => {
    const onPress = jest.fn();
    const onDelete = jest.fn();

    const collection = { id: "c1", name: "Biology", completed: 1, cards: 5 };

    const { getByText, queryByText } = render(
      <CollectionCard
        collection={collection}
        onPress={onPress}
        onDelete={onDelete}
        gradientColors={["#000", "#111"]}
      />
    );

    // Hape Options (3 pikat)
    pressClosestPressable(getByText("ellipsis-vertical"));
    expect(getByText("Options")).toBeTruthy();

    // Hape Confirm delete
    pressClosestPressable(getByText("Delete collection"));
    expect(getByText("Confirm delete")).toBeTruthy();

    // Cancel -> mbyllet modali, dhe s'thirret onDelete
    pressClosestPressable(getByText("Cancel"));
    expect(queryByText("Confirm delete")).toBeNull();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
