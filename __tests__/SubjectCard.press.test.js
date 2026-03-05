import SubjectCard from "../components/ui/SubjectCard";
import { fireEvent, render, waitFor } from "../test-utils";

const DELETE_SUBJECT_RE = /Fshi lëndën|Fshije lëndën|Delete subject/i;
const CONFIRM_TITLE_RE = /Konfirmo fshirjen|Confirm delete/i;
const CONFIRM_BTN_RE = /Po,\s*fshi|Yes,\s*delete|Confirm/i;
const CANCEL_RE = /Anulo|Cancel/i;

test("opens Options modal from menu", async () => {
  const subject = { id: "s1", name: "Math", collectionsCount: 2 };

  const { getByTestId, findByText } = render(
    <SubjectCard subject={subject} onPress={() => {}} onDelete={() => {}} onEdit={() => {}} />
  );

  fireEvent.press(getByTestId("subject-menu"));

  // options modal is open if delete option appears
  expect(await findByText(DELETE_SUBJECT_RE)).toBeTruthy();
});

test("opens Confirm delete modal after pressing Delete subject", async () => {
  const subject = { id: "s1", name: "Math", collectionsCount: 2 };

  const { getByTestId, findByText } = render(
    <SubjectCard subject={subject} onPress={() => {}} onDelete={() => {}} onEdit={() => {}} />
  );

  fireEvent.press(getByTestId("subject-menu"));

  const deleteBtn = await findByText(DELETE_SUBJECT_RE);
  fireEvent.press(deleteBtn);

  // confirm modal shows
  expect(await findByText(CONFIRM_TITLE_RE)).toBeTruthy();
  expect(await findByText(CONFIRM_BTN_RE)).toBeTruthy();
});

test("cancel closes confirm modal", async () => {
  const subject = { id: "s1", name: "Math", collectionsCount: 2 };

  const { getByTestId, findByText, queryByText } = render(
    <SubjectCard subject={subject} onPress={() => {}} onDelete={() => {}} onEdit={() => {}} />
  );

  fireEvent.press(getByTestId("subject-menu"));

  const deleteBtn = await findByText(DELETE_SUBJECT_RE);
  fireEvent.press(deleteBtn);

  expect(await findByText(CONFIRM_TITLE_RE)).toBeTruthy();

  fireEvent.press(await findByText(CANCEL_RE));

  await waitFor(() => {
    expect(queryByText(CONFIRM_TITLE_RE)).toBeNull();
  });
});
