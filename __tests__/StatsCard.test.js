import { render } from "@testing-library/react-native";
import { StatsCard } from "../components/ui/StatsCard";

test("StatsCard snapshot", () => {
  const { toJSON } = render(
    <StatsCard title="Total cards" value="12" />
  );

  expect(toJSON()).toMatchSnapshot();
});
