import { render } from "@testing-library/react-native";
import SubjectCard from "../components/ui/SubjectCard";

test("SubjectCard snapshot", () => {
  const { toJSON } = render(
    <SubjectCard subjectName="Math" collectionCount={2} />
  );

  expect(toJSON()).toMatchSnapshot();
});
