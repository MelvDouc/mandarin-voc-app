import Button from "$/client/components/Button/Button.jsx";
import Dialog from "$/client/components/Dialog/Dialog.jsx";
import type { Tag } from "$/client/types.js";
import api from "$/client/utils/api.js";
import { obs } from "reactfree-jsx";
import cssClasses from "./TagTable.module.scss";

export default function TagTableModal({ getCurrentTagId, getMode, onRequestAddingTag, onRequestUpdatingTag, emitTagAdded, emitTagUpdated }: {
  getCurrentTagId: () => number;
  getMode: () => "add" | "update";
  onRequestAddingTag: (fn: VoidFunction) => void;
  onRequestUpdatingTag: (fn: (tag: Tag) => void) => void;
  emitTagAdded: (tag: Tag) => void;
  emitTagUpdated: (tag: Tag) => void;
}) {
  const tagValueObs = obs("");
  const errorObs = obs<string[] | null>(null);

  const addTag = async () => {
    const value = tagValueObs.value;
    const [id, error] = await api.post<number>("/tags", { value });
    if (error) {
      errorObs.value = error;
      return;
    }
    emitTagAdded({ id, value });
  };

  const updateTag = async () => {
    const id = getCurrentTagId();
    const value = tagValueObs.value;
    const [_, error] = await api.patch(`/tags/${id}`, { id, value });
    if (error) {
      errorObs.value = error;
      return;
    }
    emitTagUpdated({ id, value });
  };

  return (
    <Dialog
      onclose={() => errorObs.value = null}
      onsubmit={async (e) => {
        const dialog = e.currentTarget as HTMLDialogElement;
        e.preventDefault();
        errorObs.value = null;
        switch (getMode()) {
          case "add":
            await addTag();
            break;
          case "update":
            await updateTag();
        }
        if (errorObs.value === null)
          dialog.close();
      }}
      $init={(element) => {
        onRequestAddingTag(() => {
          element.showModal();
          tagValueObs.value = "";
        });
        onRequestUpdatingTag(({ value }) => {
          element.showModal();
          tagValueObs.value = value;
        });
      }}
    >
      <form method="dialog" className={cssClasses.TagTableUpdateModalForm}>
        <input
          type="text"
          placeholder="Value"
          oninput={({ target }) => tagValueObs.value = (target as HTMLInputElement).value}
          $init={(element) => {
            tagValueObs.subscribe((value) => {
              if (element.value !== value)
                element.value = value;
            });
          }}
          required
        />
        <Button color="blue" type="submit">Submit</Button>
      </form>
      {errorObs.map((errors) => (
        errors
          ? (
            <ul>
              {errors.map((error) => (<li>{error}</li>))}
            </ul>
          )
          : null
      ))}
    </Dialog>
  );
}