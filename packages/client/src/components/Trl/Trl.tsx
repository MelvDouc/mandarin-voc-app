import type { Highlightable } from "$/types.ts";
import classNames from "classnames";
import cssClasses from "./Trl.module.scss";

export default function Trl({ value, isHighlighted, setHighlighted }: { value: string; } & Highlightable) {
  const className = classNames({
    [cssClasses.Trl]: true,
    [cssClasses.highlighted]: isHighlighted
  });

  return (
    <span
      className={className}
      onMouseEnter={setHighlighted ? (() => setHighlighted(true)) : void 0}
      onMouseLeave={setHighlighted ? (() => setHighlighted(false)) : void 0}
    >{value}</span>
  );
}