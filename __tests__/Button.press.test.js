import Button from "../components/ui/Button";
import { fireEvent, render } from "../test-utils";

const pressClosestPressable = (node) => {
  let cur = node;
  while (cur && !cur.props?.onPress) cur = cur.parent;
  if (!cur) throw new Error("No pressable parent found");
  fireEvent.press(cur);
};

test("Button press calls onPress", () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Login" onPress={onPress} />);

  pressClosestPressable(getByText("Login"));
  expect(onPress).toHaveBeenCalledTimes(1);
});
