import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper, { type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import Form from "$/client/components/Form/Form.jsx";
import type { Category, WithoutId } from "$/client/types.js";

export default function CategoryForm({ category, handleSubmit, errorObs }: {
  category: Category | null;
  handleSubmit: (category: WithoutId<Category>) => Promise<void>;
  errorObs: ErrorObs;
}) {
  const c = category ?? {
    id: 0,
    name: ""
  };

  const onsubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    await handleSubmit(c);
  };

  return (
    <ErrorWrapper errorObs={errorObs}>
      <Form onsubmit={onsubmit}>
        <Form.Row>
          <Form.Column>
            <label htmlFor="name">Name</label>
            <Form.Input type="text" id="name" value={c.name} bind={[c, "name"]} required />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Button type="submit" color="green">Submit</Button>
        </Form.Row>
      </Form>
    </ErrorWrapper>
  );
}