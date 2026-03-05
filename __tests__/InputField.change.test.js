import InputField from "../components/ui/InputField";
import { fireEvent, render } from "../test-utils";

test("InputField calls onChangeText when typing", () => {
  const onChangeText = jest.fn();

  const { getByPlaceholderText } = render(
    <InputField placeholder="Email" value="" onChangeText={onChangeText} />
  );

  fireEvent.changeText(getByPlaceholderText("Email"), "aurela@test.com");
  expect(onChangeText).toHaveBeenCalledWith("aurela@test.com");
});
