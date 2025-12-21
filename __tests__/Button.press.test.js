import { fireEvent, render } from "@testing-library/react-native";
import Button from "../components/ui/Button";

test("Button press calls onPress", () => {
  const onPress = jest.fn();

  const { getByText } = render(<Button title="Login" onPress={onPress} />);

  fireEvent.press(getByText("Login"));
  expect(onPress).toHaveBeenCalledTimes(1);
});
