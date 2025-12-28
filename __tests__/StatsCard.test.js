import { StatsCard } from "../components/ui/StatsCard";
import { render } from "../test-utils";

test("StatsCard renders basic labels", () => {
  const { getByText, toJSON } = render(<StatsCard title="Total cards" value="12" />);

  // këto i ke në UI sipas output-it
  expect(getByText(/Lehtë/i)).toBeTruthy();
  expect(getByText(/Mesatare/i)).toBeTruthy();
  expect(getByText(/Vështirë/i)).toBeTruthy();

  expect(toJSON()).toBeTruthy();
});
