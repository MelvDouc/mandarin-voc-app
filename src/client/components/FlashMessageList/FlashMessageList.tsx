import type { FlashMessage } from "$/client/types.js";
import type { Obs } from "reactfree-jsx";
import cssClasses from "./FlashMessageList.module.scss";

export default function FlashMessageList({ flashMessageObs }: {
  flashMessageObs: Obs<FlashMessage[]>;
}) {
  return (
    <div className={cssClasses.FlashMessageList}>
      {flashMessageObs.map((messages) => (
        messages.map(({ kind, message }) => (
          <div
            className={{
              [cssClasses.Item]: true,
              [cssClasses.success]: kind === "success",
              [cssClasses.error]: kind === "error",
              [cssClasses.info]: kind === "info"
            }}
          >
            <span>{message}</span>
            <span title="Close" onclick={closeParent}>X</span>
          </div>
        ))
      ))}
    </div>
  );
}

function closeParent({ target }: Event) {
  (target as HTMLElement).parentElement?.remove();
}