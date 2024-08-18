import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper, { createErrorObs, type ErrorObs } from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import TagTableModal from "$/client/components/TagTable/TagTableModal.jsx";
import TagTableRow from "$/client/components/TagTable/TagTableRow.jsx";
import type { Tag } from "$/client/types.js";
import TypedEventEmitter from "$/client/utils/TypedEventEmitter.js";
import cssClasses from "./TagTable.module.scss";

export default function TagTable({ tags }: {
  tags: Tag[];
}) {
  const errorObs = createErrorObs();
  const eventEmitter = new TypedEventEmitter<TagTableEvents>();
  let mode: "add" | "update" = "add";
  let currentTagId = 0;

  eventEmitter.on("requestAddingTag", () => {
    mode = "add";
    currentTagId = 0;
  });
  eventEmitter.on("requestUpdatingTag", (tag) => {
    mode = "update";
    currentTagId = tag.id;
  });

  return (
    <ErrorWrapper errorObs={errorObs}>
      <table className={cssClasses.TagTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody $init={(element) => {
          eventEmitter.on("addTag", (tag) => {
            element.appendChild(<TableRow tag={tag} eventEmitter={eventEmitter} errorObs={errorObs} />);
          });
        }}>
          {tags.map((tag) => (
            <TableRow tag={tag} eventEmitter={eventEmitter} errorObs={errorObs} />
          ))}
        </tbody>
      </table>
      <div>
        <Button color="green" onclick={() => eventEmitter.emit("requestAddingTag")}>Add</Button>
      </div>
      <TagTableModal
        getCurrentTagId={() => currentTagId}
        getMode={() => mode}
        onRequestAddingTag={(fn) => eventEmitter.on("requestAddingTag", fn)}
        onRequestUpdatingTag={(fn) => eventEmitter.on("requestUpdatingTag", fn)}
        emitTagAdded={(tag) => eventEmitter.emit("addTag", tag)}
        emitTagUpdated={(tag) => eventEmitter.emit("updateTag", tag)}
      />
    </ErrorWrapper>
  );
}

function TableRow({ tag, eventEmitter, errorObs }: {
  tag: Tag;
  eventEmitter: TypedEventEmitter<TagTableEvents>;
  errorObs: ErrorObs;
}) {
  return (
    <TagTableRow
      id={tag.id}
      value={tag.value}
      selectForUpdate={() => eventEmitter.emit("requestUpdatingTag", tag)}
      onTagValueUpdated={(fn) => {
        eventEmitter.on("updateTag", ({ id, value }) => {
          if (id === tag.id) fn(value);
        });
      }}
      errorObs={errorObs}
    />
  );
}

type TagTableEvents = {
  requestAddingTag: [];
  requestUpdatingTag: [tag: Tag];
  addTag: [tag: Tag];
  updateTag: [tag: Tag];
};