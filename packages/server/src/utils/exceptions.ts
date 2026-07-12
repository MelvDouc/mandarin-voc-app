import { type Exception } from "common-types";

export function isException(arg: unknown): arg is Exception {
  return arg !== null
  && typeof arg === "object"
  && "kind" in arg;
}
