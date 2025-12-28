import CollectionCard from "../components/ui/CollectionCard";
import { fireEvent, render, waitFor } from "../test-utils";

// Mock icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Ionicons: ({ name }) => React.createElement(Text, null, name) };
});

// Mock ProgressBar
jest.mock("../components/ui/ProgressBar", () => {
  const React = require("react");
  const { View } = require("react-native");
  return (props) => React.createElement(View, { testID: "progress-bar", ...props });
});

const OPTIONS_RE = /Options|Opsione|Opsionet/i;
const DELETE_RE = /Delete collection|Fshi koleksionin|Fshije koleksionin/i; // ✅ fix
const CANCEL_RE = /Cancel|Anulo/i;
const CONFIRM_RE = /Confirm|Konfirmo/i;

const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) cur = cur.parent;
  if (!cur) throw new Error("No pressable parent found for this element");
  fireEvent.press(cur);
};

describe("CollectionCard (interaction)", () => {
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

    pressClosestPressable(getByText("Biology"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("cancel delete closes modal and does not call onDelete", async () => {
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

    // open options
    pressClosestPressable(getByText("ellipsis-vertical"));
    expect(getByText(OPTIONS_RE)).toBeTruthy();

    // open confirm
    pressClosestPressable(getByText(DELETE_RE));

    await waitFor(() => {
      expect(getByText(CONFIRM_RE)).toBeTruthy();
    });

    // cancel confirm
    pressClosestPressable(getByText(CANCEL_RE));

    await waitFor(() => {
      expect(queryByText(CONFIRM_RE)).toBeNull();
    });

    expect(onDelete).not.toHaveBeenCalled();
  });
});
