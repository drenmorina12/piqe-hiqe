import Button from "../components/ui/Button";
import { render } from "../test-utils";

test("Button snapshot", () => {
  const tree = render(<Button title="Save" onPress={() => {}} />).toJSON();
  expect(tree).toMatchSnapshot();
});
