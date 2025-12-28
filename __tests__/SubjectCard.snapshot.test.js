import SubjectCard from "../components/ui/SubjectCard";
import { render } from "../test-utils";

test("SubjectCard snapshot", () => {
  const subject = { id: "s1", name: "Math", collectionsCount: 2, collections: [] };

  const { toJSON } = render(
    <SubjectCard
      subject={subject}
      subjectName="Math"
      collectionCount={2}
      collectionsCount={2}
      onPress={() => {}}
      onDelete={() => {}}
      onEdit={() => {}}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});
