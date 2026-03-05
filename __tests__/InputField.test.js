import { render } from "../test-utils";

test("StatsCard snapshot", () => {
  const Mod = require("../components/ui/StatsCard");
  const StatsCard = Mod.StatsCard ?? Mod.default ?? Mod;

  const { toJSON } = render(<StatsCard title="Total cards" value="12" />);
  expect(toJSON()).toMatchSnapshot();
});
