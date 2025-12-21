import { render } from "@testing-library/react-native";
import SubjectCard from "../components/ui/SubjectCard";

test("renders 0 collections correctly", () => {
  const onPress = jest.fn();

  const subject = {
    id: "s1",
    name: "Math",
    title: "Math",            // fallback nese komponenta e përdor title
    collectionsCount: 0,
    collections: [],          // fallback nese e përdor arrays
  };

  const { getByTestId, toJSON } = render(
    <SubjectCard
      subject={subject}
      // i japim disa fallback props (nuk dëmtojnë edhe nëse s’përdoren)
      title="Math"
      name="Math"
      collectionsCount={0}
      count={0}
      onPress={onPress}
      onDelete={jest.fn()}
      onEdit={jest.fn()}
    />
  );

  expect(getByTestId("subject-card")).toBeTruthy();
  expect(getByTestId("subject-menu")).toBeTruthy();

  // snapshot për rastin 0 collections
  expect(toJSON()).toMatchSnapshot();
});
