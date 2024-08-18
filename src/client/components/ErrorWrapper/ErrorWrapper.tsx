import { obs, type Obs } from "reactfree-jsx";
import cssClasses from "./ErrorWrapper.module.scss";

export default function ErrorWrapper({ errorObs, children }: {
  errorObs: Obs<string[] | null>;
  children?: unknown;
}) {
  return (
    <>
      {children}
      <ul
        className={{
          [cssClasses.ErrorList]: true,
          [cssClasses.visible]: errorObs.map((value) => !!value)
        }}
      >
        {errorObs.map((errors) => (
          (errors ?? []).map((error) => (<li>{error}</li>))
        ))}
      </ul>
    </>
  );
}

export function createErrorObs() {
  return obs<string[] | null>(null);
}

export type ErrorObs = Obs<string[] | null>;