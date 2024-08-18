import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper, { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import Form from "$/client/components/Form/Form.jsx";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default function PasswordResetPage({ id, passwordResetId }: {
  id: string;
  passwordResetId: string;
}) {
  const passwords = {
    password1: "",
    password2: ""
  };
  const errorObs = createErrorObs();

  return (
    <>
      <h1>Update your password</h1>
      <ErrorWrapper errorObs={errorObs}>
        <Form onsubmit={createSubmitHandler(errorObs, id, passwordResetId, passwords)}>
          <Form.Row>
            <Form.Column>
              <label htmlFor="password1">Password</label>
              <Form.Input type="password" id="password1" minLength={8} maxLength={50} bind={[passwords, "password1"]} required />
            </Form.Column>
            <Form.Column>
              <label htmlFor="password2">Confirm password</label>
              <Form.Input type="password" id="password2" minLength={8} maxLength={50} bind={[passwords, "password2"]} required />
            </Form.Column>
          </Form.Row>
          <Form.Row>
            <Form.Column>
              <Button color="green" type="submit">Submit</Button>
            </Form.Column>
          </Form.Row>
        </Form>
      </ErrorWrapper>
    </>
  );
}

function createSubmitHandler(errorObs: ErrorObs, id: string, passwordResetId: string, passwords: {
  password1: string;
  password2: string;
}) {
  return async (e: SubmitEvent) => {
    e.preventDefault();

    if (passwords.password1 !== passwords.password2) {
      errorObs.value = ["Passwords don't match."];
      return;
    }

    const [_, error] = await api.patch(`/auth/reset-password/${id}/${passwordResetId}`, {
      password: passwords.password1
    });

    if (error) {
      errorObs.value = error;
      return;
    }

    addFlashMessage("success", "Your password was updated successfully. You may now log in.");
    navigate("/log-in");
  };
}
