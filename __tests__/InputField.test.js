import { fireEvent, render } from "@testing-library/react-native";
import InputField from "../components/ui/InputField";

test("InputField calls onChangeText when typing", () => {
  const onChangeText = jest.fn();

  const { getByPlaceholderText } = render(
    <InputField placeholder="Email" value="" onChangeText={onChangeText} />
  );

  fireEvent.changeText(getByPlaceholderText("Email"), "aurela@test.com");
  expect(onChangeText).toHaveBeenCalledWith("aurela@test.com");
});
