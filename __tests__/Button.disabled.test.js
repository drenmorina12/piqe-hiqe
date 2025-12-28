import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../components/ui/Button";
import { render } from "../test-utils";

const flattenStyle = (style) => {
  if (typeof style === "function") return StyleSheet.flatten(style({ pressed: false }));
  return StyleSheet.flatten(style);
};

test("Button applies custom container + text styles", () => {
  const { getByText, UNSAFE_getByType } = render(
    <Button
      title="Save"
      onPress={() => {}}
      style={{ backgroundColor: "red" }}
      textStyle={{ fontSize: 22 }}
    />
  );

  let container;
  try {
    container = UNSAFE_getByType(TouchableOpacity);
  } catch (e) {
    container = UNSAFE_getByType(Pressable);
  }

  const flatContainer = flattenStyle(container.props.style);
  expect(flatContainer.backgroundColor).toBe("red");

  const text = getByText("Save");
  const flatText = StyleSheet.flatten(text.props.style);

  expect(flatText.fontSize).toBe(22);
});
