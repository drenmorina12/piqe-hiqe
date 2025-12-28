// __tests__/Toast.test.js
import Toast from "../components/ui/Toast";
import { render } from "../test-utils";

jest.useFakeTimers();

test("Toast hides after duration", () => {
  const { queryByText, rerender } = render(
    <Toast visible message="Saved!" />
  );

  expect(queryByText("Saved!")).toBeTruthy();

  jest.advanceTimersByTime(3000); // ose sa e ke duration

  rerender(<Toast visible={false} message="Saved!" />);
  expect(queryByText("Saved!")).toBeNull();
});
