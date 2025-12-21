import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SubjectCard from "../components/ui/SubjectCard";

test("delete flow opens confirm modal and closes after confirm", async () => {
  const { getByTestId, findByText, queryByText } = render(
    <SubjectCard subjectName="Math" collectionCount={2} />
  );

  // hap Options
  fireEvent.press(getByTestId("subject-menu"));
  expect(await findByText("Options")).toBeTruthy();

  // hap Confirm delete
  fireEvent.press(getByTestId("subject-delete"));
  expect(await findByText("Confirm delete")).toBeTruthy();

  // konfirmo delete
  fireEvent.press(getByTestId("subject-confirm-delete"));

  // confirm modal duhet me u mbyll
  await waitFor(() => {
    expect(queryByText("Confirm delete")).toBeNull();
  });
});
