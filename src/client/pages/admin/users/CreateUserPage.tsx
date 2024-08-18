import { createErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import CreateUserForm from "$/client/components/forms/CreateUserForm.jsx";

export default function CreateUserPage() {
  return (
    <>
      <h1>Add a user</h1>
      <CreateUserForm errorObs={createErrorObs()} />
    </>
  );
}