import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SubjectCard from "../components/ui/SubjectCard";

test("opens Options modal from menu", async () => {
  const { getByTestId, findByText } = render(
    <SubjectCard subjectName="Math" collectionCount={2} />
  );

  fireEvent.press(getByTestId("subject-menu"));

  expect(await findByText("Options")).toBeTruthy();
});

test("opens Confirm delete modal after pressing Delete subject", async () => {
  const { getByTestId, findByText } = render(
    <SubjectCard subjectName="Math" collectionCount={2} />
  );

  fireEvent.press(getByTestId("subject-menu"));
  await findByText("Options");

  // nëse nuk i ke shtu testID, mundesh me përdor getByText("Delete subject")
  fireEvent.press(getByTestId("subject-delete"));

  expect(await findByText("Confirm delete")).toBeTruthy();
});

test("cancel closes options modal", async () => {
  const { getByTestId, findByText, queryByText } = render(
    <SubjectCard subjectName="Math" collectionCount={2} />
  );

  fireEvent.press(getByTestId("subject-menu"));
  await findByText("Options");

  fireEvent.press(getByTestId("subject-cancel-options"));

  await waitFor(() => {
    expect(queryByText("Options")).toBeNull();
  });
});
