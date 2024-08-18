import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper, { type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import Form from "$/client/components/Form/Form.jsx";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default function CreateUserForm({ errorObs }: {
  errorObs: ErrorObs;
}) {
  const user = {
    email: "",
    password: "",
    confirmPassword: ""
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      errorObs.value = ["Passwords don't match."];
      return;
    }
    const [_, error] = await api.post("/auth/user", user);
    if (error) {
      errorObs.value = error;
      return;
    }
    addFlashMessage("success", "The user was added successfully.");
    navigate("/admin/users");
  };

  return (
    <ErrorWrapper errorObs={errorObs}>
      <Form onsubmit={handleSubmit}>
        <Form.Row>
          <Form.Column>
            <label htmlFor="email">Email</label>
            <Form.Input type="email" id="email" bind={[user, "email"]} required />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <label htmlFor="password">Password</label>
            <Form.Input type="password" id="password" minLength={8} maxLength={50} bind={[user, "password"]} required />
          </Form.Column>
          <Form.Column>
            <label htmlFor="confirm-password">Confirm password</label>
            <Form.Input type="password" id="confirm-password" minLength={8} maxLength={50} bind={[user, "confirmPassword"]} required />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Button type="submit" color="green">Submit</Button>
        </Form.Row>
      </Form>
    </ErrorWrapper>
  );
}