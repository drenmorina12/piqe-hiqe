import { render } from "@testing-library/react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import Button from "../components/ui/Button";

test("Button applies custom container + text styles", () => {
  const { getByText, UNSAFE_getByType } = render(
    <Button
      title="Save"
      onPress={() => {}}
      style={{ backgroundColor: "red" }}
      textStyle={{ fontSize: 22 }}
    />
  );

  // container style (TouchableOpacity)
  const touchable = UNSAFE_getByType(TouchableOpacity);
  const flatContainer = StyleSheet.flatten(touchable.props.style);

  expect(flatContainer.backgroundColor).toBe("red");
  expect(flatContainer.borderRadius).toBe(20); // nga styles.button

  // text style
  const text = getByText("Save");
  const flatText = StyleSheet.flatten(text.props.style);

  expect(flatText.fontSize).toBe(22);
  expect(flatText.color).toBe("#fff");
});
