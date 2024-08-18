import Button from "$/client/components/Button/Button.jsx";
import { type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import api from "$/client/utils/api.js";
import cssClasses from "./TagTable.module.scss";

export default function TagTableRow({ id, value, selectForUpdate, onTagValueUpdated, errorObs }: {
  id: number;
  value: string;
  selectForUpdate: VoidFunction;
  onTagValueUpdated: (subscription: (tagValue: string) => void) => void;
  errorObs: ErrorObs;
}) {
  return (
    <tr>
      <td>{id}</td>
      <td $init={(element) => {
        onTagValueUpdated((tagValue) => { element.innerText = tagValue; });
      }}>{value}</td>
      <td>
        <div className={cssClasses.Actions}>
          <Button color="green" onclick={selectForUpdate}>Update</Button>
          <Button color="red" onclick={createDeleteTagFn(id, errorObs)}>Delete</Button>
        </div>
      </td>
    </tr>
  );
}

function createDeleteTagFn(id: number, errorObs: ErrorObs) {
  return async ({ target }: Event) => {
    const [_, error] = await api.delete(`/tags/${id}`);
    if (error) {
      errorObs.value = error;
      return;
    }
    (target as HTMLButtonElement).closest("tr")?.remove();
  };
}