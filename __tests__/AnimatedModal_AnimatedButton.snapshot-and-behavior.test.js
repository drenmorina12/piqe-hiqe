import { Text, TouchableWithoutFeedback } from "react-native";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedModal from "../components/ui/AnimatedModal";
import { fireEvent, render } from "../test-utils";

const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) cur = cur.parent;
  if (!cur) throw new Error("No pressable parent found");
  fireEvent.press(cur);
};

describe("AnimatedModal", () => {
  test("does not render children when visible=false, renders when visible=true", () => {
    const { queryByText, rerender } = render(
      <AnimatedModal visible={false} onClose={() => {}}>
        <Text>Modal body</Text>
      </AnimatedModal>
    );

    expect(queryByText("Modal body")).toBeNull();

    rerender(
      <AnimatedModal visible={true} onClose={() => {}}>
        <Text>Modal body</Text>
      </AnimatedModal>
    );

    expect(queryByText("Modal body")).toBeTruthy();
  });

  test("pressing backdrop calls onClose", () => {
    const onClose = jest.fn();

    const { UNSAFE_getAllByType } = render(
      <AnimatedModal visible={true} onClose={onClose}>
        <Text>Modal body</Text>
      </AnimatedModal>
    );

    const touchables = UNSAFE_getAllByType(TouchableWithoutFeedback);
    fireEvent.press(touchables[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("AnimatedButton", () => {
  test("calls onPress when enabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(<AnimatedButton title="Save" onPress={onPress} />);

    fireEvent.press(getByText("Save"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("does NOT call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedButton title="Save" onPress={onPress} disabled />
    );

    // shtyp tekstin direkt (mos e ngjit te parent)
    fireEvent.press(getByText("Save"));
    expect(onPress).not.toHaveBeenCalled();
  });

  test("AnimatedButton renders title", () => {
    const { getByText } = render(<AnimatedButton title="Save" onPress={() => {}} />);
    expect(getByText("Save")).toBeTruthy();
  });
});
