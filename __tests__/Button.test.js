import { render } from "@testing-library/react-native";
import Button from "../components/ui/Button";

test("Button snapshot", () => {
  const tree = render(<Button title="Save" onPress={() => {}} />).toJSON();
  expect(tree).toMatchSnapshot();
});
