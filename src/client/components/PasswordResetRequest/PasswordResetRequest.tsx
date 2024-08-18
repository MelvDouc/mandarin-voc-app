import Button from "$/client/components/Button/Button.jsx";
import Dialog from "$/client/components/Dialog/Dialog.jsx";
import ErrorWrapper, { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import { addFlashMessage } from "$/client/state/flash-messages.js";
import api from "$/client/utils/api.js";
import TypedEventEmitter from "$/client/utils/TypedEventEmitter.js";
import { navigate } from "client-side-router";
import cssClasses from "./PasswordResetRequest.module.scss";

export default function PasswordResetRequest() {
  const eventEmitter = new TypedEventEmitter<{
    open: [];
    close: [];
  }>();
  const errorObs = createErrorObs();

  return (
    <div className={cssClasses.PasswordResetRequest}>
      <p onclick={() => eventEmitter.emit("open")}>Password forgotten?</p>
      <Dialog
        $init={(element) => {
          eventEmitter.on("open", () => element.showModal());
          eventEmitter.on("close", () => element.close());
        }}
      >
        <ErrorWrapper errorObs={errorObs}>
          <form onsubmit={createSubmitHandler(errorObs)}>
            <input type="email" name="email" placeholder="email" required />
            <Button color="blue" type="submit">Submit</Button>
          </form>
        </ErrorWrapper>
      </Dialog>
    </div>
  );
}

function createSubmitHandler(errorObs: ErrorObs) {
  return async (e: SubmitEvent) => {
    e.preventDefault();
    const email = new FormData(e.target as HTMLFormElement).get("email");
    const [_, error] = await api.post("/auth/password-reset-request", { email });
    if (error) {
      errorObs.value = error;
      return;
    }
    addFlashMessage("success", `A link to reset your password was sent to ${email}.`);
    navigate("/");
  };
}