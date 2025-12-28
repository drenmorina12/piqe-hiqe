import SubjectCard from "../components/ui/SubjectCard";
import { render } from "../test-utils";

test("renders 0 collections correctly", () => {
  const onPress = jest.fn();

  const subject = {
    id: "s1",
    name: "Math",
    title: "Math",
    collectionsCount: 0,
    collections: [],
  };

  const { getByTestId, toJSON } = render(
    <SubjectCard
      subject={subject}
      subjectName="Math"
      collectionCount={0}
      collectionsCount={0}
      onPress={onPress}
      onDelete={jest.fn()}
      onEdit={jest.fn()}
    />
  );

  expect(getByTestId("subject-card")).toBeTruthy();
  expect(getByTestId("subject-menu")).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});
