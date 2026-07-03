import type { Highlightable } from "$/types.ts";
import classNames from "classnames";
import cssClasses from "./Zh.module.scss";

export default function Zh({ zh, py, isHighlighted, setHighlighted }: {
  zh: string;
  py: string;
} & Highlightable) {
  const className = classNames({
    [cssClasses.Zh]: true,
    [cssClasses.highlighted]: isHighlighted
  });

  return (
    <ruby
      className={className}
      onMouseEnter={setHighlighted ? (() => setHighlighted(true)) : void 0}
      onMouseLeave={setHighlighted ? (() => setHighlighted(false)) : void 0}
    >
      {zh}<rt>{py}</rt>
    </ruby>
  );
}