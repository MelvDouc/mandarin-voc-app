import PasswordResetRequest from "$/client/components/PasswordResetRequest/PasswordResetRequest.jsx";
import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper, { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import Form from "$/client/components/Form/Form.jsx";
import auth from "$/client/state/auth.js";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import api from "$/client/utils/api.js";
import { navigate } from "client-side-router";

export default function LogInPage() {
  const errorObs = createErrorObs();

  const credentials = {
    email: "",
    password: ""
  };

  return (
    <>
      <h1>Log in</h1>
      <ErrorWrapper errorObs={errorObs}>
        <Form onsubmit={createSubmitHandler(errorObs, credentials)}>
          <Form.Row>
            <Form.Column>
              <label htmlFor="email">Email</label>
              <Form.Input type="email" id="email" bind={[credentials, "email"]} required />
            </Form.Column>
          </Form.Row>
          <Form.Row>
            <Form.Column>
              <label htmlFor="password">Password</label>
              <Form.Input type="password" id="password" bind={[credentials, "password"]} required />
            </Form.Column>
          </Form.Row>
          <Form.Row>
            <Button type="submit" color="green">Log in</Button>
          </Form.Row>
        </Form>
      </ErrorWrapper>
      <PasswordResetRequest />
    </>
  );
}

function createSubmitHandler(errorObs: ErrorObs, credentials: { email: string; password: string; }) {
  return async (e: SubmitEvent) => {
    e.preventDefault();
    const [_, error] = await api.post("/auth/log-in", credentials);

    if (error) {
      errorObs.value = error;
      return;
    }

    auth.setEmail(credentials.email);
    addFlashMessage("success", "You're now logged in.");
    navigate("/");
  };
}