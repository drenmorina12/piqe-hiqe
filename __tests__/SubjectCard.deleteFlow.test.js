import SubjectCard from "../components/ui/SubjectCard";
import { fireEvent, render, waitFor } from "../test-utils";

const DELETE_SUBJECT_RE = /Fshi lëndën|Fshije lëndën|Delete subject/i;
const CONFIRM_TITLE_RE = /Konfirmo fshirjen|Confirm delete/i;
const CONFIRM_BTN_RE = /Po,\s*fshi|Yes,\s*delete|Confirm/i;
const CANCEL_RE = /Anulo|Cancel/i;

test("delete flow opens confirm modal and closes after confirm", async () => {
  const onDelete = jest.fn();
  const subject = { id: "s1", name: "Math", collectionsCount: 2 };

  const { getByTestId, findByText, queryByText } = render(
    <SubjectCard
      subject={subject}
      onPress={() => {}}
      onDelete={onDelete}
      onEdit={() => {}}
    />
  );

  // open options
  fireEvent.press(getByTestId("subject-menu"));

  // press delete (text)
  const deleteBtn = await findByText(DELETE_SUBJECT_RE);
  fireEvent.press(deleteBtn);

  // confirm modal visible
  expect(await findByText(CONFIRM_TITLE_RE)).toBeTruthy();

  // confirm delete (text)
  const confirmBtn = await findByText(CONFIRM_BTN_RE);
  fireEvent.press(confirmBtn);

  // modal should close
  await waitFor(() => {
    expect(queryByText(CONFIRM_TITLE_RE)).toBeNull();
  });
});
