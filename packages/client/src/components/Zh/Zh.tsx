import classNames from "classnames";
import cssClasses from "./Zh.module.scss";

export default function Zh({ zh, py, id, highlightedId, setHighlightedId }: {
  zh: string;
  py: string;
  id: number | null;
  highlightedId: number | null;
  setHighlightedId: ((id: number | null) => void) | null;
}) {
  const className = classNames({
    [cssClasses.Zh]: true,
    [cssClasses.highlighted]: highlightedId !== null && highlightedId === id
  });

  const handleMouseEnter = (id === null || setHighlightedId === null) ? void 0 : (() => setHighlightedId(id));
  const handleMouseLeave = (id === null || setHighlightedId === null) ? void 0 : (() => setHighlightedId(null));

  return (
    <ruby className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {zh}<rp>{"("}</rp><rt>{py}</rt><rp>{")"}</rp>
    </ruby>
  );
}